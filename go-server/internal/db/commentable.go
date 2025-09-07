package db

import (
	"github.com/greghart/climbing-app/internal/models"
	"github.com/greghart/powerputtygo/sqlp"
)

type Commentables struct {
	*sqlp.Repository[models.Commentable]
}

func NewCommentables(db *sqlp.DB) *Commentables {
	return &Commentables{
		Repository: sqlp.NewRepository[models.Commentable](db, "commentable"),
	}
}
