package models

type Coordinate struct {
	Lat float64 `json:"lat" sqlp:"Lat"`
	Lng float64 `json:"lng" sqlp:"Lng"`
}

func (c Coordinate) IsZero() bool {
	return c.Lat == 0 && c.Lng == 0
}
