package models

type Commentable struct {
	ID         *int      `json:"id,omitzero"`
	Descriptor string    `json:"descriptor"`
	Comments   []Comment `json:"comments,omitzero"`
}

func (c Commentable) IsZero() bool {
	return c.ID == nil && c.Descriptor == "" && len(c.Comments) == 0
}
