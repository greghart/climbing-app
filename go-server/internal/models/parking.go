package models

type Parking struct {
	ID          int64      `json:"id,omitzero" sqlp:"id"`
	Name        *string    `json:"name,omitzero" sqlp:"name"`
	Description *string    `json:"description,omitzero" sqlp:"description"`
	Location    Coordinate `json:"location" sqlp:"location"`
	CragID      int64      `json:"crag_id,omitzero" sqlp:"cragId"`
}

func (p Parking) IsZero() bool {
	return p.ID == 0 &&
		p.Name == nil &&
		p.Description == nil &&
		p.Location.IsZero() &&
		p.CragID == 0
}
