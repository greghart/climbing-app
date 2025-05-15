package models

type Grade struct {
	ID     *int    `json:"id,omitzero"`
	Raw    string  `json:"raw"`
	System string  `json:"system"`
	Value  float64 `json:"value"`
}

func (g Grade) IsZero() bool {
	return g.ID == nil && g.Raw == "" && g.System == "" && g.Value == 0
}
