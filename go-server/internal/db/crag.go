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
	query := `SELECT * FROM crag`
	return c.Select(ctx, query)
}

// GetCrag retries a single crag by its ID, including its associated areas.
// Good example of advanced usage, joins and scanning with sqlp.
func (c *Crags) GetCrag(ctx context.Context, id int) (*models.Crag, error) {
	query := `
		SELECT 
			crag.*,
			area.id AS area_id,
			COALESCE(area.name, "") AS area_name,
			COALESCE(area.description, "") AS area_description
		FROM crag
		LEFT JOIN area ON area.cragId = crag.id
		WHERE crag.id = ?
	`
	rows, err := c.Query(ctx, query, id)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	type cragRow struct {
		models.Crag
		Area models.Area `sqlp:"area"`
	}

	scanner, err := sqlp.NewReflectScanner[cragRow](rows)
	if err != nil {
		return nil, fmt.Errorf("failed to reflect crag scanner: %w", err)
	}

	crag := models.Crag{}
	for i := 0; rows.Next(); i++ {
		row, err := scanner.Scan()
		if err != nil {
			return nil, fmt.Errorf("failed to scan row: %w", err)
		}
		if i == 0 {
			crag = row.Crag
		}
		if row.Area.ID != nil {
			crag.Areas = append(crag.Areas, row.Area)
		}
	}
	if crag.ID == 0 {
		return nil, nil
	}

	return &crag, nil
}
