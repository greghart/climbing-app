package db

import (
	"context"
	"fmt"

	"github.com/greghart/climbing-app/internal/models"
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
			COALESCE(area.description, "") AS area_description,
			boulder.id AS boulder_id,
			boulder.name AS boulder_name,
			COALESCE(boulder.description, "") AS boulder_description,
			boulder.coordinates_Lat AS boulder_coordinates_Lat,
			boulder.coordinates_Lng AS boulder_coordinates_Lng
		FROM crag
		LEFT JOIN area ON area.cragId = crag.id
		LEFT JOIN boulder on boulder.areaId = area.id
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

	crag := models.Crag{}
	pending := models.Area{}
	grabPending := func() {
		if pending.ID != 0 {
			crag.Areas = append(crag.Areas, pending)
		}
	}
	for i := 0; rows.Next(); i++ {
		row, err := scanner.Scan()
		if err != nil {
			return nil, fmt.Errorf("failed to scan row: %w", err)
		}

		if i == 0 { // Crag data is r
			crag = row.Crag
		}
		// New area being scanned
		if row.Area.ID != 0 && row.Area.ID != pending.ID {
			grabPending()
			pending = row.Area
		}
		if row.Boulder.ID != 0 {
			pending.Boulders = append(pending.Boulders, row.Boulder)
		}
	}
	grabPending()
	if crag.ID == 0 {
		return nil, nil
	}

	return &crag, nil
}
