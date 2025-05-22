package models

type Area struct {
	ID          *int         `json:"id,omitzero" sqlp:"id"`
	Name        string       `json:"name" sqlp:"name"`
	Description *string      `json:"description,omitzero" sqlp:"description"`
	Crag        *Crag        `json:"crag,omitzero" sqlp:"crag"`
	Polygon     *Polygon     `json:"polygon,omitzero" sqlp:"polygon"`
	Boulders    []Boulder    `json:"boulders,omitzero" sqlp:"boulders"`
	Commentable *Commentable `json:"commentable,omitzero" sqlp:"commentable"`
	Photoable   *Photoable   `json:"photoable,omitzero" sqlp:"photoable"`
}

func (a Area) IsZero() bool {
	return a.ID == nil && a.Name == "" && a.Description == nil && a.Crag == nil && a.Polygon == nil &&
		len(a.Boulders) == 0 && a.Commentable == nil && a.Photoable == nil
}
