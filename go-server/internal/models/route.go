package models

type Route struct {
	ID          int64      `json:"id,omitzero" sqlp:"id"`
	Name        string     `json:"name" sqlp:"name"`
	Description *string    `json:"description,omitzero" sqlp:"description"`
	FirstAscent *string    `json:"firstAscent,omitzero" sqlp:"firstAscent"`
	GradeRaw    string     `json:"gradeRaw" sqlp:"gradeRaw"`
	Grade       *Grade     `json:"grade,omitzero" sqlp:"grade"`
	BoulderID   int64      `json:"boulder_id,omitzero" sqlp:"boulderId"`
	Coordinates Coordinate `json:"coordinates" sqlp:"coordinates,promote"`
}

func (r Route) IsZero() bool {
	return r.ID == 0 &&
		r.Name == "" &&
		r.Description == nil &&
		r.FirstAscent == nil &&
		r.GradeRaw == "" &&
		r.Grade == nil &&
		r.BoulderID == 0
}
