package models

type Polygon struct {
	ID          int64               `json:"id,omitzero" sqlp:"id"`
	Descriptor  *string             `json:"descriptor,omitzero" sqlp:"descriptor"`
	Coordinates []PolygonCoordinate `json:"coordinates,omitzero" sqlp:"-"`
}

func (p Polygon) IsZero() bool {
	return p.ID == 0 &&
		p.Descriptor == nil &&
		len(p.Coordinates) == 0
}
