package grpc

import (
	"context"
	"fmt"
	"log/slog"

	"github.com/greghart/climbing-app/internal/pb"
	"github.com/greghart/climbing-app/internal/service"
	"github.com/greghart/powerputtygo/servicep"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (s *Server) GetCrag(ctx context.Context, _req *pb.GetCragRequest) (*pb.GetCragResponse, error) {
	req := (*GetCragRequest)(_req)
	if err := req.Validate(); err != nil {
		return nil, status.Errorf(codes.InvalidArgument, "invalid request: %v", err)
	}

	crag, err := s.env.Services.Crags.GetCrag(ctx, req.ToService())
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

func (s *Server) ListCrags(ctx context.Context, _req *pb.ListCragsRequest) (*pb.ListCragsResponse, error) {
	req := (*ListCragsRequest)(_req)
	if err := req.Validate(); err != nil {
		return nil, status.Errorf(codes.InvalidArgument, "invalid request: %v", err)
	}

	crags, err := s.env.Services.Crags.ListCrags(ctx, req.ToService())
	if err != nil {
		return nil, status.Errorf(codes.Unavailable, "failed to get crags: %v", err)
	}

	var pbCrags []*pb.Crag
	for _, crag := range crags {
		pbCrags = append(pbCrags, CragToProto(&crag))
	}

	return &pb.ListCragsResponse{
		Crags: pbCrags,
	}, nil
}

func (s *Server) UpdateCrag(ctx context.Context, _req *pb.UpdateCragRequest) (*pb.UpdateCragResponse, error) {
	req := (*UpdateCragRequest)(_req)
	if err := req.Validate(); err != nil {
		return nil, status.Errorf(codes.InvalidArgument, "invalid request: %v", err)
	}

	err := s.env.Services.Crags.Update(ctx, req.ToService())
	if err != nil {
		return nil, status.Errorf(codes.Unavailable, "failed to update crag: %v", err)
	}
	return &pb.UpdateCragResponse{}, nil
}

////////////////////////////////////////////////////////////////////////////////

type ListCragsRequest pb.ListCragsRequest

func (req *ListCragsRequest) Validate() error {
	if req.Opts != nil {
		if err := service.ValidateIncludes(service.CragsIncludeSchema, req.Opts.Includes); err != nil {
			return fmt.Errorf("invalid include requested: %w", err)
		}
	}
	return nil
}

func (req *ListCragsRequest) ToService() service.CragsReadRequest {
	if req.Opts == nil {
		return service.CragsReadRequest{}
	}
	return service.CragsReadRequest{
		Include: service.CragsIncludeSchema.Include(req.Opts.Includes...),
	}
}

type GetCragRequest pb.GetCragRequest

func (req *GetCragRequest) Validate() error {
	if req.Opts != nil {
		if err := service.ValidateIncludes(service.CragsIncludeSchema, req.Opts.Includes); err != nil {
			return fmt.Errorf("invalid include requested: %w", err)
		}
	}
	return nil
}

func (req *GetCragRequest) ToService() service.CragsReadRequest {
	out := service.CragsReadRequest{
		ID: req.Id,
	}
	if req.Opts != nil {
		out.Include = service.CragsIncludeSchema.Include(req.Opts.Includes...)
	}
	return out
}

type UpdateCragRequest pb.UpdateCragRequest

func (req *UpdateCragRequest) Validate() error {
	if req.RequestedAt.AsTime().IsZero() {
		return fmt.Errorf("requested_at must be set")
	}
	return nil
}

func (req *UpdateCragRequest) ToService() service.CragUpdateRequest {
	slog.Info("UpdateCragRequest.ToService", "req", req)
	return service.CragUpdateRequest{
		ID:          req.Id,
		FieldMask:   servicep.NewFieldMaskFromPB(req.FieldMask),
		Name:        req.Name,
		Description: servicep.ZeroToPtr(req.Description),
		Trail:       ProtoToTrail(req.Trail),
		Bounds:      ProtoToBounds(req.Bounds),
		RequestedAt: req.RequestedAt.AsTime(),
	}
}
