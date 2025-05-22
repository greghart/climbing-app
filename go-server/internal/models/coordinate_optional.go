package models

type CoordinateOptional struct {
	Lat *float64 `json:"lat,omitzero" sqlp:"lat"`
	Lng *float64 `json:"lng,omitzero" sqlp:"lng"`
}

func (c CoordinateOptional) IsZero() bool {
	return c.Lat == nil && c.Lng == nil
}
