package db

import (
	"context"
	"log"
	"time"

	"github.com/greghart/climbing-app/internal/models"
	"github.com/greghart/powerputtygo/clientp"
	"github.com/greghart/powerputtygo/mapperp"
	"github.com/greghart/powerputtygo/queryp"
	"github.com/greghart/powerputtygo/servicep"
	"github.com/greghart/powerputtygo/sqlp"
)

var AreasIncludeSchema = servicep.NewIncludeSchema().Allow(
	"polygon.coordinates",
	"boulders.polygon.coordinates",
	"boulders.routes",
)

type AreasReadRequest struct {
	CragIDs []int64
	Include *servicep.IncludeRequest
}

func (r *AreasReadRequest) ForTemplate(t queryp.Templater) queryp.Templater {
	for inc := range r.Include.All() {
		t = t.Include(inc)
	}
	if len(r.CragIDs) > 0 {
		t = t.Param("cragIds", r.CragIDs)
	}
	return t
}

////////////////////////////////////////////////////////////////////////////////

type Areas struct {
	*sqlp.Repository[models.Area]
	queryTemplate queryp.Templater
	getMapper     func() mapperp.Mapper[areaRow, models.Area]
}

func NewAreas(db *DB) *Areas {
	return &Areas{
		Repository: sqlp.NewRepository[models.Area](db.DB, "area"),
		queryTemplate: queryp.Must(queryp.NewTemplate(`
			SELECT 
				area.*
				{{- if .Include "polygon"}},
				COALESCE(polygon.id, 0) AS polygon_id,
				polygon.descriptor AS polygon_descriptor
				{{- end}}
				{{- if .Include "polygon.coordinates"}},
				COALESCE(polygon_coordinate.id, 0) AS polygon_coordinate_id,
				COALESCE(polygon_coordinate.lat,0) AS polygon_coordinate_Lat,
				COALESCE(polygon_coordinate.lng, 0) AS polygon_coordinate_Lng,
				COALESCE(polygon_coordinate."order", 0) AS polygon_coordinate_order
				{{- end}}
				{{- if .Include "boulders"}},
				COALESCE(boulder.id, 0) AS boulder_id,
				COALESCE(boulder.name, "") AS boulder_name,
				boulder.description AS boulder_description,
				COALESCE(boulder.coordinates_Lat, 0) AS boulder_coordinates_Lat,
				COALESCE(boulder.coordinates_Lng, 0) AS boulder_coordinates_Lng
				{{- end}}
				{{- if .Include "boulders.routes"}},
				COALESCE(route.id, 0) AS route_id,
				COALESCE(route.name, "") AS route_name,
				COALESCE(route.gradeRaw, "") AS route_gradeRaw,
				COALESCE(route.coordinates_Lat, 0) AS route_coordinates_Lat,
				COALESCE(route.coordinates_Lng, 0) AS route_coordinates_Lng,
				route.description AS route_description
				{{- end}}
				{{- if .Include "boulders.polygon" }},
				COALESCE(boulder_polygon.id, 0) AS boulder_polygon_id,
				boulder_polygon.descriptor AS boulder_polygon_descriptor
				{{- end}}
				{{- if .Include "boulders.polygon.coordinates"}},
				COALESCE(boulder_polygon_coordinate.id, 0) AS boulder_polygon_coordinate_id,
				COALESCE(boulder_polygon_coordinate.lat, 0) AS boulder_polygon_coordinate_Lat,
				COALESCE(boulder_polygon_coordinate.lng, 0) AS boulder_polygon_coordinate_Lng,
				COALESCE(boulder_polygon_coordinate."order", 0) AS boulder_polygon_coordinate_order
				{{- end}}
			FROM area
				{{- if .Include "polygon"}}
				LEFT JOIN polygon ON polygon.id = area.polygonId
				{{- end -}}
				{{- if .Include "polygon.coordinates"}}
				LEFT JOIN polygon_coordinate ON polygon_coordinate.polygonId = polygon.id
				{{- end -}}
				{{- if .Include "boulders"}}
				LEFT JOIN boulder ON boulder.areaId = area.id
				{{- end -}}
				{{- if .Include "boulders.routes"}}
				LEFT JOIN route ON route.boulderId = boulder.id
				{{- end -}}
				{{- if .Include "boulders.polygon"}}
				LEFT JOIN polygon AS boulder_polygon ON boulder_polygon.id = boulder.polygonId
				{{- end -}}
				{{- if .Include "boulders.polygon.coordinates"}}
				LEFT JOIN polygon_coordinate AS boulder_polygon_coordinate ON boulder_polygon_coordinate.polygonId = boulder_polygon.id
				{{- end -}}
			{{- if .HasParams}}
			WHERE
				1=1
				{{- if .Param "id"}}
				AND area.id = :id
				{{- end -}}
				{{- if .Param "cragIds"}}
				AND area.cragId IN (:cragIds)
				{{- end -}}
			{{- end}}
			ORDER BY area.id, boulder.id ASC
		`)),
		getMapper: func() mapperp.Mapper[areaRow, models.Area] {
			return mapperp.All(
				mapperp.Inner( // polygon
					func(e *models.Area) *models.Polygon { return e.Polygon },
					mapperp.One(
						func(row *areaRow) *models.Polygon { return row.Polygon },
						mapperp.InnerSlice( // polygon coordinates
							func(e *models.Polygon) *[]models.PolygonCoordinate { return &e.Coordinates },
							func(e *models.PolygonCoordinate) int64 { return e.ID },
							func(row *areaRow) *models.PolygonCoordinate { return &row.PolygonCoordinate },
						),
					),
				),
				mapperp.InnerSlice( // boulders
					func(e *models.Area) *[]models.Boulder { return &e.Boulders },
					func(e *models.Boulder) int64 { return e.ID },
					func(row *areaRow) *models.Boulder { return &row.Boulder },
					mapperp.Take( // boulder
						mapperp.InnerSlice( // routes
							func(e *models.Boulder) *[]models.Route { return &e.Routes },
							func(e *models.Route) int64 { return e.ID },
							func(row *areaRow) *models.Route { return &row.Route },
						),
						mapperp.Inner( // boulder polygon
							func(e *models.Boulder) *models.Polygon { return e.Polygon },
							mapperp.One(
								func(row *areaRow) *models.Polygon { return row.Boulder.Polygon },
								mapperp.InnerSlice( // boulder polygon coordinates
									func(e *models.Polygon) *[]models.PolygonCoordinate { return &e.Coordinates },
									func(e *models.PolygonCoordinate) int64 { return e.ID },
									func(row *areaRow) *models.PolygonCoordinate { return &row.BoulderPolygonCoordinate },
								),
							),
						),
					),
				),
			)
		},
	}
}

// BatchAreasByCrag returns a batch client for getting areas in bulk by crag ID.
func (a *Areas) BatchAreasByCrag(req AreasReadRequest) *clientp.Batch[int64, []models.Area] {
	return clientp.NewBatch(
		func(ctx context.Context, ids []int64) (map[int64][]models.Area, error) {
			req := req
			req.CragIDs = ids
			results, err := a.GetAreas(ctx, req)
			if err != nil {
				return nil, err
			}

			out := make(map[int64][]models.Area, len(results))
			for _, res := range results {
				if _, ok := out[res.CragID]; !ok {
					out[res.CragID] = []models.Area{}
				}
				out[res.CragID] = append(out[res.CragID], res)
			}

			return out, nil
		},
		clientp.BatchOptions{Timeout: 25 * time.Millisecond},
	)
}

// GetArea retrieves a single area by its ID using the new query template and mapper
func (a *Areas) GetArea(ctx context.Context, id int64, req AreasReadRequest) (*models.Area, error) {
	q, args, err := req.ForTemplate(a.queryTemplate).Param("id", id).Execute()
	if err != nil {
		return nil, err
	}
	rows, err := sqlp.Query[areaRow](ctx, a.DB, q, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var area models.Area
	mapper := mapperp.One(
		func(row *areaRow) *models.Area { return &row.Area },
		a.getMapper(),
	)
	for i := 0; rows.Next(); i++ {
		row, err := rows.ScanOut()
		if err != nil {
			return nil, err
		}
		mapper(&area, &row)
	}
	if area.ID == 0 {
		return nil, nil
	}
	return &area, nil
}

// GetAreas retrieves all areas for a given cragId using the new query template and mapper
func (a *Areas) GetAreas(ctx context.Context, req AreasReadRequest) ([]models.Area, error) {
	q, args, err := req.ForTemplate(a.queryTemplate).Execute()
	log.Println(q)
	if err != nil {
		return nil, err
	}
	rows, err := sqlp.Query[areaRow](ctx, a.DB, q, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var areas []models.Area
	mapper := mapperp.Slice(
		func(e *models.Area) int64 { return e.ID },
		func(row *areaRow) *models.Area { return &row.Area },
		mapperp.Take(a.getMapper()),
	)
	for i := 0; rows.Next(); i++ {
		row, err := rows.ScanOut()
		if err != nil {
			return nil, err
		}
		mapper(&areas, &row)
	}
	return areas, rows.Err()
}

////////////////////////////////////////////////////////////////////////////////

// areaRow is a row returned by our area query
type areaRow struct {
	models.Area
	PolygonCoordinate        models.PolygonCoordinate `sqlp:"polygon_coordinate"`
	Boulder                  models.Boulder           `sqlp:"boulder"`
	Route                    models.Route             `sqlp:"route"`
	BoulderPolygonCoordinate models.PolygonCoordinate `sqlp:"boulder_polygon_coordinate"`
}
