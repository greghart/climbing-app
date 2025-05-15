package db

import (
	"github.com/greghart/climbing-app/models"
	"github.com/jmoiron/sqlx"
)

type Crags struct {
	db *sqlx.DB
}

func NewCrags(db *sqlx.DB) *Crags {
	return &Crags{
		db: db,
	}
}

func (c *Crags) GetCrags() ([]models.Crag, error) {
	crags := []models.Crag{}
	query := `SELECT * FROM crags`
	err := c.db.Select(&crags, query)
	if err != nil {
		return nil, err
	}
	return crags, nil
}
