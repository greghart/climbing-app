package models

type Photoable struct {
	ID         int64   `json:"id,omitzero" sqlp:"id"`
	CragID     int64   `json:"crag_id,omitzero" sqlp:"crag"`
	AreaID     int64   `json:"area_id,omitzero" sqlp:"area"`
	BoulderID  int64   `json:"boulder_id,omitzero" sqlp:"boulder"`
	RouteID    int64   `json:"route_id,omitzero" sqlp:"route"`
	Descriptor string  `json:"descriptor" sqlp:"descriptor"`
	Photos     []Photo `json:"photos,omitzero" sqlp:"photos"`
}

func (p Photoable) IsZero() bool {
	return p.ID == 0 &&
		p.CragID == 0 &&
		p.AreaID == 0 &&
		p.BoulderID == 0 &&
		p.RouteID == 0 &&
		p.Descriptor == "" &&
		len(p.Photos) == 0
}
