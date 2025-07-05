package models

import "github.com/greghart/powerputtygo/sqlp"

type Bounds struct {
	TopLeft     Coordinate `json:"topLeft" sqlp:"topLeft,promote"`
	BottomRight Coordinate `json:"bottomRight" sqlp:"bottomRight,promote"`
}

func (b Bounds) IsZero() bool {
	return b.TopLeft.IsZero() && b.BottomRight.IsZero()
}

var BoundsMapper = func() sqlp.Mapper[Bounds] {
	mapper := sqlp.Mapper[Bounds]{}
	mapper = sqlp.MergeMappers(
		mapper,
		CoordinateMapper,
		"bottomRight",
		func(b *Bounds) *Coordinate { return &b.BottomRight },
	)
	mapper = sqlp.MergeMappers(
		mapper,
		CoordinateMapper,
		"topLeft",
		func(b *Bounds) *Coordinate { return &b.TopLeft },
	)
	return mapper
}()
