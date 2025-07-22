package models

import "time"

type Timestamps struct {
	CreatedAt time.Time `json:"createdAt" sqlp:"createdAt,readonly"`
	UpdatedAt time.Time `json:"updatedAt" sqlp:"updatedAt"`
}

func (t Timestamps) IsZero() bool {
	return t.CreatedAt.IsZero() &&
		t.UpdatedAt.IsZero()
}
