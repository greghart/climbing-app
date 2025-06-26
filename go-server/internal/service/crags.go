package service

import (
	"context"
	"fmt"
	"slices"

	"github.com/greghart/climbing-app/internal/db"
	"github.com/greghart/climbing-app/internal/models"
	"github.com/greghart/powerputtygo/servicep"
	"github.com/greghart/powerputtygo/utilp"
	"golang.org/x/sync/errgroup"
)

var CragsIncludeSchema = servicep.NewIncludeSchema().Allow(
	append(
		slices.Collect(db.CragsIncludeSchema.All()),
		slices.Collect(utilp.MapSeq(db.AreasIncludeSchema.All(), func(s string) string {
			return "areas." + s
		}))...,
	)...,
)

type CragsReadRequest struct {
	ID      int64
	Include *servicep.IncludeRequest
}

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
		result, err := fn()
		if err != nil {
			return err
		}
		ch <- result
		return nil
	})
	return ch
}

// pipe will pipe one goroutine's output into various other dependencies.
// 'deps' should be ran for side effects, since we can't use generics to model variadic outputs.
// TODO: Keep working on these APIs and move to powerputty
func pipe[T any](ctx context.Context, getIn func() (T, error), deps ...func(T) error) (T, error) {
	eg, ctx := errgroup.WithContext(ctx)
	// Initial getting of our primary data
	primaryCh := addErrGroupFn(eg, getIn)
	// Final result and error after all dependencies are done
	resultCh := make(chan T, 1)
	errCh := make(chan error, 1)

	go func() {
		for {
			select {
			case t := <-primaryCh:
				for _, out := range deps {
					eg.Go(func() error {
						return out(t)
					})
				}
				resultCh <- t
				return
			case <-ctx.Done():
				errCh <- ctx.Err()
				return
			}
		}
	}()

	if err := eg.Wait(); err != nil {
		var t T
		return t, fmt.Errorf("failed to get dependencies: %w", err)
	}
	return <-resultCh, <-errCh
}

func (c *Crags) GetCrag(ctx context.Context, req CragsReadRequest) (*models.Crag, error) {
	var errGroup errgroup.Group
	cragCh := addErrGroupFn(&errGroup, func() (*models.Crag, error) {
		return c.repos.Crags.GetCrag(ctx, db.CragsReadRequest{
			ID:      req.ID,
			Include: db.CragsIncludeSchema.FromRequest(req.Include),
		})
	})
	areasCh := addErrGroupFn(&errGroup, func() ([]models.Area, error) {
		if !req.Include.IsIncluded("areas") {
			return nil, nil
		}
		return c.repos.Areas.GetAreas(ctx, db.AreasReadRequest{
			CragIDs: []int64{req.ID},
			Include: db.AreasIncludeSchema.IncludeSeq(req.Include.Subcludes("areas")),
		})
	})

	if err := errGroup.Wait(); err != nil {
		return nil, fmt.Errorf("failed to get crags: %w", err)
	}
	crag := <-cragCh
	areas := <-areasCh
	if crag != nil {
		crag.Areas = areas
	}
	return crag, nil
}

func (c *Crags) ListCrags(ctx context.Context, req CragsReadRequest) ([]models.Crag, error) {
	var errGroup errgroup.Group
	cragsCh := addErrGroupFn(&errGroup, func() ([]models.Crag, error) {
		return c.repos.Crags.GetCrags(ctx, db.CragsReadRequest{
			ID:      req.ID,
			Include: db.CragsIncludeSchema.FromRequest(req.Include),
		})
	})
	areasByCragIDCh := addErrGroupFn(&errGroup, func() (map[int64][]models.Area, error) {
		if !req.Include.IsIncluded("areas") {
			return nil, nil
		}
		areas, err := c.repos.Areas.GetAreas(ctx, db.AreasReadRequest{
			Include: db.AreasIncludeSchema.IncludeSeq(req.Include.Subcludes("areas")),
		})
		if err != nil {
			return nil, err
		}
		byCragID := make(map[int64][]models.Area, len(areas))
		for _, area := range areas {
			if _, ok := byCragID[area.CragID]; !ok {
				byCragID[area.CragID] = []models.Area{}
			}
			byCragID[area.CragID] = append(byCragID[area.CragID], area)
		}
		return byCragID, nil
	})

	if err := errGroup.Wait(); err != nil {
		return nil, fmt.Errorf("failed to get crags: %w", err)
	}
	crags := <-cragsCh
	areasByCragID := <-areasByCragIDCh
	for i := range crags {
		if areas, ok := areasByCragID[crags[i].ID]; ok {
			crags[i].Areas = areas
		}
	}
	return crags, nil
}
