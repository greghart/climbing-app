package models

type Topogon struct {
	ID      int      `json:"id" sqlp:"id"`
	Label   *string  `json:"label,omitzero" sqlp:"label"`
	Topo    *Topo    `json:"topo,omitzero" sqlp:"topo"`
	Area    *Area    `json:"area,omitzero" sqlp:"area"`
	Boulder *Boulder `json:"boulder,omitzero" sqlp:"boulder"`
	Route   *Route   `json:"route,omitzero" sqlp:"route"`
}

func (t Topogon) IsZero() bool {
	return t.ID == 0 && t.Label == nil && t.Topo == nil && t.Area == nil && t.Boulder == nil && t.Route == nil
}
