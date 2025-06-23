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

type Trails struct {
	*sqlp.Repository[models.Trail]
	queryTemplate *queryp.Template
}

func NewTrails(db *DB) *Trails {
	return &Trails{
		Repository: sqlp.NewRepository[models.Trail](db.DB, "trail"),
		queryTemplate: queryp.Must(queryp.NewTemplate(`
			SELECT 
				trail.*
				{{- if .Include "lines"}},
				trail_line.id AS line_id,
				trail_line.startLat AS line_start_Lat,
				trail_line.startLng AS line_start_Lng,
				trail_line.endLat AS line_end_Lat,
				trail_line.endLng AS line_end_Lng
				{{- end}}
			FROM trail
				{{- if .Include "lines"}}
				LEFT JOIN trail_line ON trail_line.trailId = trail.id
				{{- end}}
			WHERE trail.id = (SELECT trailId FROM crag WHERE crag.id = :cragId)
		`)),
	}
}
func (t *Trails) GetTrail(ctx context.Context, req TrailsReadRequest) (*models.Trail, error) {
	q, args, err := req.ForTemplate(t.queryTemplate).Execute()
	if err != nil {
		return nil, fmt.Errorf("failed to apply query template: %w", err)
	}

	rows, err := sqlp.Query[trailRow](ctx, t.DB, q, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var trail models.Trail
	mapper := mapperp.One(
		func(row *trailRow) *models.Trail { return &row.Trail },
		mapperp.InnerSlice(
			func(e *models.Trail) *[]models.Line { return &e.Lines },
			func(e *models.Line) int64 { return e.ID },
			func(row *trailRow) *models.Line { return &row.Line },
		),
	)

	for i := 0; rows.Next(); i++ {
		row, err := rows.ScanOut()
		if err != nil {
			return nil, fmt.Errorf("failed to scan row: %w", err)
		}
		mapper(&trail, &row, i)
	}
	if trail.ID == 0 {
		return nil, nil
	}
	return &trail, nil
}

////////////////////////////////////////////////////////////////////////////////

var TrailsIncludeSchema = servicep.NewIncludeSchema().Allow("lines")

type TrailsReadRequest struct {
	CragID  int64
	Include *servicep.IncludeRequest
}

func (r *TrailsReadRequest) ForTemplate(t queryp.Templater) queryp.Templater {
	for inc := range r.Include.All() {
		t = t.Include(inc)
	}
	if r.CragID != 0 {
		t = t.Param("cragId", r.CragID)
	}
	return t
}

////////////////////////////////////////////////////////////////////////////////

type trailRow struct {
	models.Trail
	Line models.Line `sqlp:"line"`
}
