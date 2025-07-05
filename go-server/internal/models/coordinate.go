package models

import "github.com/greghart/powerputtygo/sqlp"

type Coordinate struct {
	Lat float64 `json:"lat" sqlp:"Lat"`
	Lng float64 `json:"lng" sqlp:"Lng"`
}

func (c Coordinate) IsZero() bool {
	return c.Lat == 0 && c.Lng == 0
}

var CoordinateMapper = sqlp.Mapper[Coordinate]{
	"Lat": func(c *Coordinate) any { return &c.Lat },
	"Lng": func(c *Coordinate) any { return &c.Lng },
}
