package models

type Grade struct {
	ID     *int64  `json:"id,omitzero" sqlp:"id"`
	Raw    string  `json:"raw" sqlp:"raw"`
	System string  `json:"system" sqlp:"system"`
	Value  float64 `json:"value" sqlp:"value"`
}

func (g Grade) IsZero() bool {
	return g.ID == nil && g.Raw == "" && g.System == "" && g.Value == 0
}
