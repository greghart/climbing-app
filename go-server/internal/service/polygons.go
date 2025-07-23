package service

import (
	"context"
	"fmt"
	"log/slog"

	"github.com/greghart/climbing-app/internal/models"
)

type Polygons struct {
	*Services
}

func NewPolygons(services *Services) *Polygons {
	return &Polygons{
		Services: services,
	}
}

// Insert creates a new polygon and its coordinates.
func (p *Polygons) Insert(ctx context.Context, coords []models.PolygonCoordinate) (*models.Polygon, error) {
	defer insertPolygonObserver()()
	res, err := p.repos.Polygons.Insert(ctx, models.Polygon{})
	if err != nil {
		return nil, fmt.Errorf("failed to insert polygon: %w", err)
	}
	id, err := res.LastInsertId()
	if err != nil {
		return nil, fmt.Errorf("failed to get last insert ID for polygon: %w", err)
	}
	for i := range coords {
		coords[i].PolygonID = id
		coords[i].Order = i
	}
	if _, err := p.repos.PolygonCoordinates.InsertBulk(ctx, coords); err != nil {
		return nil, fmt.Errorf("failed to insert polygon coordinates: %w", err)
	}
	return &models.Polygon{
		ID:          id,
		Coordinates: coords,
	}, nil
}

// Update replaces all coordinates for a polygon.
func (p *Polygons) Update(ctx context.Context, polygonID int64, coords []models.PolygonCoordinate) error {
	defer updatePolygonObserver()()
	if err := p.repos.PolygonCoordinates.DeleteByPolygonID(ctx, polygonID); err != nil {
		return fmt.Errorf("failed to delete old coordinates: %w", err)
	}
	for i := range coords {
		coords[i].PolygonID = polygonID
		coords[i].Order = i
	}
	if _, err := p.repos.PolygonCoordinates.InsertBulk(ctx, coords); err != nil {
		return fmt.Errorf("failed to insert new coordinates: %w", err)
	}
	slog.Debug(fmt.Sprintf("updated %d coordinates for polygon %d", len(coords), polygonID))
	return nil
}
