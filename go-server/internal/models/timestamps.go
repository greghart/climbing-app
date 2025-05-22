package models

type Timestamps struct {
	CreatedAt string `json:"createdAt"`
	UpdatedAt string `json:"updatedAt"`
}

func (t Timestamps) IsZero() bool {
	return t.CreatedAt == "" && t.UpdatedAt == ""
}
