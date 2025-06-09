package models

type Topo struct {
	ID       int64     `json:"id,omitzero" sqlp:"id"`
	Title    string    `json:"title" sqlp:"title"`
	Topogons []Topogon `json:"topogons,omitzero" sqlp:"topogons"`
	// The scale of the photo when topogons were created.
	// Eg. if photo is 1000x1000, but topogon was drawn on 500x500, scale is 0.5
	Scale float64 `json:"scale,omitzero" sqlp:"scale"`
}

func (t Topo) IsZero() bool {
	return t.ID == 0 && t.Title == "" && len(t.Topogons) == 0 && t.Scale == 0
}
