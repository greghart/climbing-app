package models

type CoordinateOptional struct {
	Lat *float64 `json:"lat,omitzero"`
	Lng *float64 `json:"lng,omitzero"`
}

func (c CoordinateOptional) IsZero() bool {
	return c.Lat == nil && c.Lng == nil
}
