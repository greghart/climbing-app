package models

type Area struct {
	ID          *int         `json:"id,omitzero"`
	Name        string       `json:"name"`
	Description *string      `json:"description,omitzero"`
	Crag        *Crag        `json:"crag,omitzero"`
	Polygon     *Polygon     `json:"polygon,omitzero"`
	Boulders    []Boulder    `json:"boulders,omitzero"`
	Commentable *Commentable `json:"commentable,omitzero"`
	Photoable   *Photoable   `json:"photoable,omitzero"`
}

func (a Area) IsZero() bool {
	return a.ID == nil && a.Name == "" && a.Description == nil && a.Crag == nil && a.Polygon == nil &&
		len(a.Boulders) == 0 && a.Commentable == nil && a.Photoable == nil
}
