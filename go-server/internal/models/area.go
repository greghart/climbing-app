package models

import "github.com/greghart/powerputtygo/sqlp"

type Area struct {
	ID          int64   `json:"id,omitzero" sqlp:"id"`
	Name        string  `json:"name" sqlp:"name"`
	Description *string `json:"description,omitzero" sqlp:"description"`
	CragID      int64   `json:"-" sqlp:"cragId"`
	Crag        *Crag
	Polygon     *Polygon     `json:"polygon,omitzero" sqlp:"polygon"`
	PolygonID   *int64       `json:"-" sqlp:"polygonId"`
	Boulders    []Boulder    `json:"boulders,omitzero"`
	Commentable *Commentable `json:"commentable,omitzero" sqlp:"commentable"`
	Photoable   *Photoable   `json:"photoable,omitzero" sqlp:"photoable"`
	Timestamps
}

func (a Area) IsZero() bool {
	return a.ID == 0 &&
		a.Name == "" &&
		a.Description == nil &&
		a.CragID == 0 &&
		a.Polygon == nil &&
		len(a.Boulders) == 0 &&
		a.Commentable == nil &&
		a.Photoable == nil
}

var AreaMapper = func() sqlp.Mapper[Area] {
	mapper := sqlp.Mapper[Area]{
		"id":          func(a *Area) any { return &a.ID },
		"name":        func(a *Area) any { return &a.Name },
		"description": func(a *Area) any { return &a.Description },
		"cragId":      func(a *Area) any { return &a.CragID },
		"polygonId":   func(a *Area) any { return &a.PolygonID },
	}
	mapper = sqlp.MergeMappers(
		mapper,
		BoulderMapper,
		"boulders",
		func(a *Area) *Boulder {
			if len(a.Boulders) == 0 {
				a.Boulders = append(a.Boulders, Boulder{})
			}
			return &a.Boulders[0]
		},
	)
	mapper = sqlp.MergeMappers(
		mapper,
		PolygonMapper,
		"polygon",
		func(a *Area) *Polygon {
			if a.Polygon == nil {
				a.Polygon = &Polygon{}
			}
			return a.Polygon
		},
	)
	mapper = sqlp.MergeMappers(
		mapper,
		CommentableMapper,
		"commentable",
		func(a *Area) *Commentable {
			if a.Commentable == nil {
				a.Commentable = &Commentable{}
			}
			return a.Commentable
		},
	)
	mapper = sqlp.MergeMappers(
		mapper,
		PhotoableMapper,
		"photoable",
		func(a *Area) *Photoable {
			if a.Photoable == nil {
				a.Photoable = &Photoable{}
			}
			return a.Photoable
		},
	)
	mapper = sqlp.MergeMappers(
		mapper,
		TimestampsMapper,
		"",
		func(a *Area) *Timestamps {
			return &a.Timestamps
		},
	)
	return mapper
}()
