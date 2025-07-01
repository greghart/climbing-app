package service

import (
	"context"
	"fmt"
	"log/slog"
	"slices"

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
	repos *db.Repos // shortcut to repos
}

func NewCrags(repos *db.Repos) *Crags {
	return &Crags{
		repos: repos,
	}
}

// TODO: Keep working on these APIs and move to powerputty
func addErrGroupFn[T any](eg *errgroup.Group, fn func() (T, error)) <-chan T {
	ch := make(chan T, 1)
	eg.Go(func() error {
		defer close(ch)
		result, err := fn()
		if err != nil {
			slog.Error(fmt.Sprintf("error in errgroup function: %v", err))
			return err
		}
		ch <- result
		return nil
	})
	return ch
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
	cragsCh := addErrGroupFn(&errGroup, func() ([]models.Crag, error) {
		return c.repos.Crags.GetCrags(ctx, db.CragsReadRequest{
			ID:      req.ID,
			Include: db.CragsIncludeSchema.FromRequest(req.Include),
		})
	})
	areasByCragIDCh := addErrGroupFn(&errGroup, func() (map[int64][]models.Area, error) {
		return c.areasByCragID(ctx, req)
	})
	trailsByCragIDCh := addErrGroupFn(&errGroup, func() (map[int64]models.Trail, error) {
		return c.trailsByCragID(ctx, req)
	})

	if err := errGroup.Wait(); err != nil {
		return nil, fmt.Errorf("failed to get crags: %w", err)
	}
	crags := <-cragsCh
	areasByCragID := <-areasByCragIDCh
	trailsByCragID := <-trailsByCragIDCh
	for i := range crags {
		if areas, ok := areasByCragID[crags[i].ID]; ok {
			crags[i].Areas = areas
		}
		if trail, ok := trailsByCragID[crags[i].ID]; ok {
			crags[i].Trail = &trail
		}
	}
	return crags, nil
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

func (c *Crags) trailsByCragID(ctx context.Context, req CragsReadRequest) (map[int64]models.Trail, error) {
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

	byCragID := make(map[int64]models.Trail, len(trails))
	for _, trail := range trails {
		byCragID[trail.CragID] = trail
	}
	return byCragID, nil
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
