package db

import (
	"context"

	"github.com/greghart/climbing-app/internal/models"
	"github.com/greghart/powerputtygo/queryp"
	"github.com/greghart/powerputtygo/sqlp"
)

type Comments struct {
	*sqlp.Repository[models.Comment]
}

func NewComments(db *sqlp.DB) *Comments {
	return &Comments{Repository: sqlp.NewRepository[models.Comment](db, "comment")}
}

// ForCommentableID returns all comments for a given commentableId.
func (r *Comments) ForCommentableID(ctx context.Context, commentableID int64) ([]models.Comment, error) {
	query := queryp.Named(`
		SELECT id, text, commentableId, createdAt, updatedAt
		FROM comment
		WHERE commentableId = :commentableId
		ORDER BY createdAt ASC
	`).Param("commentableId", commentableID)
	return r.Select(ctx, query.String(), query.Args()...)
}
