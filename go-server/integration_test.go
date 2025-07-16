package main

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"os"
	"strings"
	"testing"
	"time"

	"github.com/google/go-cmp/cmp"
	"github.com/google/go-cmp/cmp/cmpopts"
	"github.com/greghart/climbing-app/internal/config"
	"github.com/greghart/climbing-app/internal/env"
	mygrpc "github.com/greghart/climbing-app/internal/grpc"
	myhttp "github.com/greghart/climbing-app/internal/http"
	"github.com/greghart/climbing-app/internal/models"
	"github.com/greghart/climbing-app/internal/pb"
	"github.com/greghart/climbing-app/internal/service"
	"github.com/greghart/climbing-app/internal/testutil"
	"github.com/greghart/powerputtygo/errcmp"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
	"google.golang.org/grpc/metadata"
	"google.golang.org/protobuf/types/known/fieldmaskpb"
)

// Integration tests that test against actual running server against actual database.
// We use Santee which shouldn't really change ever, so it's a fair and easy way to get pretty
// robust snapshot testing.

func BenchmarkGrpcServer(b *testing.B) {
	grpcServer(b)
	client := grpcClient(b)

	for b.Loop() {
		_, err := client.GetCrag(context.Background(), &pb.GetCragRequest{
			Id: 55,
			Opts: &pb.ReadCragOptions{
				Includes: includes,
			},
		})
		errcmp.MustMatch(b, err, "")
	}
}

func TestHttpServer_crags(t *testing.T) {
	httpServer(t)

	// All tests should run fast
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	t.Cleanup(cancel)

	client := http.DefaultClient

	t.Run("/v1/crags/:id 404", func(t *testing.T) {
		res, err := client.Do(newRequest(ctx, http.MethodGet, "/v1/crags/-1", nil))
		errcmp.MustMatch(t, err, "")
		if res.StatusCode != 404 {
			t.Errorf("http status = %d, wanted 404", res.StatusCode)
		}
	})

	t.Run("/v1/crags/[santee]", func(t *testing.T) {
		req := newRequest(ctx, http.MethodGet, fmt.Sprintf("/v1/crags/%d", santeeId), nil)
		q := req.URL.Query()
		for _, i := range includes {
			q.Add("includes[]", i)
		}
		req.URL.RawQuery = q.Encode()
		t.Logf("URL: %s", req.URL.String())

		res, err := client.Do(req)
		errcmp.MustMatch(t, err, "")
		if res.StatusCode != 200 {
			t.Errorf("http status = %d, wanted 200", res.StatusCode)
		}

		var actual models.Crag
		errcmp.MustMatch(t, json.NewDecoder(res.Body).Decode(&actual), "")
		expected := testutil.LoadCragFromJSON(t, santeeFixturePath)
		if !cmp.Equal(&actual, expected, cmpOpts) {
			t.Errorf("crag response mismatch (-got +want):\n%v", cmp.Diff(actual, expected, cmpOpts))
		}
	})
}

func TestGrpcServer_crags(t *testing.T) {
	grpcServer(t)

	// All tests should run fast
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	t.Cleanup(cancel)

	client := grpcClient(t)

	t.Run("GetCrag 404", func(t *testing.T) {
		_, err := client.GetCrag(ctx, &pb.GetCragRequest{
			Id: -1,
		})
		errcmp.MustMatch(t, err, "rpc error: code = NotFound desc = failed to find crag -1")
	})

	t.Run("snapshot Santee", func(t *testing.T) {
		t.SkipNow()

		cfg := config.Load()
		env := env.New(cfg)
		defer env.Stop()
		errcmp.MustMatch(t, env.Start(), "")

		crag, err := env.Services.Crags.GetCrag(ctx, service.CragsReadRequest{
			ID:      santeeId,
			Include: service.CragsIncludeSchema.Include(includes...),
		})
		errcmp.MustMatch(t, err, "")

		f, err := os.OpenFile(santeeFixturePath, os.O_WRONLY|os.O_CREATE|os.O_TRUNC, 0644)
		errcmp.MustMatch(t, err, "")
		defer f.Close()

		err = json.NewEncoder(f).Encode(crag)
		errcmp.MustMatch(t, err, "")
	})

	t.Run("GetCrag Santee", func(t *testing.T) {
		res, err := client.GetCrag(ctx, &pb.GetCragRequest{
			Id: santeeId,
			Opts: &pb.ReadCragOptions{
				Includes: includes,
			},
		})
		errcmp.MustMatch(t, err, "")

		// Load expected crag from testdata/santee.json
		expected := testutil.LoadCragFromJSON(t, santeeFixturePath)
		actual := mygrpc.ProtoToCrag(res.Crag)
		if !cmp.Equal(actual, expected, cmpOpts) {
			t.Errorf("GetCrag response mismatch (-got +want):\n%v", cmp.Diff(actual, expected, cmpOpts))
		}
	})

	t.Run("UpdateCrag Santee", func(t *testing.T) {
		name := "Santee Update"
		original, err := client.GetCrag(ctx, &pb.GetCragRequest{
			Id: santeeId,
		})
		errcmp.MustMatch(t, err, "")
		defer func() {
			_, err = client.UpdateCrag(ctx, &pb.UpdateCragRequest{
				Id: santeeId,
				FieldMask: &fieldmaskpb.FieldMask{
					Paths: []string{"name"},
				},
				Name: original.Crag.Name,
			})

		}()

		_, err = client.UpdateCrag(ctx, &pb.UpdateCragRequest{
			Id: santeeId,
			FieldMask: &fieldmaskpb.FieldMask{
				Paths: []string{"name"},
			},
			Name: name,
		})

		updated, err := client.GetCrag(ctx, &pb.GetCragRequest{
			Id: santeeId,
		})
		errcmp.MustMatch(t, err, "")

		if updated.Crag.Name != name {
			t.Errorf("updated crag name = %s, expected %s", updated.Crag.Name, name)
		}
	})
}

////////////////////////////////////////////////////////////////////////////////

// httpServer returns a locally running http httpServer that we can make requests against
func httpServer(t testing.TB) *myhttp.Server {
	t.Helper()

	cfg := config.Load()
	env := env.New(cfg)

	if err := env.Start(); err != nil {
		t.Fatalf("Failed to start environment: %v", err)
	}
	t.Cleanup(env.Stop)

	httpServer := myhttp.NewServer(env, myhttp.Options{
		ExpectedHost: cfg.ExpectedHost,
		Port:         cfg.HTTPPort,
	})
	t.Cleanup(func() {
		httpServer.Stop(context.Background()) // nolint:errcheck
	})

	go func() {
		if err := httpServer.Start(); !errors.Is(err, http.ErrServerClosed) {
			log.Panicf("http server fail: %v", err)
		}
	}()

	time.Sleep(50 * time.Millisecond) // wait for server spin up
	return httpServer
}

func newRequest(ctx context.Context, method, path string, body io.Reader) *http.Request {
	u := &url.URL{
		Scheme: "http",
		Host:   fmt.Sprintf("localhost:%d", config.Load().HTTPPort),
		Path:   path,
	}
	req, _ := http.NewRequestWithContext(ctx, method, u.String(), body) // nolint:errcheck
	req.Header.Add("X-API-Key", os.Getenv("API_KEY"))
	return req
}

// grpcServer returns a locally running grpc grpcServer that we can make requests against
func grpcServer(t testing.TB) *mygrpc.Server {
	t.Helper()

	cfg := config.Load()
	env := env.New(cfg)

	if err := env.Start(); err != nil {
		t.Fatalf("Failed to start environment: %v", err)
	}
	t.Cleanup(env.Stop)

	grpcServer := mygrpc.NewServer(env, mygrpc.Options{
		ExpectedHost: cfg.ExpectedHost,
		Port:         cfg.GRPCPort,
	})
	t.Cleanup(grpcServer.Stop)

	go func() {
		if err := grpcServer.Start(); err != nil {
			log.Panicf("grpc server fail: %v", err)
		}
	}()

	return grpcServer
}

func grpcClient(t testing.TB) pb.ClimbServiceClient {
	t.Helper()

	md := metadata.Pairs("Authorization", "Bearer "+os.Getenv("API_KEY"))
	opts := []grpc.DialOption{
		grpc.WithTransportCredentials(insecure.NewCredentials()),
		grpc.WithUnaryInterceptor(func(_ctx context.Context, method string, req, reply any, cc *grpc.ClientConn, invoker grpc.UnaryInvoker, opts ...grpc.CallOption) error {
			ctx := metadata.NewOutgoingContext(_ctx, md)
			return invoker(ctx, method, req, reply, cc, opts...)
		}),
	}
	conn, err := grpc.NewClient(fmt.Sprintf("localhost:%d", config.Load().GRPCPort), opts...)
	if err != nil {
		t.Fatalf("Failed to create gRPC client: %v", err)
	}
	t.Cleanup(func() {
		if err := conn.Close(); err != nil {
			t.Errorf("Failed to close gRPC client: %v", err)
		}
	})

	client := pb.NewClimbServiceClient(conn)
	return client
}

var (
	// Santee is a good option for snapshot testing, since it should basically never change.
	santeeId          = int64(55)
	santeeFixturePath = "./testdata/santee.json"
	includes          = []string{
		"areas.boulders.routes", "areas.polygon.coordinates", "parking", "trail.lines",
	}
	cmpOpts = cmp.Options{
		// EquateEmpty for now until I decide whether I care about this
		cmpopts.EquateEmpty(),
		// For integration test, we can ignore update timestamps since those are expected to change
		cmp.FilterPath(
			func(p cmp.Path) bool {
				return strings.Contains(p.String(), "UpdatedAt") || strings.Contains(p.String(), "CreatedAt")
			},
			cmp.Ignore(),
		),
	}
)
