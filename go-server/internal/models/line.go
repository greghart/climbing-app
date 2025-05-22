package models

type Line struct {
	ID    *int       `json:"id,omitzero" sqlp:"id"`
	Start Coordinate `json:"start" sqlp:"start"`
	End   Coordinate `json:"end" sqlp:"end"`
	Trail *Trail     `json:"trail,omitzero" sqlp:"trail"`
}

func (l Line) IsZero() bool {
	return l.ID == nil && l.Start.IsZero() && l.End.IsZero() && l.Trail == nil
}
