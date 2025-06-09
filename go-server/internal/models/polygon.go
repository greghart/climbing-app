package models

type Polygon struct {
	ID          int64        `json:"id,omitzero" sqlp:"id"`
	Descriptor  *string      `json:"descriptor,omitzero" sqlp:"descriptor"`
	Coordinates []Coordinate `json:"coordinates,omitzero" sqlp:"coordinates"`
	AreaID      int64        `json:"area_id,omitzero" sqlp:"area"`
}

func (p Polygon) IsZero() bool {
	return p.ID == 0 &&
		p.Descriptor == nil &&
		len(p.Coordinates) == 0 &&
		p.AreaID == 0
}
