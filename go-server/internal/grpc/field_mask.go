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

// MaskPtr returns a pointer to a provided value if the field is in the mask.
// Useful when wanting to convert a scalar protobuf type to a pointer in domain layer, eg. using
// a mask to distinguish between a field being set to its zero value (eg. 0 for int) and not being
// set at all.
func MaskPtr[T any](mask *FieldMask, field string, value T) *T {
	if !mask.In(field) {
		return nil
	}
	return &value
}

// MaskValue returns the provided value if the field is in the mask, otherwise returns a zero value.
// Useful for protobuf messages since those already come in as pointers not converting data type between protobuf and domain layer.
func MaskValue[T any](mask *FieldMask, field string, value T) T {
	if !mask.In(field) {
		var zero T
		return zero
	}
	return value
}
