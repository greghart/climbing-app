package db

import (
	"context"
	"fmt"
	"log"

	"github.com/greghart/climbing-app/internal/models"
	"github.com/greghart/powerputtygo/queryp"
	"github.com/greghart/powerputtygo/servicep"
	"github.com/greghart/powerputtygo/sqlp"
)

// CragsIncludeSchema defines our db layer support for inclusions.
// Note it's intentionally public, so grpc or http layer can validate it if desired.
var CragsIncludeSchema = servicep.NewIncludeSchema().Allow("parking")

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
	queryTemplate *queryp.Template
}

func NewCrags(db *sqlp.DB) *Crags {
	return &Crags{
		Repository: sqlp.NewRepository[models.Crag](db, "crag"),
		queryTemplate: queryp.Must(queryp.NewTemplate(`
			SELECT 
				crag.*
				{{- if .Include "parking"}},
				COALESCE(parking.id, 0) AS parking_id,
				parking.name AS parking_name,
				parking.description AS parking_description,
				COALESCE(parking.location_Lat, 0) AS parking_location_Lat,
				COALESCE(parking.location_Lng, 0) AS parking_location_Lng
				{{- end}}
			FROM crag
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
	}
}

func (c *Crags) GetCrags(ctx context.Context, req CragsReadRequest) ([]models.Crag, error) {
	q, args, err := req.ForTemplate(c.queryTemplate).Execute()
	log.Println(q)
	if err != nil {
		return nil, fmt.Errorf("failed to apply query template: %w", err)
	}

	return c.Select(ctx, q, args...)
}

// GetCrag retries a single crag by its ID, including its' entire association tree.
// Good example of advanced usage, joins and scanning with sqlp.
func (c *Crags) GetCrag(ctx context.Context, req CragsReadRequest) (*models.Crag, error) {
	q, args, err := req.ForTemplate(c.queryTemplate).Execute()
	if err != nil {
		return nil, fmt.Errorf("failed to apply query template: %w", err)
	}

	return c.Get(ctx, q, args...)
}
