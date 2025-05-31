package models

type Commentable struct {
	ID         *int64    `json:"id,omitzero" sqlp:"id"`
	Descriptor string    `json:"descriptor" sqlp:"descriptor"`
	Comments   []Comment `json:"comments,omitzero" sqlp:"comments"`
}

func (c Commentable) IsZero() bool {
	return c.ID == nil && c.Descriptor == "" && len(c.Comments) == 0
}
