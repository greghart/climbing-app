package models

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
