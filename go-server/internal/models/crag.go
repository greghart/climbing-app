package models

type Crag struct {
	ID          int64        `json:"id,omitzero" sqlp:"id"`
	Name        string       `json:"name" sqlp:"name"`
	Description *string      `json:"description,omitzero" sqlp:"description"`
	Bounds      Bounds       `json:"bounds,omitzero" sqlp:"bounds,promote"`
	Center      Coordinate   `json:"center" sqlp:"center,promote"`
	DefaultZoom int          `json:"defaultZoom" sqlp:"defaultZoom"`
	MinZoom     *int         `json:"minZoom,omitzero" sqlp:"minZoom"`
	MaxZoom     *int         `json:"maxZoom,omitzero" sqlp:"maxZoom"`
	Parking     *Parking     `json:"parking,omitzero" sqlp:"parking"`
	Areas       []Area       `json:"areas,omitzero"`
	Commentable *Commentable `json:"commentable,omitzero" sqlp:"commentable"`
	Photoable   *Photoable   `json:"photoable,omitzero" sqlp:"photoable"`
	Trail       *Trail       `json:"trail,omitzero" sqlp:"trail"`
	TrailID     *int64       `json:"-" sqlp:"trailId"`
	Timestamps
}

func (c *Crag) IsZero() bool {
	return (c.ID == 0 &&
		c.Name == "" &&
		c.Description == nil &&
		c.Bounds.IsZero() &&
		c.Center.IsZero() &&
		c.DefaultZoom == 0 &&
		c.MinZoom == nil &&
		c.MaxZoom == nil &&
		c.Parking == nil &&
		len(c.Areas) == 0 &&
		c.Commentable == nil &&
		c.Photoable == nil &&
		c.Trail == nil)
}
