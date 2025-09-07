package service

import (
	"context"
	"fmt"

	"github.com/greghart/climbing-app/internal/models"
	"github.com/greghart/powerputtygo/servicep"
)

// Comments is the service level comments handler
// This service should abstract a way the "commentable" single table inheritance implementation,
// and let users work directly with comments and the types they want comments for.
type Comments struct {
	*Services
}

func NewComments(services *Services) *Comments {
	return &Comments{
		Services: services,
	}
}

// GetComments returns comments for a given entity.
func (s *Comments) GetComments(ctx context.Context, req *GetCommentsOptions) ([]models.Comment, error) {
	finish := getCommentsObserver()
	defer finish()

	commentableID, err := s.lookupCommentableID(ctx, req.EntityType, req.EntityID)
	if err != nil {
		return nil, err
	}
	if commentableID == 0 {
		return nil, nil
	}
	return s.repos.Comments.ForCommentableID(ctx, commentableID)
}

// CreateComment creates a comment for a given entity, creating the commentable if needed.
func (s *Comments) CreateComment(ctx context.Context, req *CreateCommentOptions) (*models.Comment, error) {
	finish := createCommentObserver()
	defer finish()

	comment := models.Comment{
		Text: req.Text,
	}
	err := s.repos.Commentables.RunInTx(ctx, func(ctx context.Context) error {
		commentableID, err := s.lookupCommentableID(ctx, req.EntityType, req.EntityID)
		if err != nil {
			return fmt.Errorf("failed to lookup commentable id for %s-%d: %w", req.EntityType, req.EntityID, err)
		}
		if commentableID == 0 {
			commentable := models.Commentable{
				Descriptor: fmt.Sprintf("%s-%d", req.EntityType, req.EntityID),
			}
			res, err := s.repos.Commentables.Insert(ctx, commentable)
			if err != nil {
				return fmt.Errorf("failed to insert commentable for %s-%d: %w", req.EntityType, req.EntityID, err)
			}
			commentableID, err = res.LastInsertId()
			if err != nil {
				return fmt.Errorf("failed to get last insert id for commentable %s-%d: %w", req.EntityType, req.EntityID, err)
			}
		}
		comment.CommentableID = commentableID
		res, err := s.repos.Comments.Insert(ctx, comment)
		if err != nil {
			return fmt.Errorf("failed to insert comment for %s-%d (%d): %w", req.EntityType, req.EntityID, commentableID, err)
		}
		id, err := res.LastInsertId()
		if err != nil {
			return fmt.Errorf("failed to get last insert id for comment: %w", err)
		}
		comment.ID = id
		return nil
	})
	if err != nil {
		return nil, err
	}
	return &comment, nil
}

func (s *Comments) lookupCommentableID(ctx context.Context, entityType CommentableEntityType, entityID int64) (int64, error) {
	switch entityType {
	case CommentableCrag:
		crag, err := s.repos.Crags.Find(ctx, entityID)
		if err == nil && crag != nil {
			return *crag.CommentableID, nil
		}
		return 0, err
	case CommentableArea:
		area, err := s.repos.Areas.Find(ctx, entityID)
		if err == nil && area != nil {
			return *area.CommentableID, nil
		}
		return 0, err
	case CommentableBoulder:
		boulder, err := s.repos.Boulders.Find(ctx, entityID)
		if err == nil && boulder != nil {
			return *boulder.CommentableID, nil
		}
		return 0, err
	case CommentableRoute:
		route, err := s.repos.Routes.Find(ctx, entityID)
		if err == nil && route != nil {
			return *route.CommentableID, nil
		}
		return 0, err
	}
	return 0, nil
}

////////////////////////////////////////////////////////////////////////////////

// GetCommentsOptions is the request for GetComments.
type GetCommentsOptions struct {
	EntityType CommentableEntityType
	EntityID   int64
}

// CreateCommentOptions is the request for CreateComment.
type CreateCommentOptions struct {
	*servicep.FieldMask
	EntityType CommentableEntityType
	EntityID   int64
	Text       string
}

////////////////////////////////////////////////////////////////////////////////

// CommentableEntityType enumerates entities that can have comments.
type CommentableEntityType string

const (
	CommentableCrag    CommentableEntityType = "crag"
	CommentableArea    CommentableEntityType = "area"
	CommentableBoulder CommentableEntityType = "boulder"
	CommentableRoute   CommentableEntityType = "route"
)
