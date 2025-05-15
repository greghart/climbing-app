package models

type Boulder struct {
	ID          *int         `json:"id,omitzero"`
	Name        string       `json:"name"`
	Description *string      `json:"description,omitzero"`
	Coordinates Coordinate   `json:"coordinates"`
	Area        *Area        `json:"area,omitzero"`
	Routes      []Route      `json:"routes,omitzero"`
	Polygon     *Polygon     `json:"polygon,omitzero"`
	Commentable *Commentable `json:"commentable,omitzero"`
	Photoable   *Photoable   `json:"photoable,omitzero"`
}

func (b Boulder) IsZero() bool {
	return b.ID == nil && b.Name == "" && b.Description == nil && b.Coordinates.IsZero() && b.Area == nil &&
		len(b.Routes) == 0 && b.Polygon == nil && b.Commentable == nil && b.Photoable == nil
}
