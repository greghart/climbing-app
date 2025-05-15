package models

type Polygon struct {
	ID          *int         `json:"id,omitzero"`
	Descriptor  *string      `json:"descriptor,omitzero"`
	Coordinates []Coordinate `json:"coordinates,omitzero"`
	Area        *Area        `json:"area,omitzero"`
}

func (p Polygon) IsZero() bool {
	return p.ID == nil && p.Descriptor == nil && len(p.Coordinates) == 0 && p.Area == nil
}
