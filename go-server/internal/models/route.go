package models

type Route struct {
	ID          *int64   `json:"id,omitzero" sqlp:"id"`
	Name        string   `json:"name" sqlp:"name"`
	Description *string  `json:"description,omitzero" sqlp:"description"`
	FirstAscent *string  `json:"firstAscent,omitzero" sqlp:"firstAscent"`
	GradeRaw    string   `json:"gradeRaw" sqlp:"gradeRaw"`
	Grade       *Grade   `json:"grade,omitzero" sqlp:"grade"`
	Boulder     *Boulder `json:"boulder,omitzero" sqlp:"boulder"`
}

func (r Route) IsZero() bool {
	return r.ID == nil &&
		r.Name == "" &&
		r.Description == nil &&
		r.FirstAscent == nil &&
		r.GradeRaw == "" &&
		r.Grade == nil &&
		r.Boulder == nil
}
