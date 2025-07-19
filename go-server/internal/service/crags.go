package service

import (
	"context"
	"fmt"
	"slices"
	"time"

	"github.com/greghart/climbing-app/internal/db"
	"github.com/greghart/climbing-app/internal/models"
	"github.com/greghart/powerputtygo/servicep"
	"github.com/greghart/powerputtygo/utilp"
	"golang.org/x/sync/errgroup"
)

var CragsIncludeSchema = servicep.NewIncludeSchema().Allow(
	slices.Concat(
		slices.Collect(db.CragsIncludeSchema.All()),
		slices.Collect(utilp.MapSeq(db.TrailsIncludeSchema.All(), func(s string) string {
			return "trail." + s
		})),
		slices.Collect(utilp.MapSeq(db.AreasIncludeSchema.All(), func(s string) string {
			return "areas." + s
		})),
	)...,
)

////////////////////////////////////////////////////////////////////////////////

type Crags struct {
	*Services
}

func NewCrags(services *Services) *Crags {
	return &Crags{
		Services: services,
	}
}

func (c *Crags) GetCrag(ctx context.Context, req CragsReadRequest) (*models.Crag, error) {
	defer getCragObserver()()

	// Can be clever if we want and frame single get as a list with a single ID filter.
	crags, err := c.ListCrags(ctx, req)
	if err != nil || len(crags) == 0 {
		return nil, err
	}
	return &crags[0], nil
}

func (c *Crags) ListCrags(ctx context.Context, req CragsReadRequest) ([]models.Crag, error) {
	defer listCragsObserver()()

	var errGroup errgroup.Group
	cragsCh := servicep.ErrGroupValuer(&errGroup, func() ([]models.Crag, error) {
		return c.repos.Crags.GetCrags(ctx, db.CragsReadRequest{
			ID:      req.ID,
			Include: db.CragsIncludeSchema.FromRequest(req.Include),
		})
	})
	areasByCragIDCh := servicep.ErrGroupValuer(&errGroup, func() (map[int64][]models.Area, error) {
		return c.areasByCragID(ctx, req)
	})
	trailsByIDCh := servicep.ErrGroupValuer(&errGroup, func() (map[int64]models.Trail, error) {
		return c.trailsByID(ctx, req)
	})

	if err := errGroup.Wait(); err != nil {
		return nil, fmt.Errorf("failed to get crags: %w", err)
	}
	crags := <-cragsCh
	areasByCragID := <-areasByCragIDCh
	trailsByID := <-trailsByIDCh
	for i := range crags {
		if areas, ok := areasByCragID[crags[i].ID]; ok {
			crags[i].Areas = areas
		}
		if trail, ok := trailsByID[servicep.PtrToZero(crags[i].TrailID)]; ok {
			crags[i].Trail = &trail
		}
	}
	return crags, nil
}

func (c *Crags) Update(ctx context.Context, req CragUpdateRequest) error {
	defer updateCragObserver()()

	if req.RequestedAt.IsZero() {
		return fmt.Errorf("requested_at must be set")
	}

	return c.repos.Crags.RunInTx(ctx, func(ctx context.Context) error {
		crag, err := c.repos.Crags.Find(ctx, req.ID)
		if err != nil {
			return fmt.Errorf("failed to find crag for update with ID %d: %w", req.ID, err)
		}
		if crag == nil {
			return fmt.Errorf("cannot update: %d not found", req.ID)
		}
		if crag.UpdatedAt.After(req.RequestedAt) {
			return fmt.Errorf("update is out of date: crag was last updated at '%s', requested at '%s'", crag.UpdatedAt, req.RequestedAt)
		}
		// Update crag
		if req.Has("name") {
			crag.Name = req.Name
		}
		if req.Has("description") {
			crag.Description = req.Description
		}
		if req.Has("bounds") {
			if req.Bounds == nil {
				return fmt.Errorf("bounds cannot be nil'ed out")
			}
			crag.Bounds = *req.Bounds
		}
		var g errgroup.Group
		if req.Has("trail") {
			if req.Trail == nil { // Remove trail
				crag.TrailID = servicep.ZeroToPtr(int64(0))
			} else if crag.TrailID != nil { // Update existing trail
				g.Go(func() error {
					err := c.Trails.Update(ctx, *crag.TrailID, req.Trail.Lines)
					if err != nil {
						return fmt.Errorf("failed to update trail: %w", err)
					}
					return nil
				})
			} else { // Create new trail
				trail, err := c.Trails.Insert(ctx, req.Trail.Lines)
				if err != nil {
					return fmt.Errorf("failed to insert new trail: %w", err)
				}
				crag.TrailID = servicep.ZeroToPtr(trail.ID)
			}
		}
		g.Go(func() error {
			_, err := c.repos.Crags.Update(ctx, crag)
			return err
		})
		return g.Wait()
	})
}

////////////////////////////////////////////////////////////////////////////////

type CragUpdateRequest struct {
	*servicep.FieldMask
	ID          int64
	Name        string
	Description *string
	Trail       *models.Trail
	Bounds      *models.Bounds
	RequestedAt time.Time
}

////////////////////////////////////////////////////////////////////////////////

type CragsReadRequest struct {
	ID      int64
	Include *servicep.IncludeRequest
}

// IDs returns requested ID as a slice
func (r CragsReadRequest) IDs() []int64 {
	if r.ID != 0 {
		return []int64{r.ID}
	}
	return nil
}

func (r CragsReadRequest) ToDBAreas() db.AreasReadRequest {
	ids := []int64{}
	if r.ID != 0 {
		ids = append(ids, r.ID)
	}
	return db.AreasReadRequest{
		CragIDs: ids,
		Include: db.CragsIncludeSchema.FromRequest(r.Include),
	}
}

////////////////////////////////////////////////////////////////////////////////

func (c *Crags) trailsByID(ctx context.Context, req CragsReadRequest) (map[int64]models.Trail, error) {
	if !req.Include.IsIncluded("trail") {
		return nil, nil
	}
	trails, err := c.repos.Trails.GetTrails(ctx, db.TrailsReadRequest{
		CragIDs: req.IDs(),
		Include: db.TrailsIncludeSchema.IncludeSeq(req.Include.Subcludes("trail")),
	})
	if err != nil {
		return nil, fmt.Errorf("failed to get trails: %w", err)
	}

	byID := make(map[int64]models.Trail, len(trails))
	for _, trail := range trails {
		byID[trail.ID] = trail
	}
	return byID, nil
}

func (c *Crags) areasByCragID(ctx context.Context, req CragsReadRequest) (map[int64][]models.Area, error) {
	if !req.Include.IsIncluded("areas") {
		return nil, nil
	}
	areas, err := c.repos.Areas.GetAreas(ctx, db.AreasReadRequest{
		CragIDs: req.IDs(),
		Include: db.AreasIncludeSchema.IncludeSeq(req.Include.Subcludes("areas")),
	})
	if err != nil {
		return nil, fmt.Errorf("failed to get areas: %w", err)
	}

	byCragID := make(map[int64][]models.Area, len(areas))
	for _, area := range areas {
		byCragID[area.CragID] = append(byCragID[area.CragID], area)
	}
	return byCragID, nil
}
