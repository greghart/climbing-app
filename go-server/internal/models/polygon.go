package models

import "github.com/greghart/powerputtygo/sqlp"

type Polygon struct {
	ID          int64               `json:"id,omitzero" sqlp:"id"`
	Descriptor  *string             `json:"descriptor,omitzero" sqlp:"descriptor"`
	Coordinates []PolygonCoordinate `json:"coordinates,omitzero" sqlp:"-"`
}

func (p Polygon) IsZero() bool {
	return p.ID == 0 &&
		p.Descriptor == nil &&
		len(p.Coordinates) == 0
}

var PolygonMapper = func() sqlp.Mapper[Polygon] {
	mapper := sqlp.Mapper[Polygon]{
		"id":         func(p *Polygon) any { return &p.ID },
		"descriptor": func(p *Polygon) any { return &p.Descriptor },
	}
	mapper = sqlp.MergeMappers(
		mapper,
		PolygonCoordinateMapper,
		"coordinates",
		func(p *Polygon) *PolygonCoordinate {
			if len(p.Coordinates) == 0 {
				p.Coordinates = append(p.Coordinates, PolygonCoordinate{})
			}
			return &p.Coordinates[0]
		},
	)
	return mapper
}()
