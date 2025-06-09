package models

type Grade struct {
	Raw    string        `json:"raw" sqlp:"raw"`
	System GradingSystem `json:"system" sqlp:"system"`
	Value  float64       `json:"value" sqlp:"value"`
}

func (g Grade) IsZero() bool {
	return g.Raw == "" && g.System == "" && g.Value == 0
}

////////////////////////////////////////////////////////////////////////////////

type GradingSystem string
