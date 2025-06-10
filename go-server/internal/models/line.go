package models

type Line struct {
	ID      int64      `json:"id,omitzero" sqlp:"id"`
	Start   Coordinate `json:"start" sqlp:"start"`
	End     Coordinate `json:"end" sqlp:"end"`
	TrailID int64      `json:"trail_id,omitzero" sqlp:"trail_id"`
}

func (l Line) IsZero() bool {
	return l.ID == 0 && l.Start.IsZero() && l.End.IsZero() && l.TrailID == 0
}
