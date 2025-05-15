package models

type Trail struct {
	ID    *int   `json:"id,omitzero"`
	Crag  *Crag  `json:"crag,omitzero"`
	Lines []Line `json:"lines,omitzero"`
}

func (t Trail) IsZero() bool {
	return t.ID == nil && t.Crag == nil && len(t.Lines) == 0
}
