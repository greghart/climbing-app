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

func (s *Server) GetArea(ctx context.Context, _req *pb.GetAreaRequest) (*pb.GetAreaResponse, error) {
	req := (*GetAreaRequest)(_req)
	if err := req.Validate(); err != nil {
		return nil, status.Errorf(codes.InvalidArgument, "invalid request: %v", err)
	}

	area, err := s.env.Services.Areas.GetArea(ctx, req.ToService())
	if err != nil {
		return nil, status.Errorf(codes.Unavailable, "failed to get area %v: %v", req.Id, err)
	}
	if area == nil {
		return nil, status.Errorf(codes.NotFound, "failed to find area %v", req.Id)
	}

	return &pb.GetAreaResponse{
		Area: AreaToProto(area),
	}, nil
}

func (s *Server) UpdateArea(ctx context.Context, _req *pb.UpdateAreaRequest) (*pb.UpdateAreaResponse, error) {
	req := (*UpdateAreaRequest)(_req)
	if err := req.Validate(); err != nil {
		return nil, status.Errorf(codes.InvalidArgument, "invalid request: %v", err)
	}

	err := s.env.Services.Areas.Update(ctx, req.ToService())
	if err != nil {
		return nil, status.Errorf(codes.Unavailable, "failed to update area: %v", err)
	}
	return &pb.UpdateAreaResponse{}, nil
}

////////////////////////////////////////////////////////////////////////////////

type GetAreaRequest pb.GetAreaRequest

func (req *GetAreaRequest) Validate() error {
	if req.Opts != nil {
		if err := service.ValidateIncludes(service.AreasIncludeSchema, req.Opts.Includes); err != nil {
			return fmt.Errorf("invalid include requested: %w", err)
		}
	}
	return nil
}

func (req *GetAreaRequest) ToService() service.AreasReadRequest {
	out := service.AreasReadRequest{
		IDs: []int64{req.Id},
	}
	if req.Opts != nil {
		out.Include = service.AreasIncludeSchema.Include(req.Opts.Includes...)
	}
	return out
}

type UpdateAreaRequest pb.UpdateAreaRequest

func (req *UpdateAreaRequest) Validate() error {
	if req.RequestedAt.AsTime().IsZero() {
		return fmt.Errorf("requested_at must be set")
	}
	return nil
}

func (req *UpdateAreaRequest) ToService() service.AreaUpdateRequest {
	slog.Info("UpdateAreaRequest.ToService", "req", req)
	return service.AreaUpdateRequest{
		ID:          req.Id,
		FieldMask:   servicep.NewFieldMaskFromPB(req.FieldMask),
		Name:        req.Name,
		Description: servicep.ZeroToPtr(req.Description),
		Polygon:     ProtoToPolygon(req.Polygon),
		RequestedAt: req.RequestedAt.AsTime(),
	}
}
