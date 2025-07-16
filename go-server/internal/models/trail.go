package models

type Trail struct {
	ID    int64  `json:"id,omitzero" sqlp:"id,readonly"`
	Lines []Line `json:"lines,omitzero"`
}

func (t Trail) IsZero() bool {
	return t.ID == 0 && len(t.Lines) == 0
}
