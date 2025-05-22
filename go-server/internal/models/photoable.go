package models

type Photoable struct {
	ID         *int     `json:"id,omitzero" sqlp:"id"`
	Crag       *Crag    `json:"crag,omitzero" sqlp:"crag"`
	Area       *Area    `json:"area,omitzero" sqlp:"area"`
	Boulder    *Boulder `json:"boulder,omitzero" sqlp:"boulder"`
	Route      *Route   `json:"route,omitzero" sqlp:"route"`
	Descriptor string   `json:"descriptor" sqlp:"descriptor"`
}

func (p Photoable) IsZero() bool {
	return p.ID == nil && p.Crag == nil && p.Area == nil && p.Boulder == nil && p.Route == nil && p.Descriptor == ""
}
