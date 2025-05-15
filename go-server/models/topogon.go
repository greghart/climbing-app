package models

type Topogon struct {
	ID      int      `json:"id"`
	Label   *string  `json:"label,omitzero"`
	Topo    *Topo    `json:"topo,omitzero"`
	Area    *Area    `json:"area,omitzero"`
	Boulder *Boulder `json:"boulder,omitzero"`
	Route   *Route   `json:"route,omitzero"`
}

func (t Topogon) IsZero() bool {
	return t.ID == 0 && t.Label == nil && t.Topo == nil && t.Area == nil && t.Boulder == nil && t.Route == nil
}
