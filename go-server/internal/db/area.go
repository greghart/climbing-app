package db

import (
	"context"

	"github.com/greghart/climbing-app/internal/models"
	"github.com/greghart/powerputtygo/mapperp"
	"github.com/greghart/powerputtygo/queryp"
	"github.com/greghart/powerputtygo/servicep"
	"github.com/greghart/powerputtygo/sqlp"
)

// Areas repository for area table
// Provides methods to get a single area or all areas for a crag

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
				polygon_coordinate.lat AS polygon_coordinate_Lat,
				polygon_coordinate.lng AS polygon_coordinate_Lng,
				polygon_coordinate."order" AS polygon_coordinate_order
				{{- end}}
				{{- if .Include "boulders"}},
				COALESCE(boulder.id, 0) AS boulder_id,
				boulder.name AS boulder_name,
				boulder.description AS boulder_description,
				boulder.coordinates_Lat AS boulder_coordinates_Lat,
				boulder.coordinates_Lng AS boulder_coordinates_Lng
				{{- end}}
				{{- if .Include "boulders.route"}},
				COALESCE(route.id, 0) AS route_id,
				route.name AS route_name,
				route.length AS route_length,
				route.description AS route_description
				{{- end}}
				{{- if .Include "boulders.polygon" }},
				COALESCE(boulder_polygon.id, 0) AS boulder_polygon_id,
				boulder_polygon.descriptor AS boulder_polygon_descriptor
				{{- end}}
				{{- if .Include "boulders.polygon.coordinates"}},
				COALESCE(boulder_polygon_coordinate.id, 0) AS boulder_polygon_coordinate_id,
				boulder_polygon_coordinate.lat AS boulder_polygon_coordinate_Lat,
				boulder_polygon_coordinate.lng AS boulder_polygon_coordinate_Lng,
				boulder_polygon_coordinate."order" AS boulder_polygon_coordinate_order
				{{- end}}
			FROM area
				{{if .Include "polygon" -}}
				LEFT JOIN polygon ON polygon.id = area.polygonId
				{{- end}}
				{{if .Include "polygon.coordinates" -}}
				LEFT JOIN polygon_coordinate ON polygon_coordinate.polygonId = polygon.id
				{{- end}}
				{{if .Include "boulders" -}}
				LEFT JOIN boulder ON boulder.areaId = area.id
				{{- end}}
				{{if .Include "boulders.route" -}}
				LEFT JOIN route ON route.boulderId = boulder.id
				{{- end}}
				{{if .Include "boulders.polygon" -}}
				LEFT JOIN polygon AS boulder_polygon ON boulder_polygon.id = boulder.polygonId
				{{- end}}
				{{if .Include "boulders.polygon.coordinates" -}}
				LEFT JOIN polygon_coordinate AS boulder_polygon_coordinate ON boulder_polygon_coordinate.polygonId = boulder_polygon.id
				{{- end}}
			{{if .Param "cragId" -}}
			WHERE area.cragId = :cragId
			{{- end}}
		`)),
		getMapper: func() mapperp.Mapper[areaRow, models.Area] {
			return mapperp.All(
				mapperp.Inner( // polygon
					func(e *models.Area) *models.Polygon { return e.Polygon },
					mapperp.One(
						func(row *areaRow) *models.Polygon { return row.Polygon },
						mapperp.InnerSlice( // polygon coordinates)
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
								func(row *areaRow) *models.Polygon { return &row.BoulderPolygon },
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
		mapper(&area, &row, i)
	}
	if area.ID == 0 {
		return nil, nil
	}
	return &area, nil
}

// GetAreas retrieves all areas for a given cragId using the new query template and mapper
func (a *Areas) GetAreas(ctx context.Context, req AreasReadRequest) ([]models.Area, error) {
	q, args, err := req.ForTemplate(a.queryTemplate).Execute()
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
		mapper(&areas, &row, i)
	}
	return areas, rows.Err()
}

////////////////////////////////////////////////////////////////////////////////

var AreasIncludeSchema = servicep.NewIncludeSchema().Allow(
	"polygon.coordinates",
	"boulders.polygon.coordinates",
	"boulders.routes",
)

type AreasReadRequest struct {
	CragID  int64
	Include *servicep.IncludeRequest
}

func (r *AreasReadRequest) ForTemplate(t queryp.Templater) queryp.Templater {
	for inc := range r.Include.All() {
		t = t.Include(inc)
	}
	if r.CragID != 0 {
		t = t.Param("cragId", r.CragID)
	}
	return t
}

////////////////////////////////////////////////////////////////////////////////

// areaRow is a row returned by our area query
type areaRow struct {
	models.Area
	PolygonCoordinate        models.PolygonCoordinate `sqlp:"polygon_coordinate"`
	Boulder                  models.Boulder           `sqlp:"boulder"`
	Route                    models.Route             `sqlp:"route"`
	BoulderPolygon           models.Polygon           `sqlp:"boulder_polygon"`
	BoulderPolygonCoordinate models.PolygonCoordinate `sqlp:"boulder_polygon_coordinate"`
}
