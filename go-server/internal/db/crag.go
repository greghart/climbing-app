package db

import (
	"context"
	"fmt"

	"github.com/greghart/climbing-app/internal/models"
	"github.com/greghart/powerputtygo/mapperp"
	"github.com/greghart/powerputtygo/queryp"
	"github.com/greghart/powerputtygo/sqlp"
)

type Crags struct {
	*sqlp.Repository[models.Crag]
	queryTemplate *queryp.Template
	getMapper     func() mapperp.Mapper[cragRow, models.Crag]
}

func NewCrags(db *sqlp.DB) *Crags {
	return &Crags{
		Repository: sqlp.NewRepository[models.Crag](db, "crag"),
		queryTemplate: queryp.Must(queryp.NewTemplate(`
			SELECT 
				crag.*
				{{- if .Include "area" "boulder"}},
				COALESCE(area.id, 0) AS area_id,
				COALESCE(area.name, "") AS area_name,
				area.description AS area_description
				{{- end}}
				{{- if .Include "boulder"}},
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
			{{if .Include "area" "boulder" -}}
			LEFT JOIN area ON area.cragId = crag.id
			{{- end}}
			{{if .Include "boulder" -}}
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
			return mapperp.InnerSlice(
				func(e *models.Crag) *[]models.Area { return &e.Areas },
				func(e *models.Area) int64 { return e.ID },
				func(row *cragRow) *models.Area { return &row.Area },
				mapperp.Take(
					// boulders
					mapperp.InnerSlice(
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

	var crags []models.Crag
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
	return &crag, nil
}

////////////////////////////////////////////////////////////////////////////////

// ReadRequest shared by GetCrag and GetCrags.
type CragsReadRequest struct {
	ID             int64
	IncludeArea    bool
	IncludeBoulder bool
	IncludeParking bool
}

func NewDefaultCragsReadRequest() *CragsReadRequest {
	return &CragsReadRequest{
		ID:             0,
		IncludeArea:    true,
		IncludeBoulder: true,
		IncludeParking: true,
	}
}

func (r *CragsReadRequest) ForTemplate(t queryp.Templater) queryp.Templater {
	if r.IncludeArea {
		t = t.Include("area")
	}
	if r.IncludeBoulder {
		t = t.Include("boulder")
	}
	if r.IncludeParking {
		t = t.Include("parking")
	}
	if r.ID > 0 {
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
