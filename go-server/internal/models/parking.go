package models

import "github.com/greghart/powerputtygo/sqlp"

type Parking struct {
	ID          int64      `json:"id,omitzero" sqlp:"id"`
	Name        *string    `json:"name,omitzero" sqlp:"name"`
	Description *string    `json:"description,omitzero" sqlp:"description"`
	Location    Coordinate `json:"location" sqlp:"location,promote"`
	CragID      int64      `json:"crag_id,omitzero" sqlp:"cragId"`
}

func (p *Parking) IsZero() bool {
	if p == nil {
		return true
	}
	return p.ID == 0 &&
		p.Name == nil &&
		p.Description == nil &&
		p.Location.IsZero() &&
		p.CragID == 0
}

var ParkingMapper = sqlp.Mapper[Parking]{
	"id":           func(p *Parking) any { return &p.ID },
	"name":         func(p *Parking) any { return &p.Name },
	"description":  func(p *Parking) any { return &p.Description },
	"location_Lat": func(p *Parking) any { return &p.Location.Lat },
	"location_Lng": func(p *Parking) any { return &p.Location.Lng },
	"cragId":       func(p *Parking) any { return &p.CragID },
}
