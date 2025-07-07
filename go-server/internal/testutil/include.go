package testutil

import (
	"strings"

	"github.com/greghart/powerputtygo/servicep"
)

// IncludeCombos returns a nice sample of include combinations, useful for testing.
// Includes none, include all associations, and include full paths for each association individually.
func IncludeCombos(schema *servicep.IncludeSchema) [][]string {
	comboMap := map[string]any{"": nil}
	all := []string{}
	for combo := range schema.All() {
		all = append(all, combo)
		components := strings.Split(combo, ".")
		for j := range len(components) {
			comboMap[strings.Join(components[:j+1], ".")] = nil
		}
	}
	combos := make([][]string, 0, len(comboMap)+1) // +1 for the "all" combo
	for k := range comboMap {
		combos = append(combos, []string{k})
	}
	combos = append(combos, all) // add all associations as a single combo
	return combos
}
