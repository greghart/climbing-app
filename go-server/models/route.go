package models

type Route struct {
	ID          *int     `json:"id,omitzero"`
	Name        string   `json:"name"`
	Length      *int     `json:"length,omitzero"`
	Description *string  `json:"description,omitzero"`
	FirstAscent *string  `json:"firstAscent,omitzero"`
	GradeRaw    string   `json:"gradeRaw"`
	Grade       *Grade   `json:"grade,omitzero"`
	Boulder     *Boulder `json:"boulder,omitzero"`
}

func (r Route) IsZero() bool {
	return r.ID == nil && r.Name == "" && r.Length == nil && r.Description == nil && r.FirstAscent == nil && r.GradeRaw == "" && r.Grade == nil && r.Boulder == nil
}
