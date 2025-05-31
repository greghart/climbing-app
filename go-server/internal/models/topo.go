package models

type Topo struct {
	ID    *int64 `json:"id,omitzero" sqlp:"id"`
	Title string `json:"title" sqlp:"title"`
}

func (t Topo) IsZero() bool {
	return t.ID == nil && t.Title == ""
}
