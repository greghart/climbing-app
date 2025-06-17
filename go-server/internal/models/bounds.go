package models

type Bounds struct {
	TopLeft     Coordinate `json:"topLeft" sqlp:"topLeft,promote"`
	BottomRight Coordinate `json:"bottomRight" sqlp:"bottomRight,promote"`
}

func (b Bounds) IsZero() bool {
	return b.TopLeft.IsZero() && b.BottomRight.IsZero()
}
