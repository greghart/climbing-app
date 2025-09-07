package db

import "github.com/greghart/powerputtygo/sqlp"

// Convenience struct to hold all our repositories
type Repos struct {
	Boulders           *Boulders
	Comments           *Comments
	Commentables       *Commentables
	Crags              *Crags
	Trails             *Trails
	Areas              *Areas
	TrailLines         *TrailLines
	Polygons           *Polygons
	PolygonCoordinates *PolygonCoordinates
	Routes             *Routes
}

func NewRepos(db *sqlp.DB) *Repos {
	return &Repos{
		Boulders:           NewBoulders(db),
		Comments:           NewComments(db),
		Commentables:       NewCommentables(db),
		Crags:              NewCrags(db),
		Areas:              NewAreas(db),
		Trails:             NewTrails(db),
		TrailLines:         NewTrailLines(db),
		Polygons:           NewPolygons(db),
		PolygonCoordinates: NewPolygonCoordinates(db),
		Routes:             NewRoutes(db),
	}
}
