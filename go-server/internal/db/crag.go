package db

import (
	"context"
	"fmt"
	"log"
	"slices"

	"github.com/greghart/climbing-app/internal/models"
	"github.com/greghart/powerputtygo/mapperp"
	"github.com/greghart/powerputtygo/queryp"
	"github.com/greghart/powerputtygo/servicep"
	"github.com/greghart/powerputtygo/sqlp"
	"github.com/greghart/powerputtygo/utilp"
	"golang.org/x/sync/errgroup"
)

// CragsIncludeSchema defines our db layer support for inclusions.
// Note it's intentionally public, so grpc or http layer can validate it if desired.
var CragsIncludeSchema = servicep.NewIncludeSchema().Allow(
	append(
		[]string{"parking", "trail"},
		slices.Collect(utilp.MapSeq(AreasIncludeSchema.All(), func(s string) string {
			return "areas." + s
		}))...,
	)...,
)

type CragsReadRequest struct {
	ID      int64
	Include *servicep.IncludeRequest
}

func (r *CragsReadRequest) ForTemplate(t queryp.Templater) queryp.Templater {
	for inc := range r.Include.All() {
		t = t.Include(inc)
	}
	if r.ID != 0 {
		t = t.Param("id", r.ID)
	}
	return t
}

////////////////////////////////////////////////////////////////////////////////

type Crags struct {
	*sqlp.Repository[models.Crag]
	trails        *Trails
	areas         *Areas
	queryTemplate *queryp.Template
	getMapper     func() mapperp.Mapper[cragRow, models.Crag]
}

func NewCrags(db *DB, trails *Trails, areas *Areas) *Crags {
	return &Crags{
		Repository: sqlp.NewRepository[models.Crag](db.DB, "crag"),
		trails:     trails,
		areas:      areas,
		queryTemplate: queryp.Must(queryp.NewTemplate(`
			SELECT 
				crag.*
				{{- if .Include "areas"}},
				COALESCE(area.id, 0) AS area_id,
				COALESCE(area.name, "") AS area_name,
				area.description AS area_description
				{{- end}}
				{{- if .Include "areas.boulders"}},
				COALESCE(boulder.id, 0) AS boulder_id,
				COALESCE(boulder.name, 0) AS boulder_name,
				boulder.description AS boulder_description,
				COALESCE(boulder.coordinates_Lat, 0) AS boulder_coordinates_Lat,
				COALESCE(boulder.coordinates_Lng, 0) AS boulder_coordinates_Lng
				{{- end}}
				{{- if .Include "parking"}},
				COALESCE(parking.id, 0) AS parking_id,
				parking.name AS parking_name,
				parking.description AS parking_description,
				COALESCE(parking.location_Lat, 0) AS parking_location_Lat,
				COALESCE(parking.location_Lng, 0) AS parking_location_Lng
				{{- end}}
			FROM crag
				{{- if .Include "areas"}}
				LEFT JOIN area ON area.cragId = crag.id
				{{- end}}
				{{- if .Include "areas.boulders"}}
				LEFT JOIN boulder on boulder.areaId = area.id
				{{- end}}
				{{- if .Include "parking"}}
				LEFT JOIN parking ON parking.cragId = crag.id
				{{- end}}
			{{- if .HasParams}}
			WHERE
				1=1
				{{if .Param "id" -}}
				AND crag.id = :id
				{{- end}}
			{{- end}}
			ORDER BY crag.id ASC
		`)),
		getMapper: func() mapperp.Mapper[cragRow, models.Crag] {
			return mapperp.InnerSlice( // areas
				func(e *models.Crag) *[]models.Area { return &e.Areas },
				func(e *models.Area) int64 { return e.ID },
				func(row *cragRow) *models.Area { return &row.Area },
				mapperp.Take( // area
					mapperp.InnerSlice( // boulders
						func(e *models.Area) *[]models.Boulder { return &e.Boulders },
						func(e *models.Boulder) int64 { return e.ID },
						func(row *cragRow) *models.Boulder { return &row.Boulder },
					),
				),
			)
		},
	}
}

func (c *Crags) GetCrags(ctx context.Context, req CragsReadRequest) ([]models.Crag, error) {
	q, _, err := req.ForTemplate(c.queryTemplate).Execute()
	log.Println(q)
	if err != nil {
		return nil, fmt.Errorf("failed to apply query template: %w", err)
	}

	mapper := mapperp.Slice(
		func(e *models.Crag) int64 { return e.ID },
		func(row *cragRow) *models.Crag { return &row.Crag },
		mapperp.Take(c.getMapper()),
	)

	rows, err := sqlp.Query[cragRow](ctx, c.DB, q)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var crags []models.Crag
	for i := 0; rows.Next(); i++ {
		row, err := rows.ScanOut()
		if err != nil {
			return nil, fmt.Errorf("failed to scan row: %w", err)
		}
		mapper(&crags, &row)
	}

	pp, done := c.postProcessor(ctx, req)
	defer done()

	var errGroup errgroup.Group
	for i := range crags {
		errGroup.Go(func() error {
			return pp(&crags[i])
		})
	}
	if err := errGroup.Wait(); err != nil {
		return nil, fmt.Errorf("failed to post-process crags: %w", err)
	}

	return crags, rows.Err()
}

// GetCrag retries a single crag by its ID, including its' entire association tree.
// Good example of advanced usage, joins and scanning with sqlp.
func (c *Crags) GetCrag(ctx context.Context, req CragsReadRequest) (*models.Crag, error) {
	q, args, err := req.ForTemplate(c.queryTemplate).Execute()
	if err != nil {
		return nil, fmt.Errorf("failed to apply query template: %w", err)
	}

	rows, err := sqlp.Query[cragRow](ctx, c.DB, q, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var crag models.Crag
	mapper := mapperp.One(
		func(row *cragRow) *models.Crag { return &row.Crag },
		c.getMapper(),
	)

	for i := 0; rows.Next(); i++ {
		row, err := rows.ScanOut()
		if err != nil {
			return nil, fmt.Errorf("failed to scan row: %w", err)
		}
		mapper(&crag, &row)
	}
	if crag.ID == 0 {
		return nil, nil
	}

	// This highlights that we don't necessarily want a universal schema for all use cases --
	// eg getCrags doesn't need getting all trails, and we don't even want users to be able to do so.
	if req.Include.IsIncluded("trail") && c.trails != nil {
		trail, err := c.trails.GetTrail(ctx, TrailsReadRequest{
			CragID:  crag.ID,
			Include: TrailsIncludeSchema.Include("lines"),
		})
		if err != nil {
			return nil, fmt.Errorf("failed to get trail for crag %d: %w", crag.ID, err)
		}
		crag.Trail = trail
	}

	pp, done := c.postProcessor(ctx, req)
	defer done()
	if err := pp(&crag); err != nil {
		return nil, fmt.Errorf("failed to post-process crag %d: %w", crag.ID, err)
	}

	return &crag, nil
}

// postProcessor runs whatever post-process steps we keep internally.
// We don't necessarily need to only run one query to fulfill the request, for example -- an area
// and polygon and routes, etc. could be too heavy, and so it'd be simpler to run a 2nd query.
// (Note, this kind of logic would more naturally be placed in a service layer if complexity grows).
func (c *Crags) postProcessor(ctx context.Context, req CragsReadRequest) (process func(crag *models.Crag) error, done func()) {
	if !req.Include.IsIncluded("areas") {
		return func(crag *models.Crag) error {
			return nil
		}, func() {}
	}
	batch := c.areas.BatchAreasByCrag(AreasReadRequest{
		Include: AreasIncludeSchema.Include(slices.Collect(req.Include.Subcludes("areas"))...),
	})
	batch.Start()

	return func(crag *models.Crag) error {
		areas, err := batch.Execute(ctx, crag.ID)
		if err != nil {
			return fmt.Errorf("failed to get areas for crag %d: %w", crag.ID, err)
		}
		if areas != nil {
			crag.Areas = *areas
		}
		return nil
	}, batch.Stop
}

////////////////////////////////////////////////////////////////////////////////

// cragRow is a row returned by our getCrag query.
type cragRow struct {
	models.Crag
	Area    models.Area    `sqlp:"area"`
	Boulder models.Boulder `sqlp:"boulder"`
}
