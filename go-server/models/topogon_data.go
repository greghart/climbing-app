package models

type Point struct {
	X float64 `json:"x"`
	Y float64 `json:"y"`
}

func (p Point) IsZero() bool {
	return p.X == 0 && p.Y == 0
}
