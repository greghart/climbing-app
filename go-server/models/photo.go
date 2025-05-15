package models

type Photo struct {
	ID          int        `json:"id"`
	Title       string     `json:"title"`
	Description *string    `json:"description,omitzero"`
	Upload      *Upload    `json:"upload,omitzero"`
	Photoable   *Photoable `json:"photoable,omitzero"`
	Topo        *Topo      `json:"topo,omitzero"`
	CreatedAt   string     `json:"createdAt"`
	UpdatedAt   string     `json:"updatedAt"`
}

func (p Photo) IsZero() bool {
	return p.ID == 0 && p.Title == "" && p.Description == nil && p.Upload == nil && p.Photoable == nil && p.Topo == nil && p.CreatedAt == "" && p.UpdatedAt == ""
}
