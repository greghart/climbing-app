package service

import "github.com/greghart/climbing-app/internal/db"

// Convenience struct to hold all our services
type Services struct {
	repos    *db.Repos
	Crags    *Crags
	Trails   *Trails
	Areas    *Areas
	Polygons *Polygons
	Comments *Comments
}

func NewServices(repos *db.Repos) *Services {
	s := &Services{
		repos: repos,
	}
	s.Crags = NewCrags(s)
	s.Trails = NewTrails(s)
	s.Areas = NewAreas(s)
	s.Polygons = NewPolygons(s)
	s.Comments = NewComments(s)
	return s
}
