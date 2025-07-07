package models

import (
	"fmt"
	"testing"

	"github.com/google/go-cmp/cmp"
	"github.com/greghart/powerputtygo/errcmp"
)

func TestParse(t *testing.T) {
	tests := []struct {
		raw      string
		expected Grade
		err      string
	}{
		{raw: "5.1", expected: Grade{Raw: "5.1", System: GradingSystemYDS, Value: -6}},
		{raw: "5.2", expected: Grade{Raw: "5.2", System: GradingSystemYDS, Value: -5}},
		{raw: "5.3", expected: Grade{Raw: "5.3", System: GradingSystemYDS, Value: -4}},
		{raw: "5.4", expected: Grade{Raw: "5.4", System: GradingSystemYDS, Value: -3}},
		{raw: "5.5", expected: Grade{Raw: "5.5", System: GradingSystemYDS, Value: -2}},
		{raw: "5.6", expected: Grade{Raw: "5.6", System: GradingSystemYDS, Value: -1}},
		{raw: "5.7", expected: Grade{Raw: "5.7", System: GradingSystemYDS, Value: 0}},
		{raw: "5.8", expected: Grade{Raw: "5.8", System: GradingSystemYDS, Value: 9}},
		{raw: "5.9", expected: Grade{Raw: "5.9", System: GradingSystemYDS, Value: 10}},
		{raw: "5.10a", expected: Grade{Raw: "5.10a", System: GradingSystemYDS, Value: 11}},
		{raw: "5.10b", expected: Grade{Raw: "5.10b", System: GradingSystemYDS, Value: 12}},
		{raw: "5.10c", expected: Grade{Raw: "5.10c", System: GradingSystemYDS, Value: 20}},
		{raw: "5.10d", expected: Grade{Raw: "5.10d", System: GradingSystemYDS, Value: 25}},
		{raw: "5.11a", expected: Grade{Raw: "5.11a", System: GradingSystemYDS, Value: 30}},
		{raw: "5.11b", expected: Grade{Raw: "5.11b", System: GradingSystemYDS, Value: 31}},
		{raw: "5.11c", expected: Grade{Raw: "5.11c", System: GradingSystemYDS, Value: 40}},
		{raw: "5.11d", expected: Grade{Raw: "5.11d", System: GradingSystemYDS, Value: 41}},
		{raw: "5.12a", expected: Grade{Raw: "5.12a", System: GradingSystemYDS, Value: 50}},
		{raw: "5.12b", expected: Grade{Raw: "5.12b", System: GradingSystemYDS, Value: 60}},
		{raw: "5.12c", expected: Grade{Raw: "5.12c", System: GradingSystemYDS, Value: 70}},
		{raw: "5.12d", expected: Grade{Raw: "5.12d", System: GradingSystemYDS, Value: 80}},
		{raw: "5.13a", expected: Grade{Raw: "5.13a", System: GradingSystemYDS, Value: 90}},
		{raw: "5.13b", expected: Grade{Raw: "5.13b", System: GradingSystemYDS, Value: 91}},
		{raw: "5.13c", expected: Grade{Raw: "5.13c", System: GradingSystemYDS, Value: 100}},
		{raw: "5.13d", expected: Grade{Raw: "5.13d", System: GradingSystemYDS, Value: 110}},
		{raw: "5.14a", expected: Grade{Raw: "5.14a", System: GradingSystemYDS, Value: 120}},
		{raw: "5.14b", expected: Grade{Raw: "5.14b", System: GradingSystemYDS, Value: 130}},
		{raw: "5.14c", expected: Grade{Raw: "5.14c", System: GradingSystemYDS, Value: 140}},
		{raw: "5.14d", expected: Grade{Raw: "5.14d", System: GradingSystemYDS, Value: 150}},
		{raw: "5.15a", expected: Grade{Raw: "5.15a", System: GradingSystemYDS, Value: 160}},
		{raw: "5.15b", expected: Grade{Raw: "5.15b", System: GradingSystemYDS, Value: 170}},
		{raw: "5.15c", expected: Grade{Raw: "5.15c", System: GradingSystemYDS, Value: 180}},
		{raw: ".7", expected: Grade{Raw: ".7", System: GradingSystemYDS, Value: 0}},

		// YDS ranges
		{raw: "5.12b/5.12c", expected: Grade{Raw: "5.12b/5.12c", System: GradingSystemYDS, Value: 65}},
		{raw: "5.12b/12c", expected: Grade{Raw: "5.12b/12c", System: GradingSystemYDS, Value: 65}},
		{raw: "5.12b/c", expected: Grade{Raw: "5.12b/c", System: GradingSystemYDS, Value: 65}},

		// V Scale tests
		{raw: "VB", expected: Grade{Raw: "VB", System: GradingSystemV, Value: 0}},
		{raw: "V0", expected: Grade{Raw: "V0", System: GradingSystemV, Value: 10}},
		{raw: "V1", expected: Grade{Raw: "V1", System: GradingSystemV, Value: 20}},
		{raw: "V2", expected: Grade{Raw: "V2", System: GradingSystemV, Value: 30}},
		{raw: "V3", expected: Grade{Raw: "V3", System: GradingSystemV, Value: 40}},
		{raw: "V4", expected: Grade{Raw: "V4", System: GradingSystemV, Value: 50}},
		{raw: "V5", expected: Grade{Raw: "V5", System: GradingSystemV, Value: 60}},
		{raw: "V6", expected: Grade{Raw: "V6", System: GradingSystemV, Value: 70}},
		{raw: "V7", expected: Grade{Raw: "V7", System: GradingSystemV, Value: 80}},
		{raw: "V8", expected: Grade{Raw: "V8", System: GradingSystemV, Value: 90}},
		{raw: "V9", expected: Grade{Raw: "V9", System: GradingSystemV, Value: 100}},
		{raw: "V10", expected: Grade{Raw: "V10", System: GradingSystemV, Value: 110}},
		{raw: "V11", expected: Grade{Raw: "V11", System: GradingSystemV, Value: 120}},
		{raw: "V12", expected: Grade{Raw: "V12", System: GradingSystemV, Value: 130}},
		{raw: "V13", expected: Grade{Raw: "V13", System: GradingSystemV, Value: 140}},
		{raw: "V14", expected: Grade{Raw: "V14", System: GradingSystemV, Value: 150}},
		{raw: "V15", expected: Grade{Raw: "V15", System: GradingSystemV, Value: 160}},
		{raw: "V16", expected: Grade{Raw: "V16", System: GradingSystemV, Value: 170}},
		{raw: "V17", expected: Grade{Raw: "V17", System: GradingSystemV, Value: 180}},

		// V +/-
		{raw: "VB-", expected: Grade{Raw: "VB-", System: GradingSystemV, Value: -1}},
		{raw: "VB+", expected: Grade{Raw: "VB+", System: GradingSystemV, Value: 1}},

		// V ranges
		{raw: "VB/V0-", expected: Grade{Raw: "VB/V0-", System: GradingSystemV, Value: 4.5}},
		{raw: "VB/V0", expected: Grade{Raw: "VB/V0", System: GradingSystemV, Value: 5}},
		{raw: "VB/0", expected: Grade{Raw: "VB/0", System: GradingSystemV, Value: 5}},
		{raw: "VB/V1", expected: Grade{Raw: "VB/V1", System: GradingSystemV, Value: 10}},

		// Invalid scores
		{raw: "", expected: Grade{}},
		{raw: "garbage", err: `unknown grade system for: "garbage"`},
		{raw: "V", err: `unknown V grade: "V"`},
		{raw: "V-1", err: `unknown V grade: "V-1"`},
		{raw: "V18", err: `unknown V grade: "V18"`},
	}

	for _, tc := range tests {
		t.Run(fmt.Sprintf("Raw \"%s\"", tc.raw), func(t *testing.T) {
			got, err := ParseGrade(tc.raw)
			errcmp.MustMatch(t, err, tc.err)
			if diff := cmp.Diff(tc.expected, got); diff != "" {
				t.Errorf("Parse(%q) mismatch (-expected +got):\n%s", tc.raw, diff)
			}
		})
	}
}
