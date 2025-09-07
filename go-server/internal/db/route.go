package db

import (
	"github.com/greghart/climbing-app/internal/models"
	"github.com/greghart/powerputtygo/sqlp"
)

type Routes struct {
	*sqlp.Repository[models.Route]
}

func NewRoutes(db *sqlp.DB) *Routes {
	return &Routes{Repository: sqlp.NewRepository[models.Route](db, "route")}
}
