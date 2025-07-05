package models

import "github.com/greghart/powerputtygo/sqlp"

type Boulder struct {
	ID          int64        `json:"id,omitzero" sqlp:"id"`
	Name        string       `json:"name" sqlp:"name"`
	Description *string      `json:"description,omitzero" sqlp:"description"`
	Coordinates Coordinate   `json:"coordinates" sqlp:"coordinates,promote"`
	AreaID      int64        `json:"area_id,omitzero" sqlp:"areaId"`
	Routes      []Route      `json:"routes,omitzero"`
	Polygon     *Polygon     `json:"polygon,omitzero" sqlp:"polygon"`
	Commentable *Commentable `json:"commentable,omitzero" sqlp:"commentable"`
	Photoable   *Photoable   `json:"photoable,omitzero" sqlp:"photoable"`
}

func (b Boulder) IsZero() bool {
	return b.ID == 0 &&
		b.Name == "" &&
		b.Description == nil &&
		b.Coordinates.IsZero() &&
		b.AreaID == 0 &&
		len(b.Routes) == 0 &&
		b.Polygon == nil &&
		b.Commentable == nil &&
		b.Photoable == nil
}

var BoulderMapper = func() sqlp.Mapper[Boulder] {
	mapper := sqlp.Mapper[Boulder]{
		"id":          func(b *Boulder) any { return &b.ID },
		"name":        func(b *Boulder) any { return &b.Name },
		"description": func(b *Boulder) any { return &b.Description },
		"areaId":      func(b *Boulder) any { return &b.AreaID },
	}
	mapper = sqlp.MergeMappers(
		mapper,
		CoordinateMapper,
		"coordinates",
		func(b *Boulder) *Coordinate {
			return &b.Coordinates
		},
	)
	mapper = sqlp.MergeMappers(
		mapper,
		RouteMapper,
		"routes",
		func(b *Boulder) *Route {
			if len(b.Routes) == 0 {
				b.Routes = append(b.Routes, Route{})
			}
			return &b.Routes[0]
		},
	)
	mapper = sqlp.MergeMappers(
		mapper,
		PolygonMapper,
		"polygon",
		func(b *Boulder) *Polygon {
			if b.Polygon == nil {
				b.Polygon = &Polygon{}
			}
			return b.Polygon
		},
	)
	return mapper
}()
