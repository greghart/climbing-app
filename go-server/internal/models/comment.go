package models

type Comment struct {
	ID            int64        `json:"id,omitzero" sqlp:"id,readonly"`
	Text          string       `json:"text" sqlp:"text"`
	Commentable   *Commentable `json:"commentable" sqlp:"commentable"`
	CommentableID *int64       `json:"-" sqlp:"commentableId"`
	Timestamps
}

func (c Comment) IsZero() bool {
	return c.ID == 0 && c.Text == "" && c.Commentable == nil
}
