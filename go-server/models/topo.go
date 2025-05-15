package models

type Topo struct {
	ID    *int   `json:"id,omitzero"`
	Title string `json:"title"`
}

func (t Topo) IsZero() bool {
	return t.ID == nil && t.Title == ""
}
