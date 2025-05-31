package models

type Boulder struct {
	ID          *int64       `json:"id,omitzero" sqlp:"id"`
	Name        string       `json:"name" sqlp:"name"`
	Description *string      `json:"description,omitzero" sqlp:"description"`
	Coordinates Coordinate   `json:"coordinates" sqlp:"coordinates"`
	Area        *Area        `json:"area,omitzero" sqlp:"area"`
	Routes      []Route      `json:"routes,omitzero" sqlp:"routes"`
	Polygon     *Polygon     `json:"polygon,omitzero" sqlp:"polygon"`
	Commentable *Commentable `json:"commentable,omitzero" sqlp:"commentable"`
	Photoable   *Photoable   `json:"photoable,omitzero" sqlp:"photoable"`
}

func (b Boulder) IsZero() bool {
	return b.ID == nil && b.Name == "" && b.Description == nil && b.Coordinates.IsZero() && b.Area == nil &&
		len(b.Routes) == 0 && b.Polygon == nil && b.Commentable == nil && b.Photoable == nil
}
