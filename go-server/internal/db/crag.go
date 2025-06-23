package db

import (
	"context"
	"fmt"
	"strings"

	"github.com/greghart/climbing-app/internal/models"
	"github.com/greghart/powerputtygo/mapperp"
	"github.com/greghart/powerputtygo/queryp"
	"github.com/greghart/powerputtygo/servicep"
	"github.com/greghart/powerputtygo/sqlp"
)

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
				{{if .Include "areas" -}}
				LEFT JOIN area ON area.cragId = crag.id
				{{- end}}
				{{if .Include "areas.boulders" -}}
				LEFT JOIN boulder on boulder.areaId = area.id
				{{- end}}
				{{if .Include "parking" -}}
				LEFT JOIN parking ON parking.cragId = crag.id
				{{- end}}
			{{if .Param "id" -}}
			WHERE crag.id = :id
			{{- end}}
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
		mapper(&crags, &row, i)
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
		mapper(&crag, &row, i)
	}
	if crag.ID == 0 {
		return nil, nil
	}

	// Post-process step: we don't necessarily need to only run one query to fulfill the request
	// For our cases, a trail ends up potentially creating too large a join, and it's better to
	// load that separately. (Note, this kind of logic would more naturally be placed in a service
	// layer if complexity grows too large).
	// This also highlights that we don't necessarily want a universal schema for all use cases --
	// eg for the crags listing, getting all trails is not needed and potentially too expensive.
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
	if req.Include.IsIncluded("areas.polygon") && c.areas != nil {
		subcludes := []string{}
		for inc := range req.Include.All() {
			cut, ok := strings.CutPrefix(inc, "areas.")
			if ok {
				subcludes = append(subcludes, cut)
			}
		}
		areas, err := c.areas.GetAreas(ctx, AreasReadRequest{
			CragID:  crag.ID,
			Include: AreasIncludeSchema.Include(subcludes...),
		})
		if err != nil {
			return nil, fmt.Errorf("failed to get areas for crag %d: %w", crag.ID, err)
		}
		crag.Areas = areas
	}

	return &crag, nil
}

////////////////////////////////////////////////////////////////////////////////

// CragsIncludeSchema defines our db layer support for inclusions.
// Note it's intentionally public, so grpc or http layer can validate it if desired.
var CragsIncludeSchema = servicep.NewIncludeSchema().Allow(
	"areas.polygon.coordinates",
	"areas.boulders.polygon.coordinates",
	"areas.boulders.routes",
	"parking",
	"trail",
)

// ReadRequest shared by GetCrag and GetCrags.
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

// cragRow is a row returned by our getCrag query.
type cragRow struct {
	models.Crag
	Area    models.Area    `sqlp:"area"`
	Boulder models.Boulder `sqlp:"boulder"`
}
