package models

import (
	"fmt"
	"strconv"
	"strings"
)

type Grade struct {
	Raw    string        `json:"raw" sqlp:"raw"`
	System GradingSystem `json:"system" sqlp:"system"`
	Value  float64       `json:"value" sqlp:"value"`
}

func ParseGrade(raw string) (Grade, error) {
	if len(raw) == 0 {
		return Grade{}, nil
	}
	if raw[0] == 'V' {
		return parseV(raw)
	}
	if strings.HasPrefix(raw, "5.") || raw[0] == '.' {
		return parseYDS(raw)
	}
	return Grade{}, fmt.Errorf("unknown grade system for: %q", raw)
}

func (g Grade) IsZero() bool {
	return g.Raw == "" && g.System == "" && g.Value == 0
}

////////////////////////////////////////////////////////////////////////////////

type GradingSystem string

const (
	V   GradingSystem = "V"
	YDS GradingSystem = "YDS"
)

var vGradeValues = map[string]float64{
	"VB":  0,
	"V0":  10,
	"V1":  20,
	"V2":  30,
	"V3":  40,
	"V4":  50,
	"V5":  60,
	"V6":  70,
	"V7":  80,
	"V8":  90,
	"V9":  100,
	"V10": 110,
	"V11": 120,
	"V12": 130,
	"V13": 140,
	"V14": 150,
	"V15": 160,
	"V16": 170,
	"V17": 180,
}

var ydsGradeValues = map[string]float64{
	"5.1":   -6,
	"5.2":   -5,
	"5.3":   -4,
	"5.4":   -3,
	"5.5":   -2,
	"5.6":   -1,
	"5.7":   vGradeValues["VB"],
	"5.8":   vGradeValues["V0"] - 1,
	"5.9":   vGradeValues["V0"],
	"5.10":  vGradeValues["V0"] + 1,
	"5.10a": vGradeValues["V0"] + 1,
	"5.10b": vGradeValues["V0"] + 2,
	"5.10c": vGradeValues["V1"],
	"5.10d": (vGradeValues["V1"] + vGradeValues["V2"]) / 2,
	"5.11":  vGradeValues["V2"],
	"5.11a": vGradeValues["V2"],
	"5.11b": vGradeValues["V2"] + 1,
	"5.11c": vGradeValues["V3"],
	"5.11d": vGradeValues["V3"] + 1,
	"5.12":  vGradeValues["V4"],
	"5.12a": vGradeValues["V4"],
	"5.12b": vGradeValues["V5"],
	"5.12c": vGradeValues["V6"],
	"5.12d": vGradeValues["V7"],
	"5.13":  vGradeValues["V8"],
	"5.13a": vGradeValues["V8"],
	"5.13b": vGradeValues["V8"] + 1,
	"5.13c": vGradeValues["V9"],
	"5.13d": vGradeValues["V10"],
	"5.14":  vGradeValues["V11"],
	"5.14a": vGradeValues["V11"],
	"5.14b": vGradeValues["V12"],
	"5.14c": vGradeValues["V13"],
	"5.14d": vGradeValues["V14"],
	"5.15":  vGradeValues["V15"],
	"5.15a": vGradeValues["V15"],
	"5.15b": vGradeValues["V16"],
	"5.15c": vGradeValues["V17"],
}

func parseV(raw string) (Grade, error) {
	return splitter(raw, V, parseVScore)
}

func parseYDS(raw string) (Grade, error) {
	return splitter(raw, YDS, parseYDSScore)
}

var splitters = []string{"/", "-"}

// splitter supports going between two valid grades
// Useful for grades like "V5/V6" or "5.10a-5.10b"
func splitter(raw string, system GradingSystem, scorer func(string) (float64, error)) (Grade, error) {
	// try splitter forms
	for _, s := range splitters {
		grade1, grade2, ok := strings.Cut(raw, s)
		if !ok || grade1 == "" || grade2 == "" {
			continue
		}
		if grade2 == "" {
			continue
		}
		score1, err := scorer(grade1)
		if err != nil {
			continue
		}
		score2, err := scorer(grade2)
		if err != nil {
			// Try again, with second component replacing last
			// Eg. 5.11a/b -> 5.11b
			grade := fmt.Sprintf("%s%s",
				grade1[:len(grade1)-len(grade2)],
				grade2,
			)
			score2, err = scorer(grade)
			if err != nil {
				continue
			}
		}
		return Grade{
			Raw:    raw,
			System: system,
			Value:  (score1 + score2) / 2,
		}, nil
	}
	value, err := scorer(raw)
	if err != nil {
		return Grade{}, err
	}
	return Grade{
		Raw:    raw,
		System: system,
		Value:  value,
	}, nil
}

func parseVScore(raw string) (float64, error) {
	if val, ok := vGradeValues[raw]; ok {
		return val, nil
	}
	// Handle +-
	if strings.HasSuffix(raw, "+") {
		base := strings.TrimSuffix(raw, "+")
		if val, ok := vGradeValues[base]; ok {
			return val + 1, nil
		}
	}
	if strings.HasSuffix(raw, "-") {
		base := strings.TrimSuffix(raw, "-")
		if val, ok := vGradeValues[base]; ok {
			return val - 1, nil
		}
	}
	// Handle V-Int from splitter
	if _, err := strconv.Atoi(raw); err == nil {
		vGrade := "V" + raw
		if val, ok := vGradeValues[vGrade]; ok {
			return val, nil
		}
	}
	return 0, fmt.Errorf("unknown V grade: %q", raw)
}

func parseYDSScore(raw string) (float64, error) {
	if val, ok := ydsGradeValues[raw]; ok {
		return val, nil
	}
	if strings.HasPrefix(raw, ".") {
		lookup := "5" + raw
		if val, ok := ydsGradeValues[lookup]; ok {
			return val, nil
		}
	}
	// Handle YDS from splitter where "5." is omitted
	if len(raw) > 0 {
		if _, err := strconv.Atoi(string(raw[0])); err == nil {
			lookup := "5." + raw
			if val, ok := ydsGradeValues[lookup]; ok {
				return val, nil
			}
		}
	}
	return 0, fmt.Errorf("unknown YDS grade: %q", raw)
}
