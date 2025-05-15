package models

type Parking struct {
	ID          *int       `json:"id,omitzero"`
	Name        *string    `json:"name,omitzero"`
	Description *string    `json:"description,omitzero"`
	Location    Coordinate `json:"location"`
	Crag        *Crag      `json:"crag,omitzero"`
}

func (p Parking) IsZero() bool {
	return p.ID == nil && p.Name == nil && p.Description == nil && p.Location.IsZero() && p.Crag == nil
}
