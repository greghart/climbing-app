package db

import (
	"context"

	"github.com/greghart/climbing-app/internal/models"
	"github.com/greghart/powerputtygo/sqlp"
)

type Crags struct {
	db *sqlp.DB
}

func NewCrags(db *sqlp.DB) *Crags {
	return &Crags{
		db: db,
	}
}

func (c *Crags) GetCrags(ctx context.Context) ([]models.Crag, error) {
	crags := []models.Crag{}
	query := `SELECT * FROM crag`
	err := c.db.Select(ctx, &crags, query)
	if err != nil {
		return nil, err
	}
	return crags, nil
}
