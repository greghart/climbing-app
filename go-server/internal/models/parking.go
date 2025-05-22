package models

type Parking struct {
	ID          *int       `json:"id,omitzero" sqlp:"id"`
	Name        *string    `json:"name,omitzero" sqlp:"name"`
	Description *string    `json:"description,omitzero" sqlp:"description"`
	Location    Coordinate `json:"location" sqlp:"location"`
	Crag        *Crag      `json:"crag,omitzero" sqlp:"crag"`
}

func (p Parking) IsZero() bool {
	return p.ID == nil && p.Name == nil && p.Description == nil && p.Location.IsZero() && p.Crag == nil
}
