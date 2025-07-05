package models

import "github.com/greghart/powerputtygo/sqlp"

type Commentable struct {
	ID         int64     `json:"id,omitzero" sqlp:"id"`
	Descriptor string    `json:"descriptor" sqlp:"descriptor"`
	Comments   []Comment `json:"comments,omitzero" sqlp:"comments"`
}

func (c Commentable) IsZero() bool {
	return c.ID == 0 && c.Descriptor == "" && len(c.Comments) == 0
}

var CommentableMapper = sqlp.Mapper[Commentable]{
	"id":         func(c *Commentable) any { return &c.ID },
	"descriptor": func(c *Commentable) any { return &c.Descriptor },
}
