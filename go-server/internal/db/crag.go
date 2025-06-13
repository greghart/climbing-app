package db

import (
	"context"
	"fmt"

	"github.com/greghart/climbing-app/internal/models"
	"github.com/greghart/powerputtygo/mapperp"
	"github.com/greghart/powerputtygo/sqlp"
)

type Crags struct {
	*sqlp.Repository[models.Crag]
}

func NewCrags(db *sqlp.DB) *Crags {
	return &Crags{
		sqlp.NewRepository[models.Crag](db, "crag"),
	}
}

func (c *Crags) GetCrags(ctx context.Context) ([]models.Crag, error) {
	return c.Select(ctx, "SELECT * FROM crag")
}

// GetCrag retries a single crag by its ID, including its' entire association tree.
// Good example of advanced usage, joins and scanning with sqlp.
func (c *Crags) GetCrag(ctx context.Context, id int) (*models.Crag, error) {
	q := `
		SELECT 
			crag.*,
			area.id AS area_id,
			area.name AS area_name,
			area.description AS area_description,
			boulder.id AS boulder_id,
			boulder.name AS boulder_name,
			boulder.description AS boulder_description,
			boulder.coordinates_Lat AS boulder_coordinates_Lat,
			boulder.coordinates_Lng AS boulder_coordinates_Lng,
			parking.id AS parking_id,
			parking.name AS parking_name,
			parking.description AS parking_description,
			parking.location_Lat AS parking_location_Lat,
			parking.location_Lng AS parking_location_Lng
		FROM crag
		LEFT JOIN area ON area.cragId = crag.id
		LEFT JOIN boulder on boulder.areaId = area.id
		LEFT JOIN parking ON parking.cragId = crag.id
		WHERE crag.id = ?
	`
	rows, err := c.Query(ctx, q, id)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	type cragRow struct {
		models.Crag
		Area    models.Area    `sqlp:"area"`
		Boulder models.Boulder `sqlp:"boulder"`
	}

	scanner, err := sqlp.NewReflectScanner[cragRow](rows)
	if err != nil {
		return nil, fmt.Errorf("failed to reflect crag scanner: %w", err)
	}

	cragMapper := mapperp.One(
		func(row *cragRow) *models.Crag { return &row.Crag },
		// areas
		mapperp.InnerSlice(
			func(e *models.Crag) *[]models.Area { return &e.Areas },
			func(e *models.Area) int64 { return e.ID },
			func(row *cragRow) *models.Area { return &row.Area },
			mapperp.Last(
				// boulders
				mapperp.InnerSlice(
					func(e *models.Area) *[]models.Boulder { return &e.Boulders },
					func(e *models.Boulder) int64 { return e.ID },
					func(row *cragRow) *models.Boulder { return &row.Boulder },
				),
			),
		),
	)

	var crag models.Crag
	for i := 0; rows.Next(); i++ {
		row, err := scanner.Scan()
		if err != nil {
			return nil, fmt.Errorf("failed to scan row: %w", err)
		}
		cragMapper(&crag, &row, i)
	}
	if crag.ID == 0 {
		return nil, nil
	}
	return &crag, nil
}
