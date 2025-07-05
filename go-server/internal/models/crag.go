package models

import "github.com/greghart/powerputtygo/sqlp"

type Crag struct {
	ID          int64        `json:"id,omitzero" sqlp:"id"`
	Name        string       `json:"name" sqlp:"name"`
	Description *string      `json:"description,omitzero" sqlp:"description"`
	Bounds      *Bounds      `json:"bounds,omitzero" sqlp:"bounds,promote"`
	Center      Coordinate   `json:"center" sqlp:"center,promote"`
	DefaultZoom int          `json:"defaultZoom" sqlp:"defaultZoom"`
	MinZoom     *int         `json:"minZoom,omitzero" sqlp:"minZoom"`
	MaxZoom     *int         `json:"maxZoom,omitzero" sqlp:"maxZoom"`
	Parking     *Parking     `json:"parking,omitzero" sqlp:"parking"`
	Areas       []Area       `json:"areas,omitzero"`
	Commentable *Commentable `json:"commentable,omitzero" sqlp:"commentable"`
	Photoable   *Photoable   `json:"photoable,omitzero" sqlp:"photoable"`
	Trail       *Trail       `json:"trail,omitzero" sqlp:"trail"`
	Timestamps
}

func (c Crag) IsZero() bool {
	return (c.ID == 0 &&
		c.Name == "" &&
		c.Description == nil &&
		c.Bounds == nil &&
		c.Center.IsZero() &&
		c.DefaultZoom == 0 &&
		c.MinZoom == nil &&
		c.MaxZoom == nil &&
		c.Parking == nil &&
		len(c.Areas) == 0 &&
		c.Commentable == nil &&
		c.Photoable == nil &&
		c.Trail == nil)
}

var CragMapper = func() sqlp.Mapper[Crag] {
	mapper := sqlp.Mapper[Crag]{
		"id":          func(c *Crag) any { return &c.ID },
		"name":        func(c *Crag) any { return &c.Name },
		"description": func(c *Crag) any { return &c.Description },
		"defaultZoom": func(c *Crag) any { return &c.DefaultZoom },
		"minZoom":     func(c *Crag) any { return &c.MinZoom },
		"maxZoom":     func(c *Crag) any { return &c.MaxZoom },
	}
	mapper = sqlp.MergeMappers(
		mapper,
		AreaMapper,
		"areas",
		func(c *Crag) *Area {
			if len(c.Areas) == 0 {
				c.Areas = append(c.Areas, Area{})
			}
			return &c.Areas[0]
		},
	)
	mapper = sqlp.MergeMappers(
		mapper,
		BoundsMapper,
		"bounds",
		func(c *Crag) *Bounds {
			if c.Bounds == nil {
				c.Bounds = &Bounds{}
			}
			return c.Bounds
		},
	)
	mapper = sqlp.MergeMappers(
		mapper,
		CoordinateMapper,
		"center",
		func(c *Crag) *Coordinate {
			return &c.Center
		},
	)
	mapper = sqlp.MergeMappers(
		mapper,
		ParkingMapper,
		"parking",
		func(c *Crag) *Parking {
			if c.Parking == nil {
				c.Parking = &Parking{}
			}
			return c.Parking
		},
	)
	mapper = sqlp.MergeMappers(
		mapper,
		TimestampsMapper,
		"",
		func(c *Crag) *Timestamps {
			return &c.Timestamps
		},
	)
	return mapper
}()
