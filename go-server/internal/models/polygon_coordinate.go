package models

import "github.com/greghart/powerputtygo/sqlp"

// PolygonCoordinate represents a point in a polygon. Mostly an implementation detail for
// ordering coordinates, since usually they can be passed around as a slice of ordered Coordinates.
type PolygonCoordinate struct {
	ID        int64 `json:"-" sqlp:"id,readonly"`
	PolygonID int64 `json:"-" sqlp:"polygonId"`
	Order     int   `json:"-" sqlp:"order"`
	Coordinate
}

func (p PolygonCoordinate) IsZero() bool {
	return p.ID == 0 &&
		p.Order == 0 &&
		p.Coordinate.IsZero()
}

var PolygonCoordinateMapper = func() sqlp.Mapper[PolygonCoordinate] {
	mapper := sqlp.Mapper[PolygonCoordinate]{
		"id":        func(p *PolygonCoordinate) any { return &p.ID },
		"polygonId": func(p *PolygonCoordinate) any { return &p.PolygonID },
		"order":     func(p *PolygonCoordinate) any { return &p.Order },
	}
	mapper = sqlp.MergeMappers(
		mapper,
		CoordinateMapper,
		"",
		func(pc *PolygonCoordinate) *Coordinate {
			return &pc.Coordinate
		},
	)
	return mapper
}()
