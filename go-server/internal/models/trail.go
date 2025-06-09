package models

type Trail struct {
	// TODO: Refactor all id pointers to normal -- easier to just compare to 0 and coalesce (IMO)
	ID    *int64 `json:"id,omitzero" sqlp:"id"`
	Crag  *Crag  `json:"crag,omitzero" sqlp:"crag"`
	Lines []Line `json:"lines,omitzero" sqlp:"lines"`
}

func (t Trail) IsZero() bool {
	return t.ID == nil && t.Crag == nil && len(t.Lines) == 0
}
