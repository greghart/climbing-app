package models

type Trail struct {
	ID    int64  `json:"id,omitzero" sqlp:"id"`
	Crag  *Crag  `json:"crag,omitzero" sqlp:"crag"`
	Lines []Line `json:"lines,omitzero" sqlp:"lines"`
}

func (t Trail) IsZero() bool {
	return t.ID == 0 && t.Crag == nil && len(t.Lines) == 0
}
