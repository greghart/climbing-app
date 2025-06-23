package models

type Trail struct {
	ID     int64  `json:"id,omitzero" sqlp:"id"`
	CragID int64  `json:"crag_id,omitzero" sqlp:"cragId"`
	Lines  []Line `json:"lines,omitzero"`
}

func (t Trail) IsZero() bool {
	return t.ID == 0 && t.CragID == 0 && len(t.Lines) == 0
}
