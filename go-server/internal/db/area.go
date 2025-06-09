package db

import (
	"context"

	"github.com/greghart/climbing-app/internal/models"
	"github.com/greghart/powerputtygo/sqlp"
)

// Areas repository for area table
// Provides methods to get a single area or all areas for a crag

type Areas struct {
	*sqlp.Repository[models.Area]
}

func NewAreas(db *sqlp.DB) *Areas {
	return &Areas{
		sqlp.NewRepository[models.Area](db, "area"),
	}
}

// GetArea retrieves a single area by its ID
func (a *Areas) GetArea(ctx context.Context, id int64) (*models.Area, error) {
	return a.Find(ctx, int(id))
}

// GetAreas retrieves all areas for a given cragId
func (a *Areas) GetAreas(ctx context.Context, cragId int) ([]models.Area, error) {
	return a.Select(ctx, "SELECT * FROM area WHERE cragId = ?", cragId)
}
