package models

// Option represents whether a value has been set or not.
// Useful and built for data loading -- distinguish whether we tried to load the data and it was not
// found, or we didn't try to load it at all.
type Option[E any] struct {
	Loaded bool // If true, we tried to load it
	// Value is the loaded value -- note it can still be nil if data doesn't exist
	Value *E
}

func Some[E any](value *E) Option[E] {
	return Option[E]{Loaded: true, Value: value}
}

func None[E any]() Option[E] {
	return Option[E]{Loaded: false, Value: nil}
}

func (o *Option[E]) IsZero() bool {
	if o == nil {
		return true
	}
	return !o.Loaded || o.Value == nil
}

func (o *Option[E]) Has() bool {
	if o == nil {
		return false
	}
	return o.Loaded && o.Value != nil
}
