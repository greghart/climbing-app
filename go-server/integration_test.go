package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"strings"
	"testing"
	"time"

	"github.com/google/go-cmp/cmp"
	"github.com/google/go-cmp/cmp/cmpopts"
	"github.com/greghart/climbing-app/internal/config"
	"github.com/greghart/climbing-app/internal/db"
	"github.com/greghart/climbing-app/internal/env"
	mygrpc "github.com/greghart/climbing-app/internal/grpc"
	"github.com/greghart/climbing-app/internal/pb"
	"github.com/greghart/climbing-app/internal/testutil"
	"github.com/greghart/powerputtygo/errcmp"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
	"google.golang.org/grpc/metadata"
)

// Currently this is just testing the gRPC server and client, as well as our adapter layer, against
// the actual database. We use Santee which shouldn't really change ever, so it's a fair and easy
// thing to run snapshots against.

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

	// Santee is a good option for snapshot testing, since it should basically never change.
	santeeId := int64(55)
	santeeFixturePath := "./testdata/santee.json"

	t.Run("snapshot Santee", func(t *testing.T) {
		t.SkipNow()

		cfg := config.Load()
		env := env.New(cfg)
		defer env.Stop()
		errcmp.MustMatch(t, env.Start(), "")

		crag, err := env.Repos.Crags.GetCrag(ctx, db.CragsReadRequest{
			ID:      santeeId,
			Include: db.CragsIncludeSchema.Include("areas.boulders", "parking"),
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
				Includes: []string{"areas.boulders", "parking"},
			},
		})
		errcmp.MustMatch(t, err, "")

		// Load expected crag from testdata/santee.json
		expected := testutil.LoadCragFromJSON(t, santeeFixturePath)
		actual := mygrpc.ProtoToCrag(res.Crag)
		opts := cmp.Options{
			cmpopts.EquateEmpty(),
			// For integration test, we can ignore update timestamps since those are expected to change
			cmp.FilterPath(
				func(p cmp.Path) bool {
					return strings.Contains(p.String(), "UpdatedAt") || strings.Contains(p.String(), "CreatedAt")
				},
				cmp.Ignore(),
			),
		}
		data, _ := json.MarshalIndent(actual, "", "  ")
		t.Logf("actual: %+v", string(data))
		if !cmp.Equal(actual, expected, opts) {
			t.Errorf("GetCrag response mismatch (-got +want):\n%v", cmp.Diff(actual, expected, opts))
		}
	})
}

////////////////////////////////////////////////////////////////////////////////

// grpcServer returns a locally running grpc grpcServer that we can make requests against
func grpcServer(t *testing.T) *mygrpc.Server {
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

func grpcClient(t *testing.T) pb.ClimbServiceClient {
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
