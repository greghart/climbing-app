package models

type Coordinate struct {
	Lat float64 `json:"lat"`
	Lng float64 `json:"lng"`
}

func (c Coordinate) IsZero() bool {
	return c.Lat == 0 && c.Lng == 0
}
