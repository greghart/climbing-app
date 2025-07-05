package models

import (
	"time"

	"github.com/greghart/powerputtygo/sqlp"
)

type Timestamps struct {
	CreatedAt time.Time `json:"createdAt" sqlp:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt" sqlp:"updatedAt"`
}

func (t Timestamps) IsZero() bool {
	return t.CreatedAt.IsZero() &&
		t.UpdatedAt.IsZero()
}

var TimestampsMapper = sqlp.Mapper[Timestamps]{
	"createdAt": func(t *Timestamps) any { return &t.CreatedAt },
	"updatedAt": func(t *Timestamps) any { return &t.UpdatedAt },
}
