package models

type Polygon struct {
	ID          *int         `json:"id,omitzero" sqlp:"id"`
	Descriptor  *string      `json:"descriptor,omitzero" sqlp:"descriptor"`
	Coordinates []Coordinate `json:"coordinates,omitzero" sqlp:"coordinates"`
	Area        *Area        `json:"area,omitzero" sqlp:"area"`
}

func (p Polygon) IsZero() bool {
	return p.ID == nil && p.Descriptor == nil && len(p.Coordinates) == 0 && p.Area == nil
}
