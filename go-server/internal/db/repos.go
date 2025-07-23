package db

import "github.com/greghart/powerputtygo/sqlp"

// Convenience struct to hold all our repositories
type Repos struct {
	Crags              *Crags
	Trails             *Trails
	Areas              *Areas
	TrailLines         *TrailLines
	Polygons           *Polygons
	PolygonCoordinates *PolygonCoordinates
}

func NewRepos(db *sqlp.DB) *Repos {
	return &Repos{
		Crags:              NewCrags(db),
		Areas:              NewAreas(db),
		Trails:             NewTrails(db),
		TrailLines:         NewTrailLines(db),
		Polygons:           NewPolygons(db),
		PolygonCoordinates: NewPolygonCoordinates(db),
	}
}
