package models

type Area struct {
	ID          int64        `json:"id,omitzero" sqlp:"id"`
	Name        string       `json:"name" sqlp:"name"`
	Description *string      `json:"description,omitzero" sqlp:"description"`
	CragID      int64        `json:"-" sqlp:"cragId"`
	Polygon     *Polygon     `json:"polygon,omitzero" sqlp:"polygon"`
	PolygonID   *int64       `json:"-" sqlp:"polygonId"`
	Boulders    []Boulder    `json:"boulders,omitzero"`
	Commentable *Commentable `json:"commentable,omitzero" sqlp:"commentable"`
	Photoable   *Photoable   `json:"photoable,omitzero" sqlp:"photoable"`
	Timestamps
}

func (a Area) IsZero() bool {
	return a.ID == 0 &&
		a.Name == "" &&
		a.Description == nil &&
		a.CragID == 0 &&
		a.Polygon == nil &&
		len(a.Boulders) == 0 &&
		a.Commentable == nil &&
		a.Photoable == nil
}
