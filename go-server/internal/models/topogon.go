package models

// Topogon represents the polygons of a topo -- it relates domain entities to their visual
// representations.
type Topogon struct {
	ID          int          `json:"id" sqlp:"id"`
	Label       *string      `json:"label,omitzero" sqlp:"label"`
	Topo        *Topo        `json:"topo,omitzero" sqlp:"topo"`
	Area        *Area        `json:"area,omitzero" sqlp:"area"`
	Boulder     *Boulder     `json:"boulder,omitzero" sqlp:"boulder"`
	Route       *Route       `json:"route,omitzero" sqlp:"route"`
	TopogonData *TopogonData `json:"topogonData,omitzero" sqlp:"data"`
}

func (t Topogon) IsZero() bool {
	return t.ID == 0 &&
		t.Label == nil &&
		t.Topo == nil &&
		t.Area == nil &&
		t.Boulder == nil &&
		t.Route == nil &&
		t.TopogonData == nil
}
