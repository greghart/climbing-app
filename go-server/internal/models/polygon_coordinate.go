package models

// PolygonCoordinate represents a point in a polygon. Mostly an implementation detail for
// ordering coordinates, since usually they can be passed around as a slice of ordered Coordinates.
type PolygonCoordinate struct {
	ID    int64 `json:"id,omitzero" sqlp:"id"`
	Order int   `json:"order,omitzero" sqlp:"order"`
	Coordinate
}

func (p PolygonCoordinate) IsZero() bool {
	return p.ID == 0 &&
		p.Order == 0 &&
		p.Coordinate.IsZero()
}
