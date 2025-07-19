package db

import (
	"context"

	"github.com/greghart/climbing-app/internal/models"
	"github.com/greghart/powerputtygo/sqlp"
)

// TrailLines handles operations on the trail_line table.
type TrailLines struct {
	*sqlp.Repository[models.Line]
}

func NewTrailLines(db *sqlp.DB) *TrailLines {
	return &TrailLines{
		Repository: sqlp.NewRepository[models.Line](db, "trail_line").
			WithIdentifier(func(e *models.Line) any {
				return e.ID
			}),
	}
}

// DeleteByTrailID deletes all lines for a given trail.
func (r *TrailLines) DeleteByTrailID(ctx context.Context, trailID int64) error {
	_, err := r.Exec(ctx, "DELETE FROM trail_line WHERE trailId = ?", trailID)
	return err
}
