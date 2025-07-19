package service

import (
	"context"
	"fmt"
	"log/slog"

	"github.com/greghart/climbing-app/internal/models"
)

type Trails struct {
	*Services
}

func NewTrails(services *Services) *Trails {
	return &Trails{
		Services: services,
	}
}

func (t *Trails) Insert(ctx context.Context, lines []models.Line) (*models.Trail, error) {
	defer insertTrailObserver()()

	res, err := t.repos.Trails.Insert(ctx, models.Trail{})
	if err != nil {
		return nil, fmt.Errorf("failed to insert trail: %w", err)
	}
	id, err := res.LastInsertId()
	if err != nil {
		return nil, fmt.Errorf("failed to get last insert ID for trail: %w", err)
	}

	if err := t.Update(ctx, id, lines); err != nil {
		return nil, fmt.Errorf("failed to update trail with lines: %w", err)
	}
	return &models.Trail{
		ID:    id,
		Lines: lines,
	}, nil
}

func (t *Trails) Update(ctx context.Context, id int64, lines []models.Line) error {
	defer updateTrailObserver()()

	// Truncate existing lines
	if err := t.repos.TrailLines.DeleteByTrailID(ctx, id); err != nil {
		return err
	}

	// Prepare new lines with correct TrailID and Order
	for i := range lines {
		lines[i].TrailID = id
		lines[i].Order = i
	}

	// Insert all at once
	res, err := t.repos.TrailLines.InsertBulk(ctx, lines)
	if err != nil {
		return err
	}
	rows, err := res.RowsAffected()
	if err != nil {
		slog.Debug(fmt.Sprintf("inserted %d lines for trail %d", rows, id))
	}
	return nil
}
