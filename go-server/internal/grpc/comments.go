package grpc

import (
	"context"
	"log/slog"

	"github.com/greghart/climbing-app/internal/models"
	"github.com/greghart/climbing-app/internal/pb"
	"github.com/greghart/climbing-app/internal/service"
	"github.com/greghart/powerputtygo/utilp"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (s *Server) GetComments(ctx context.Context, _req *pb.GetCommentsRequest) (*pb.GetCommentsResponse, error) {
	slog.Debug("GetComments called", "entity_type", _req.GetEntityType(), "entity_id", _req.GetEntityId())

	// Validate request
	if _req == nil || _req.GetEntityType() == pb.CommentableEntityType_COMMENTABLE_ENTITY_TYPE_UNSPECIFIED || _req.GetEntityId() == 0 {
		return nil, status.Errorf(codes.InvalidArgument, "invalid request: entity_type and entity_id required")
	}

	// Map proto enum to service layer type
	var entityType service.CommentableEntityType
	switch _req.GetEntityType() {
	case pb.CommentableEntityType_COMMENTABLE_ENTITY_TYPE_CRAG:
		entityType = service.CommentableCrag
	case pb.CommentableEntityType_COMMENTABLE_ENTITY_TYPE_AREA:
		entityType = service.CommentableArea
	case pb.CommentableEntityType_COMMENTABLE_ENTITY_TYPE_BOULDER:
		entityType = service.CommentableBoulder
	case pb.CommentableEntityType_COMMENTABLE_ENTITY_TYPE_ROUTE:
		entityType = service.CommentableRoute
	default:
		return nil, status.Errorf(codes.InvalidArgument, "unknown entity_type")
	}

	comments, err := s.env.Services.Comments.GetComments(ctx, &service.GetCommentsOptions{
		EntityType: entityType,
		EntityID:   _req.GetEntityId(),
	})
	if err != nil {
		return nil, status.Errorf(codes.Unavailable, "failed to get comments: %v", err)
	}

	resp := &pb.GetCommentsResponse{
		Comments: utilp.Map(comments, func(c models.Comment) *pb.Comment {
			return CommentToProto(&c)
		}),
	}
	return resp, nil
}
