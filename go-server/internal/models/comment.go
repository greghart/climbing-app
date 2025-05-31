package models

type Comment struct {
	ID          *int64       `json:"id,omitzero" sqlp:"id"`
	Text        string       `json:"text" sqlp:"text"`
	Commentable *Commentable `json:"commentable" sqlp:"commentable"`
	Timestamps
}

func (c Comment) IsZero() bool {
	return c.ID == nil && c.Text == "" && c.Commentable == nil
}
