package models

type Crag struct {
	ID          *int         `json:"id,omitzero"`
	Name        string       `json:"name"`
	Description *string      `json:"description,omitzero"`
	Bounds      *Bounds      `json:"bounds,omitzero"`
	Center      Coordinate   `json:"center"`
	DefaultZoom int          `json:"defaultZoom"`
	MinZoom     *int         `json:"minZoom,omitzero"`
	MaxZoom     *int         `json:"maxZoom,omitzero"`
	Parking     *Parking     `json:"parking,omitzero"`
	Areas       []Area       `json:"areas,omitzero"`
	Commentable *Commentable `json:"commentable,omitzero"`
	Photoable   *Photoable   `json:"photoable,omitzero"`
	Trail       *Trail       `json:"trail,omitzero"`
}

func (c Crag) IsZero() bool {
	return c.ID == nil && c.Name == "" && c.Description == nil && c.Bounds == nil && c.Center.IsZero() &&
		c.DefaultZoom == 0 && c.MinZoom == nil && c.MaxZoom == nil && c.Parking == nil &&
		len(c.Areas) == 0 && c.Commentable == nil && c.Photoable == nil && c.Trail == nil
}
