package service

import (
	"fmt"

	"github.com/greghart/powerputtygo/servicep"
)

// ValidateIncludes checks if any provided includes are not allowed by the schema.
func ValidateIncludes(schema *servicep.IncludeSchema, includes []string) error {
	for _, include := range includes {
		if !schema.IsAllowed(include) {
			return fmt.Errorf("include '%s' is not allowed by schema", include)
		}
	}
	return nil
}
