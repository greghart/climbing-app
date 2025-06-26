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

func (c *Crags) GetCrag(ctx context.Context, req CragsReadRequest) (*models.Crag, error) {
	var errGroup errgroup.Group
	// Get crag data
	cragCh := make(chan *models.Crag, 1)
	errGroup.Go(func() error {
		crag, err := c.repos.Crags.GetCrag(ctx, db.CragsReadRequest{
			ID:      req.ID,
			Include: db.CragsIncludeSchema.FromRequest(req.Include),
		})
		if err != nil {
			return err
		}
		cragCh <- crag
		return nil
	})

	// Get areas data (if requested)
	if req.Include.IsIncluded("areas") {
		errGroup.Go(func() error {
			areas, err := c.repos.Areas.GetAreas(ctx, db.AreasReadRequest{
				CragIDs: []int64{req.ID},
				Include: db.AreasIncludeSchema.IncludeSeq(req.Include.Subcludes("areas")),
			})
			if err != nil {
				return err
			}
			crag := <-cragCh
			crag.Areas = areas
			cragCh <- crag
			return nil
		})
	}

	if err := errGroup.Wait(); err != nil {
		return nil, fmt.Errorf("failed to get crags: %w", err)
	}
	return <-cragCh, nil
}

func (c *Crags) ListCrags(ctx context.Context, req CragsReadRequest) ([]models.Crag, error) {
	var errGroup errgroup.Group
	// Get crags data
	cragsCh := make(chan []models.Crag, 1)
	errGroup.Go(func() error {
		crags, err := c.repos.Crags.GetCrags(ctx, db.CragsReadRequest{
			ID:      req.ID,
			Include: db.CragsIncludeSchema.FromRequest(req.Include),
		})
		if err != nil {
			return err
		}
		cragsCh <- crags
		return nil
	})

	// Get areas data (if requested)
	if req.Include.IsIncluded("areas") {
		batchAreas := c.repos.Areas.BatchAreasByCrag(db.AreasReadRequest{
			Include: db.AreasIncludeSchema.IncludeSeq(req.Include.Subcludes("areas")),
		})
		batchAreas.Start()
		defer batchAreas.Stop()

		// TODO: This batch API is still a bit awkward and roundabout.
		errGroup.Go(func() error {
			crags := <-cragsCh
			var areaErrGroup errgroup.Group
			for i := range crags {
				areaErrGroup.Go(func() error {
					crag := &crags[i]
					areas, err := batchAreas.Execute(ctx, crag.ID)
					if err != nil {
						return fmt.Errorf("failed to get areas for crag %d: %w", crag.ID, err)
					}
					if areas != nil {
						crag.Areas = *areas
					}
					return nil
				})
			}
			if err := areaErrGroup.Wait(); err != nil {
				return err
			}
			cragsCh <- crags
			return nil
		})
	}

	if err := errGroup.Wait(); err != nil {
		return nil, fmt.Errorf("failed to get crags: %w", err)
	}
	return <-cragsCh, nil
}
