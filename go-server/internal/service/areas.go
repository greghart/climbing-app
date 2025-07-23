package service

import (
	"context"
	"fmt"
	"time"

	"github.com/greghart/climbing-app/internal/db"
	"github.com/greghart/climbing-app/internal/models"
	"github.com/greghart/powerputtygo/servicep"
	"golang.org/x/sync/errgroup"
)

// Areas service mirrors Crags style, but delegates all includes to the repo.
type Areas struct {
	*Services
}

func NewAreas(services *Services) *Areas {
	return &Areas{
		Services: services,
	}
}

// GetArea retrieves an area by ID, delegating all includes to the repo.
func (a *Areas) GetArea(ctx context.Context, id int64, req db.AreasReadRequest) (*models.Area, error) {
	defer getAreaObserver()()
	return a.repos.Areas.GetArea(ctx, id, req)
}

// AreaUpdateRequest mirrors CragUpdateRequest but for area fields.
type AreaUpdateRequest struct {
	*servicep.FieldMask
	ID          int64
	Name        string
	Description *string
	Polygon     *models.Polygon
	RequestedAt time.Time
}

// Update updates an area, handling name, description, and polygon.
func (a *Areas) Update(ctx context.Context, req AreaUpdateRequest) error {
	defer updateAreaObserver()()
	if req.RequestedAt.IsZero() {
		return fmt.Errorf("requested_at must be set")
	}
	return a.repos.Areas.RunInTx(ctx, func(ctx context.Context) error {
		area, err := a.repos.Areas.GetArea(ctx, req.ID, db.AreasReadRequest{})
		// validate
		if err != nil {
			return fmt.Errorf("failed to find area for update with ID %d: %w", req.ID, err)
		}
		if area == nil {
			return fmt.Errorf("cannot update: %d not found", req.ID)
		}
		if area.UpdatedAt.After(req.RequestedAt) {
			return fmt.Errorf("update is out of date: area was last updated at '%s', requested at '%s'", area.UpdatedAt, req.RequestedAt)
		}

		// Update polygon
		// if area.PolygonID won't change, we can run concurrently
		var g errgroup.Group
		if req.Has("polygon") {
			if req.Polygon == nil { // Remove
				area.PolygonID = nil
				// TODO: Delete the existing polygon?
			} else if area.PolygonID != nil { // Update existing
				g.Go(func() error {
					return a.Polygons.Update(ctx, area.Polygon.ID, req.Polygon.Coordinates)
				})
			} else { // Insert new
				poly, err := a.Polygons.Insert(ctx, req.Polygon.Coordinates)
				if err != nil {
					return fmt.Errorf("failed to insert new polygon: %w", err)
				}
				area.PolygonID = &poly.ID
			}
		}

		// Update area
		g.Go(func() error {
			area.UpdatedAt = time.Now()
			if req.Has("name") {
				area.Name = req.Name
			}
			if req.Has("description") {
				area.Description = req.Description
			}
			_, err := a.repos.Areas.Update(ctx, area)
			return err
		})

		return g.Wait()
	})
}
