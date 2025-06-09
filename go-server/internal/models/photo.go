package models

type Photo struct {
	ID          int64      `json:"id" sqlp:"id"`
	Title       string     `json:"title" sqlp:"title"`
	Description *string    `json:"description,omitzero" sqlp:"description"`
	Upload      *Upload    `json:"upload,omitzero" sqlp:"upload"`
	Photoable   *Photoable `json:"photoable,omitzero" sqlp:"photoable"`
	Topo        *Topo      `json:"topo,omitzero" sqlp:"topo"`
	Timestamps
}

func (p Photo) IsZero() bool {
	return p.ID == 0 &&
		p.Title == "" &&
		p.Description == nil &&
		p.Upload == nil &&
		p.Photoable == nil &&
		p.Topo == nil &&
		p.Timestamps.IsZero()
}
