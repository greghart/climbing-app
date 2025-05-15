package models

type Photoable struct {
	ID         *int     `json:"id,omitzero"`
	Crag       *Crag    `json:"crag,omitzero"`
	Area       *Area    `json:"area,omitzero"`
	Boulder    *Boulder `json:"boulder,omitzero"`
	Route      *Route   `json:"route,omitzero"`
	Descriptor string   `json:"descriptor"`
}

func (p Photoable) IsZero() bool {
	return p.ID == nil && p.Crag == nil && p.Area == nil && p.Boulder == nil && p.Route == nil && p.Descriptor == ""
}
