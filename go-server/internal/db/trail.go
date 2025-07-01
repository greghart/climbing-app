package db

import (
	"context"
	"fmt"

	"github.com/greghart/climbing-app/internal/models"
	"github.com/greghart/powerputtygo/mapperp"
	"github.com/greghart/powerputtygo/queryp"
	"github.com/greghart/powerputtygo/servicep"
	"github.com/greghart/powerputtygo/sqlp"
)

var TrailsIncludeSchema = servicep.NewIncludeSchema().Allow("lines")

type TrailsReadRequest struct {
	CragIDs []int64
	Include *servicep.IncludeRequest
}

func (r *TrailsReadRequest) ForTemplate(t queryp.Templater) queryp.Templater {
	for inc := range r.Include.All() {
		t = t.Include(inc)
	}
	if len(r.CragIDs) > 0 {
		t = t.Param("cragId", r.CragIDs)
	}
	return t
}

////////////////////////////////////////////////////////////////////////////////

type Trails struct {
	*sqlp.Repository[models.Trail]
	queryTemplate *queryp.Template
	getMapper     func() mapperp.Mapper[trailRow, models.Trail]
}

func NewTrails(db *sqlp.DB) *Trails {
	return &Trails{
		Repository: sqlp.NewRepository[models.Trail](db, "trail"),
		queryTemplate: queryp.Must(queryp.NewTemplate(`
			SELECT 
				trail.*,
				crag.id AS cragId
				{{- if .Include "lines"}},
				trail_line.id AS line_id,
				trail_line.startLat AS line_start_Lat,
				trail_line.startLng AS line_start_Lng,
				trail_line.endLat AS line_end_Lat,
				trail_line.endLng AS line_end_Lng
				{{- end}}
			FROM trail
				JOIN crag ON crag.trailId = trail.id
				{{- if .Include "lines"}}
				LEFT JOIN trail_line ON trail_line.trailId = trail.id
				{{- end}}
			{{- if .HasParams}}
			WHERE 
				1=1
				{{- if .Param "cragId"}}
				AND crag.id IN (:cragId)
				{{- end -}}
			{{- end}}
			ORDER BY
				trail.id{{- if .Include "lines"}}, trail_line."order"{{end}} 
				ASC
		`)),
		getMapper: func() mapperp.Mapper[trailRow, models.Trail] {
			return mapperp.All(
				mapperp.InnerSlice(
					func(e *models.Trail) *[]models.Line { return &e.Lines },
					func(e *models.Line) int64 { return e.ID },
					func(row *trailRow) *models.Line { return &row.Line },
				),
			)
		},
	}
}

func (t *Trails) GetTrails(ctx context.Context, req TrailsReadRequest) ([]models.Trail, error) {
	q, args, err := req.ForTemplate(t.queryTemplate).Execute()
	if err != nil {
		return nil, fmt.Errorf("failed to apply query template: %w", err)
	}

	rows, err := sqlp.Query[trailRow](ctx, t.DB, q, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var trails []models.Trail
	mapper := mapperp.Slice(
		func(e *models.Trail) int64 { return e.ID },
		func(row *trailRow) *models.Trail { return &row.Trail },
		mapperp.Take(t.getMapper()),
	)

	for i := 0; rows.Next(); i++ {
		row, err := rows.ScanOut()
		if err != nil {
			return nil, fmt.Errorf("failed to scan row: %w", err)
		}
		mapper(&trails, &row)
	}
	return trails, nil
}

////////////////////////////////////////////////////////////////////////////////

type trailRow struct {
	models.Trail
	Line models.Line `sqlp:"line"`
}
