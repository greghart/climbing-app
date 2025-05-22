package models

type Bounds struct {
	TopLeft     Coordinate `json:"topLeft" sqlp:"topLeft"`
	BottomRight Coordinate `json:"bottomRight" sqlp:"bottomRight"`
}

func (b Bounds) IsZero() bool {
	return b.TopLeft.IsZero() && b.BottomRight.IsZero()
}
