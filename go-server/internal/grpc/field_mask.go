package grpc

import "google.golang.org/protobuf/types/known/fieldmaskpb"

// FieldMask wraps the fieldmaskpb.FieldMask to provide additional functionality.
// Nil receivers are allowed and should be treated as an empty or * mask.
type FieldMask struct {
	*fieldmaskpb.FieldMask
	byPath map[string]any
}

func NewFieldMask(fm *fieldmaskpb.FieldMask) *FieldMask {
	if fm == nil {
		return nil
	}

	byPath := make(map[string]any)
	for _, path := range fm.GetPaths() {
		byPath[path] = nil
	}
	return &FieldMask{
		FieldMask: fm,
		byPath:    byPath,
	}
}

// In returns whether given field is in the mask.
func (m *FieldMask) In(field string) bool {
	if m == nil {
		return true
	}
	_, ok := m.byPath[field]
	return ok
}
