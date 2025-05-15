package models

type Comment struct {
	ID          *int         `json:"id,omitzero"`
	Text        string       `json:"text"`
	Commentable *Commentable `json:"commentable"`
	Timestamps
}

func (c Comment) IsZero() bool {
	return c.ID == nil && c.Text == "" && c.Commentable == nil
}
