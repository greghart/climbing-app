package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"testing"
	"time"

	"github.com/google/go-cmp/cmp"
	"github.com/greghart/climbing-app/internal/config"
	mygrpc "github.com/greghart/climbing-app/internal/grpc"
	"github.com/greghart/climbing-app/internal/models"
	"github.com/greghart/climbing-app/internal/pb"
	"github.com/greghart/powerputtygo/errcmp"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
	"google.golang.org/grpc/metadata"
)

// Note, for integration tests, it's just easier to always test against our domain models, instead
// of comparing protobuf objects (which are code genned and presumed to be correct).
// That means we're implicitly testing both the domain to GRPC conversion, as well as the
// GRPC to domain conversion, which is our code.

func TestServer_crags(t *testing.T) {
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

	t.Run("GetCrag Santee", func(t *testing.T) {
		res, err := client.GetCrag(ctx, &pb.GetCragRequest{
			Id: 55,
		})
		errcmp.MustMatch(t, err, "")
		expected := mygrpc.ProtoToCrag(&pb.Crag{
			Id:          55,
			Name:        "Santee",
			Description: "Welcome to Santee, your local slab and crack training mecca.",
			Center:      &pb.Coordinate{Lat: 32.850515, Lng: -117.022235},
			Areas: []*pb.Area{
				{Id: 226, Name: "Dog Pile Area"},
				{Id: 227, Name: "Hillside Area"},
				{Id: 228, Name: "Moby Dick Area"},
				{Id: 229, Name: "Synchronicity Area"},
			},
		})
		actual := mygrpc.ProtoToCrag(res.Crag)
		if !cmp.Equal(actual, expected, cragComparer) {
			t.Errorf("GetCrag response mismatch (-got +want):\n%v", cmp.Diff(actual, expected, cragComparer))
		}
	})
}

// //////////////////////////////////////////////////////////////////////////////
// TODO: Setup a test util package for our entity comparers in a shared space
func _ptrComparer[T any](cmp func(a, b T) bool) func(x, y *T) bool {
	return func(x, y *T) bool {
		if x == nil && y == nil {
			return true
		}
		if x != nil && y != nil {
			return cmp(*x, *y)
		}
		return false
	}
}

var _ptrStringComparer = _ptrComparer(func(a, b string) bool { return a == b })

func _sliceComparer[T any](a1, a2 []T, cmp func(a, b T) bool) bool {
	if len(a1) == 0 && len(a2) == 0 {
		return true
	}
	if len(a1) != len(a2) {
		return false
	}
	if a1 != nil && a2 != nil {
		x, rest1 := a1[0], a1[1:]
		y, rest2 := a2[0], a2[1:]
		return cmp(x, y) && _sliceComparer(rest1, rest2, cmp)
	}
	return false
}

func _routeComparer(x, y models.Route) bool {
	return (x.ID == y.ID &&
		x.Name == y.Name &&
		x.GradeRaw == y.GradeRaw &&
		_ptrStringComparer(x.Description, y.Description))
}

func _boulderComparer(x, y models.Boulder) bool {
	return (x.ID == y.ID &&
		x.Name == y.Name &&
		cmp.Equal(x.Coordinates, y.Coordinates) &&
		// TODO Polygon comparer
		// TODO Comments comparer
		// TODO Photo comparer
		_ptrStringComparer(x.Description, y.Description) &&
		_sliceComparer(x.Routes, y.Routes, _routeComparer))
}

func _areaComparer(x, y models.Area) bool {
	return (x.ID == y.ID &&
		x.Name == y.Name &&
		_ptrStringComparer(x.Description, y.Description) &&
		_sliceComparer(x.Boulders, y.Boulders, _boulderComparer))
}

func _cragComparer(x, y models.Crag) bool {
	return (x.ID == y.ID &&
		x.Name == y.Name &&
		// TODO Bounds comparer, zoom comparers, comment comparer, photo comparer, trail comparer, timestamps comparer
		_ptrStringComparer(x.Description, y.Description) &&
		cmp.Equal(x.Center, y.Center) &&
		_sliceComparer(x.Areas, y.Areas, _areaComparer))
}

var cragComparer = cmp.Comparer(_cragComparer)

////////////////////////////////////////////////////////////////////////////////

// grpcServer returns a locally running grpc grpcServer that we can make requests against
func grpcServer(t *testing.T) *mygrpc.Server {
	t.Helper()

	cfg := config.Load()
	env := config.NewEnv(cfg)

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
