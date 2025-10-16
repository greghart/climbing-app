package grpc

import (
	"context"
	"fmt"

	"github.com/greghart/climbing-app/internal/models"
	"github.com/greghart/climbing-app/internal/pb"
	"github.com/greghart/climbing-app/internal/service"
	"github.com/greghart/powerputtygo/utilp"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (s *Server) GetComments(ctx context.Context, _req *pb.GetCommentsRequest) (*pb.GetCommentsResponse, error) {
	req := (*GetCommentsRequest)(_req)
	// Validate request
	if err := req.Validate(); err != nil {
		return nil, status.Errorf(codes.InvalidArgument, "invalid request: %v", err)
	}

	comments, err := s.env.Services.Comments.GetComments(ctx, req.ToService())
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

func (s *Server) CreateComment(ctx context.Context, _req *pb.CreateCommentRequest) (*pb.CreateCommentResponse, error) {
	req := (*CreateCommentRequest)(_req)
	// Validate request
	if err := req.Validate(); err != nil {
		return nil, status.Errorf(codes.InvalidArgument, "invalid request: %v", err)
	}

	comment, err := s.env.Services.Comments.CreateComment(ctx, req.ToService())
	if err != nil {
		return nil, status.Errorf(codes.Unavailable, "failed to create comment: %v", err)
	}

	resp := &pb.CreateCommentResponse{
		Comment: CommentToProto(comment),
	}
	return resp, nil
}

type GetCommentsRequest pb.GetCommentsRequest

func (req *GetCommentsRequest) Validate() error {
	if req.EntityType == pb.CommentableEntityType_COMMENTABLE_ENTITY_TYPE_UNSPECIFIED {
		return fmt.Errorf("entity_type must be set")
	}
	if req.EntityId == 0 {
		return fmt.Errorf("entity_id must be set")
	}
	return nil
}

func (req *GetCommentsRequest) ToService() *service.GetCommentsOptions {
	return &service.GetCommentsOptions{
		EntityType: CommentableEntityType(req.EntityType).ToService(),
		EntityID:   req.EntityId,
	}
}

type CreateCommentRequest pb.CreateCommentRequest

func (req *CreateCommentRequest) Validate() error {
	if req.EntityType == pb.CommentableEntityType_COMMENTABLE_ENTITY_TYPE_UNSPECIFIED {
		return fmt.Errorf("entity_type must be set")
	}
	if req.EntityId == 0 {
		return fmt.Errorf("entity_id must be set")
	}
	if req.Text == "" {
		return fmt.Errorf("text must be set")
	}
	return nil
}

func (req *CreateCommentRequest) ToService() *service.CreateCommentOptions {
	return &service.CreateCommentOptions{
		EntityType: CommentableEntityType(req.EntityType).ToService(),
		EntityID:   req.EntityId,
		Text:       req.Text,
	}
}

type CommentableEntityType pb.CommentableEntityType

func (et CommentableEntityType) ToService() service.CommentableEntityType {
	switch pb.CommentableEntityType(et) {
	case pb.CommentableEntityType_COMMENTABLE_ENTITY_TYPE_CRAG:
		return service.CommentableCrag
	case pb.CommentableEntityType_COMMENTABLE_ENTITY_TYPE_AREA:
		return service.CommentableArea
	case pb.CommentableEntityType_COMMENTABLE_ENTITY_TYPE_BOULDER:
		return service.CommentableBoulder
	case pb.CommentableEntityType_COMMENTABLE_ENTITY_TYPE_ROUTE:
		return service.CommentableRoute
	default:
		return service.CommentableCrag // Default case, should not happen due to validation
	}
}
