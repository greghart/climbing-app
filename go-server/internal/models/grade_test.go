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
		{raw: "5.1", expected: Grade{Raw: "5.1", System: YDS, Value: -6}},
		{raw: "5.2", expected: Grade{Raw: "5.2", System: YDS, Value: -5}},
		{raw: "5.3", expected: Grade{Raw: "5.3", System: YDS, Value: -4}},
		{raw: "5.4", expected: Grade{Raw: "5.4", System: YDS, Value: -3}},
		{raw: "5.5", expected: Grade{Raw: "5.5", System: YDS, Value: -2}},
		{raw: "5.6", expected: Grade{Raw: "5.6", System: YDS, Value: -1}},
		{raw: "5.7", expected: Grade{Raw: "5.7", System: YDS, Value: 0}},
		{raw: "5.8", expected: Grade{Raw: "5.8", System: YDS, Value: 9}},
		{raw: "5.9", expected: Grade{Raw: "5.9", System: YDS, Value: 10}},
		{raw: "5.10a", expected: Grade{Raw: "5.10a", System: YDS, Value: 11}},
		{raw: "5.10b", expected: Grade{Raw: "5.10b", System: YDS, Value: 12}},
		{raw: "5.10c", expected: Grade{Raw: "5.10c", System: YDS, Value: 20}},
		{raw: "5.10d", expected: Grade{Raw: "5.10d", System: YDS, Value: 25}},
		{raw: "5.11a", expected: Grade{Raw: "5.11a", System: YDS, Value: 30}},
		{raw: "5.11b", expected: Grade{Raw: "5.11b", System: YDS, Value: 31}},
		{raw: "5.11c", expected: Grade{Raw: "5.11c", System: YDS, Value: 40}},
		{raw: "5.11d", expected: Grade{Raw: "5.11d", System: YDS, Value: 41}},
		{raw: "5.12a", expected: Grade{Raw: "5.12a", System: YDS, Value: 50}},
		{raw: "5.12b", expected: Grade{Raw: "5.12b", System: YDS, Value: 60}},
		{raw: "5.12c", expected: Grade{Raw: "5.12c", System: YDS, Value: 70}},
		{raw: "5.12d", expected: Grade{Raw: "5.12d", System: YDS, Value: 80}},
		{raw: "5.13a", expected: Grade{Raw: "5.13a", System: YDS, Value: 90}},
		{raw: "5.13b", expected: Grade{Raw: "5.13b", System: YDS, Value: 91}},
		{raw: "5.13c", expected: Grade{Raw: "5.13c", System: YDS, Value: 100}},
		{raw: "5.13d", expected: Grade{Raw: "5.13d", System: YDS, Value: 110}},
		{raw: "5.14a", expected: Grade{Raw: "5.14a", System: YDS, Value: 120}},
		{raw: "5.14b", expected: Grade{Raw: "5.14b", System: YDS, Value: 130}},
		{raw: "5.14c", expected: Grade{Raw: "5.14c", System: YDS, Value: 140}},
		{raw: "5.14d", expected: Grade{Raw: "5.14d", System: YDS, Value: 150}},
		{raw: "5.15a", expected: Grade{Raw: "5.15a", System: YDS, Value: 160}},
		{raw: "5.15b", expected: Grade{Raw: "5.15b", System: YDS, Value: 170}},
		{raw: "5.15c", expected: Grade{Raw: "5.15c", System: YDS, Value: 180}},
		{raw: ".7", expected: Grade{Raw: ".7", System: YDS, Value: 0}},

		// YDS ranges
		{raw: "5.12b/5.12c", expected: Grade{Raw: "5.12b/5.12c", System: YDS, Value: 65}},
		{raw: "5.12b/12c", expected: Grade{Raw: "5.12b/12c", System: YDS, Value: 65}},
		{raw: "5.12b/c", expected: Grade{Raw: "5.12b/c", System: YDS, Value: 65}},

		// V Scale tests
		{raw: "VB", expected: Grade{Raw: "VB", System: V, Value: 0}},
		{raw: "V0", expected: Grade{Raw: "V0", System: V, Value: 10}},
		{raw: "V1", expected: Grade{Raw: "V1", System: V, Value: 20}},
		{raw: "V2", expected: Grade{Raw: "V2", System: V, Value: 30}},
		{raw: "V3", expected: Grade{Raw: "V3", System: V, Value: 40}},
		{raw: "V4", expected: Grade{Raw: "V4", System: V, Value: 50}},
		{raw: "V5", expected: Grade{Raw: "V5", System: V, Value: 60}},
		{raw: "V6", expected: Grade{Raw: "V6", System: V, Value: 70}},
		{raw: "V7", expected: Grade{Raw: "V7", System: V, Value: 80}},
		{raw: "V8", expected: Grade{Raw: "V8", System: V, Value: 90}},
		{raw: "V9", expected: Grade{Raw: "V9", System: V, Value: 100}},
		{raw: "V10", expected: Grade{Raw: "V10", System: V, Value: 110}},
		{raw: "V11", expected: Grade{Raw: "V11", System: V, Value: 120}},
		{raw: "V12", expected: Grade{Raw: "V12", System: V, Value: 130}},
		{raw: "V13", expected: Grade{Raw: "V13", System: V, Value: 140}},
		{raw: "V14", expected: Grade{Raw: "V14", System: V, Value: 150}},
		{raw: "V15", expected: Grade{Raw: "V15", System: V, Value: 160}},
		{raw: "V16", expected: Grade{Raw: "V16", System: V, Value: 170}},
		{raw: "V17", expected: Grade{Raw: "V17", System: V, Value: 180}},

		// V +/-
		{raw: "VB-", expected: Grade{Raw: "VB-", System: V, Value: -1}},
		{raw: "VB+", expected: Grade{Raw: "VB+", System: V, Value: 1}},

		// V ranges
		{raw: "VB/V0-", expected: Grade{Raw: "VB/V0-", System: V, Value: 4.5}},
		{raw: "VB/V0", expected: Grade{Raw: "VB/V0", System: V, Value: 5}},
		{raw: "VB/0", expected: Grade{Raw: "VB/0", System: V, Value: 5}},
		{raw: "VB/V1", expected: Grade{Raw: "VB/V1", System: V, Value: 10}},

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
