package models

type Bounds struct {
	TopLeft     Coordinate `json:"topLeft"`
	BottomRight Coordinate `json:"bottomRight"`
}

func (b Bounds) IsZero() bool {
	return b.TopLeft.IsZero() && b.BottomRight.IsZero()
}
