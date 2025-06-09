package models

import (
	"encoding/json"
)

// TopogonData represents the visual structures of a topogon (the polygons for a topo).
type TopogonData struct {
	Labels []TopogonLabel `json:"polygons"`
	Lines  []TopogonLine  `json:"lines"`
}

type TopogonPoint struct {
	X float64 `json:"x"`
	Y float64 `json:"y"`
}

func (p TopogonPoint) IsZero() bool {
	return p.X == 0 && p.Y == 0
}

////////////////////////////////////////////////////////////////////////////////

// Line is a line segment between two points, additionally with some "tension"
// as konva calls it.
type TopogonLine struct {
	Points  []TopogonPoint `json:"points"`  // Points of the line
	Color   string         `json:"color"`   // Color of line
	Tension float64        `json:"tension"` // Tension of line
}

////////////////////////////////////////////////////////////////////////////////

// Label is some text displayed on a background
type TopogonLabel struct {
	Text      string       `json:"text"`
	Point     TopogonPoint `json:"point"`
	Color     string       `json:"color"`
	Fill      string       `json:"fill"`
	Direction Direction    `json:"direction"` // "up" | "right" | "down" | "left" | "none"
}

func (l TopogonLabel) IsZero() bool {
	return l.Text == "" &&
		l.Point.IsZero() &&
		l.Color == "" &&
		l.Fill == "" &&
		l.Direction == DirectionNone
}

type Direction string

const (
	DirectionUp    Direction = "up"
	DirectionRight Direction = "right"
	DirectionDown  Direction = "down"
	DirectionLeft  Direction = "left"
	DirectionNone  Direction = "none"
)

func (d *Direction) UnmarshalJSON(data []byte) error {
	var dir string
	if err := json.Unmarshal(data, &dir); err != nil {
		return err
	}

	switch dir {
	case "up", "right", "down", "left", "none":
		*d = Direction(dir)
	default:
		*d = DirectionNone
	}
	return nil
}
