package db

import (
	"github.com/greghart/climbing-app/internal/models"
	"github.com/greghart/powerputtygo/sqlp"
)

type Polygons struct {
	*sqlp.Repository[models.Polygon]
}

func NewPolygons(db *sqlp.DB) *Polygons {
	return &Polygons{
		Repository: sqlp.NewRepository[models.Polygon](db, "polygon").WithIdentifier(
			func(e *models.Polygon) any {
				return e.ID
			}),
	}
}
