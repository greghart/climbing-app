package models

type Crag struct {
	ID          int64        `json:"id,omitzero" sqlp:"id"`
	Name        string       `json:"name" sqlp:"name"`
	Description *string      `json:"description,omitzero" sqlp:"description"`
	Bounds      *Bounds      `json:"bounds,omitzero" sqlp:"bounds"`
	Center      Coordinate   `json:"center" sqlp:"center"`
	DefaultZoom int          `json:"defaultZoom" sqlp:"defaultZoom"`
	MinZoom     *int         `json:"minZoom,omitzero" sqlp:"minZoom"`
	MaxZoom     *int         `json:"maxZoom,omitzero" sqlp:"maxZoom"`
	Parking     *Parking     `json:"parking,omitzero" sqlp:"parking"`
	Areas       []Area       `json:"areas,omitzero" sqlp:"areas"`
	Commentable *Commentable `json:"commentable,omitzero" sqlp:"commentable"`
	Photoable   *Photoable   `json:"photoable,omitzero" sqlp:"photoable"`
	Trail       *Trail       `json:"trail,omitzero" sqlp:"trail"`
}

func (c Crag) IsZero() bool {
	return c.ID == 0 && c.Name == "" && c.Description == nil && c.Bounds == nil && c.Center.IsZero() &&
		c.DefaultZoom == 0 && c.MinZoom == nil && c.MaxZoom == nil && c.Parking == nil &&
		len(c.Areas) == 0 && c.Commentable == nil && c.Photoable == nil && c.Trail == nil
}
