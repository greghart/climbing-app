package db

import (
	"context"

	"github.com/greghart/climbing-app/internal/models"
	"github.com/greghart/powerputtygo/sqlp"
)

type PolygonCoordinates struct {
	*sqlp.Repository[models.PolygonCoordinate]
}

func NewPolygonCoordinates(db *sqlp.DB) *PolygonCoordinates {
	return &PolygonCoordinates{
		Repository: sqlp.NewRepository[models.PolygonCoordinate](db, "polygon_coordinate"),
	}
}

// DeleteByPolygonID deletes all coordinates for a given polygon.
func (p *PolygonCoordinates) DeleteByPolygonID(ctx context.Context, polygonID int64) error {
	_, err := p.Repository.Exec(ctx, "DELETE FROM polygon_coordinate WHERE polygonId = ?", polygonID)
	return err
}
