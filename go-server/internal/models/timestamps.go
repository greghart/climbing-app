package models

import "time"

type Timestamps struct {
	CreatedAt time.Time `json:"createdAt" sqlp:"created_at"`
	UpdatedAt time.Time `json:"updatedAt" sqlp:"updated_at"`
}

func (t Timestamps) IsZero() bool {
	return t.CreatedAt.IsZero() &&
		t.UpdatedAt.IsZero()
}
