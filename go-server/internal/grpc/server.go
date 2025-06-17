package grpc

import (
	"context"
	"fmt"
	"net"
	"os"
	"strings"

	"github.com/greghart/climbing-app/internal/db"
	"github.com/greghart/climbing-app/internal/env"
	"github.com/greghart/climbing-app/internal/pb"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/metadata"
	"google.golang.org/grpc/reflection"
	"google.golang.org/grpc/status"
)

var (
	errMissingMetadata = status.Errorf(codes.InvalidArgument, "missing metadata")
	errInvalidToken    = status.Errorf(codes.Unauthenticated, "invalid token")
)

type Server struct {
	pb.UnimplementedClimbServiceServer
	grpc *grpc.Server
	opts Options
	env  *env.Env
}

type Options struct {
	ExpectedHost string
	Port         int
}

func NewServer(env *env.Env, opts Options) *Server {
	return &Server{
		env:  env,
		opts: opts,
	}
}

func (s *Server) Start() error {
	if s.opts.ExpectedHost == "" {
		return fmt.Errorf("ExpectedHost must be set in server options")
	}
	if s.opts.Port == 0 {
		return fmt.Errorf("Port must be set in server options")
	}

	opts := []grpc.ServerOption{
		grpc.UnaryInterceptor(ensureValidToken(os.Getenv("API_KEY"))),
	}
	s.grpc = grpc.NewServer(opts...)
	pb.RegisterClimbServiceServer(s.grpc, s)
	reflection.Register(s.grpc)

	lis, err := net.Listen("tcp", fmt.Sprintf(":%d", s.opts.Port))
	if err != nil {
		return fmt.Errorf("failed to listen: %w", err)
	}
	if err := s.grpc.Serve(lis); err != nil {
		return fmt.Errorf("failed to serve: %w", err)
	}

	return nil
}

func (s *Server) Stop() {
	if s.grpc != nil {
		s.grpc.GracefulStop()
	}
}

func (s *Server) GetCrag(ctx context.Context, req *pb.GetCragRequest) (*pb.GetCragResponse, error) {
	crag, err := s.env.Repos.Crags.GetCrag(ctx, protoToCragReadRequest(req))
	if err != nil {
		return nil, status.Errorf(codes.Unavailable, "failed to get crag %v: %v", req.Id, err)
	}
	if crag == nil {
		return nil, status.Errorf(codes.NotFound, "failed to find crag %v", req.Id)
	}

	return &pb.GetCragResponse{
		Crag: CragToProto(crag),
	}, nil
}

func (s *Server) GetCrags(ctx context.Context, req *pb.GetCragsRequest) (*pb.GetCragsResponse, error) {
	crags, err := s.env.Repos.Crags.GetCrags(ctx, protoToCragsReadRequest(req))
	if err != nil {
		return nil, status.Errorf(codes.Unavailable, "failed to get crags: %v", err)
	}

	var pbCrags []*pb.Crag
	for _, crag := range crags {
		pbCrags = append(pbCrags, CragToProto(&crag))
	}

	return &pb.GetCragsResponse{
		Crags: pbCrags,
	}, nil
}

////////////////////////////////////////////////////////////////////////////////

// ensureValidToken ensures a valid token exists within a request's metadata. If
// the token is missing or invalid, the interceptor blocks execution of the
// handler and returns an error. Otherwise, the interceptor invokes the unary
// handler.
func ensureValidToken(token string) grpc.UnaryServerInterceptor {
	return func(ctx context.Context, req any, _ *grpc.UnaryServerInfo, handler grpc.UnaryHandler) (any, error) {
		md, ok := metadata.FromIncomingContext(ctx)
		if !ok {
			return nil, errMissingMetadata
		}
		// The keys within metadata.MD are normalized to lowercase.
		// See: https://godoc.org/google.golang.org/grpc/metadata#New
		if !valid(md["authorization"], token) {
			return nil, errInvalidToken
		}
		// Continue execution of handler after ensuring a valid token.
		return handler(ctx, req)
	}
}

// valid validates the authorization.
func valid(authorization []string, apiKey string) bool {
	if len(authorization) < 1 {
		return false
	}
	token := strings.TrimPrefix(authorization[0], "Bearer ")
	return token == apiKey
}

func protoToCragsReadRequest(req *pb.GetCragsRequest) db.CragsReadRequest {
	if req.Opts == nil {
		return db.CragsReadRequest{}
	}
	return db.CragsReadRequest{
		IncludeArea:    req.Opts.IncludeAreas,
		IncludeBoulder: req.Opts.IncludeBoulders,
		IncludeParking: req.Opts.IncludeParking,
	}
}

func protoToCragReadRequest(req *pb.GetCragRequest) db.CragsReadRequest {
	out := db.CragsReadRequest{
		ID: req.Id,
	}
	if req.Opts != nil {
		out.IncludeArea = req.Opts.IncludeAreas
		out.IncludeBoulder = req.Opts.IncludeBoulders
		out.IncludeParking = req.Opts.IncludeParking
	}
	return out
}
