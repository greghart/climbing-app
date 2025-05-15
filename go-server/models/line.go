package models

type Line struct {
	ID    *int       `json:"id,omitzero"`
	Start Coordinate `json:"start"`
	End   Coordinate `json:"end"`
	Trail *Trail     `json:"trail,omitzero"`
}

func (l Line) IsZero() bool {
	return l.ID == nil && l.Start.IsZero() && l.End.IsZero() && l.Trail == nil
}
