package db

import (
	"github.com/greghart/climbing-app/internal/models"
	"github.com/greghart/powerputtygo/sqlp"
)

type Boulders struct {
	*sqlp.Repository[models.Boulder]
}

func NewBoulders(db *sqlp.DB) *Boulders {
	return &Boulders{Repository: sqlp.NewRepository[models.Boulder](db, "boulder")}
}
