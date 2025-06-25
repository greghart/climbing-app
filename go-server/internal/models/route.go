package models

import "encoding/json"

type Route struct {
	ID          int64   `json:"id,omitzero" sqlp:"id"`
	Name        string  `json:"name" sqlp:"name"`
	Description *string `json:"description,omitzero" sqlp:"description"`
	FirstAscent *string `json:"firstAscent,omitzero" sqlp:"firstAscent"`
	GradeRaw    string  `json:"-" sqlp:"gradeRaw"` // don't leak raw grade, always parse
	// Grade is not persisted in database, and is a "virtual" field based on parsing raw.
	Grade       *Grade     `json:"grade,omitzero" sqlp:"-"`
	BoulderID   int64      `json:"boulder_id,omitzero" sqlp:"boulderId"`
	Coordinates Coordinate `json:"coordinates" sqlp:"coordinates,promote"`
}

func (r Route) GetGrade() *Grade {
	if r.Grade == nil && r.GradeRaw != "" {
		grade, err := ParseGrade(r.GradeRaw)
		if err != nil { // we expect data validity -- can run scripts ad hoc if data gets corrupted
			return nil
		}
		r.Grade = &grade
	}
	return r.Grade
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

////////////////////////////////////////////////////////////////////////////////

func (r Route) MarshalJSON() ([]byte, error) {
	// ensure grade is parsed for serialization
	type Alias Route
	alias := Alias(r)
	alias.Grade = r.GetGrade()
	return json.Marshal(alias)
}

func (r *Route) UnmarshalJSON(data []byte) error {
	type Alias Route
	alias := (*Alias)(r)
	if err := json.Unmarshal(data, &alias); err != nil {
		return err
	}
	alias.Grade = r.GetGrade()
	return nil
}
