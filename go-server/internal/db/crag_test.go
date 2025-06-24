package db

import (
	"context"
	"encoding/json"
	"slices"
	"strings"
	"testing"

	"github.com/google/go-cmp/cmp"
	"github.com/google/go-cmp/cmp/cmpopts"
	"github.com/greghart/climbing-app/internal/models"
	"github.com/greghart/climbing-app/internal/testutil"
	"github.com/greghart/powerputtygo/errcmp"
	"github.com/greghart/powerputtygo/sqlp"
)

// Permutations of include flags for CragsReadRequest
var cragsReadPermutations = []struct {
	name  string
	input CragsReadRequest
}{
	{"basic", CragsReadRequest{}},
	{"with areas", CragsReadRequest{Include: CragsIncludeSchema.Include("areas")}},
	{"with boulders", CragsReadRequest{Include: CragsIncludeSchema.Include("areas.boulders")}},
	{"with parking", CragsReadRequest{Include: CragsIncludeSchema.Include("parking")}},
	{"areas+boulders", CragsReadRequest{Include: CragsIncludeSchema.Include("boulder")}}, // won't fetch
	{"areas+parking", CragsReadRequest{Include: CragsIncludeSchema.Include("areas", "parking")}},
	{"areas+polygon", CragsReadRequest{Include: CragsIncludeSchema.Include("areas.polygon.coordinates")}},
	{"all", CragsReadRequest{Include: CragsIncludeSchema.Include("areas.boulders", "parking")}},
}

// Ignore timestamps since those are
var cmpOpts = cmp.Options{
	cmpopts.EquateEmpty(),
	cmp.FilterPath(
		func(p cmp.Path) bool {
			return strings.Contains(p.String(), "UpdatedAt") || strings.Contains(p.String(), "CreatedAt")
		},
		cmp.Ignore(),
	),
}

func TestCrags_GetCrags(t *testing.T) {
	db, ctx, cancel := testDB(t)
	defer cancel()

	areas := NewAreas(db)
	cragsRepo := NewCrags(db, nil, areas)
	loadCrags(t, ctx, db)

	for _, perm := range cragsReadPermutations {
		t.Run(perm.name, func(t *testing.T) {
			_crags, err := cragsRepo.GetCrags(ctx, perm.input)
			errcmp.MustMatch(t, err, "")
			crags := make([]models.Crag, len(_crags))
			for i := range _crags {
				adapted, err := normalizeCrag(&_crags[i], nil)
				errcmp.MustMatch(t, err, "", "failed to normalize crag")
				crags[i] = *adapted
			}

			slices.SortFunc(crags, func(a, b models.Crag) int {
				return int(a.ID - b.ID)
			})

			expected := []*models.Crag{
				testutil.LoadCragFromJSON(t, "testdata/santee.json"),
				testutil.LoadCragFromJSON(t, "testdata/empty.json"),
			}

			for i, got := range crags {
				want := expectedCragForInclude(*expected[i], perm.input)
				if !cmp.Equal(got, want, cmpOpts) {
					t.Errorf("crag mismatch (-got +want):\n%s", cmp.Diff(got, want, cmpOpts))
				}
			}
		})
	}
}

func TestCrags_GetCrag(t *testing.T) {
	db, ctx, cancel := testDB(t)
	defer cancel()
	loadCrags(t, ctx, db)

	areas := NewAreas(db)
	cragsRepo := NewCrags(db, nil, areas)
	for _, perm := range cragsReadPermutations {
		t.Run(perm.name, func(t *testing.T) {
			expected := testutil.LoadCragFromJSON(t, "testdata/santee.json")
			input := perm.input
			input.ID = 55
			crag, err := normalizeCrag(cragsRepo.GetCrag(ctx, input))
			errcmp.MustMatch(t, err, "")

			want := expectedCragForInclude(*expected, perm.input)

			if !cmp.Equal(*crag, want, cmpOpts) {
				t.Errorf("crag mismatch (-got +want):\n%s", cmp.Diff(*crag, want, cmpOpts))
			}
		})
	}
}

////////////////////////////////////////////////////////////////////////////////

// helper to load crag fixtures into DB
func loadCrags(t *testing.T, ctx context.Context, db *DB) {
	t.Helper()

	santee := testutil.LoadCragFromJSON(t, "testdata/santee.json")
	_, err := sqlp.Insert(ctx, db.DB, "crag", *santee)
	errcmp.MustMatch(t, err, "", "failed to insert crag")
	for _, a := range santee.Areas {
		a.CragID = santee.ID
		a.PolygonID = &a.Polygon.ID
		_, err := sqlp.Insert(ctx, db.DB, "area", a)
		errcmp.MustMatch(t, err, "", "failed to insert area")

		// Insert area polygon if present
		if a.Polygon != nil {
			_, err := sqlp.Insert(ctx, db.DB, "polygon", *a.Polygon)
			errcmp.MustMatch(t, err, "", "failed to insert area polygon")
			// Insert polygon coordinates if present
			for i, pc := range a.Polygon.Coordinates {
				pc.PolygonID = a.Polygon.ID
				pc.Order = i + 1 // Order starts at 1
				_, err := sqlp.Insert(ctx, db.DB, "polygon_coordinate", pc)
				errcmp.MustMatch(t, err, "", "failed to insert polygon coordinate")
			}
		}

		for _, b := range a.Boulders {
			b.AreaID = a.ID
			_, err := sqlp.Insert(ctx, db.DB, "boulder", b)
			errcmp.MustMatch(t, err, "", "failed to insert boulder")
		}
	}
	if santee.Parking != nil {
		santee.Parking.CragID = santee.ID
		_, err := sqlp.Insert(ctx, db.DB, "parking", *santee.Parking)
		errcmp.MustMatch(t, err, "", "failed to insert parking")
	}

	empty := testutil.LoadCragFromJSON(t, "testdata/empty.json")
	_, err = sqlp.Insert(ctx, db.DB, "crag", *empty)
	errcmp.MustMatch(t, err, "", "failed to insert empty crag")
}

// normalizeCrag to make it easier to compare between our fixture JSON and direct db results.
// Direct DB includes things like bi-directional foreign keys and `order` fields that aren't leaked
// to user -- since santee.json is user-land, we want to adapt to that here.
func normalizeCrag(c *models.Crag, err error) (*models.Crag, error) {
	if err != nil {
		return nil, err
	}

	jsData, err := json.Marshal(c)
	if err != nil {
		return nil, err
	}

	var adapted models.Crag
	err = json.Unmarshal(jsData, &adapted)
	if err != nil {
		return nil, err
	}
	return &adapted, nil
}

// helper to produce the expected crag for a given include request
func expectedCragForInclude(crag models.Crag, req CragsReadRequest) models.Crag {
	if !req.Include.IsIncluded("areas") {
		crag.Areas = nil
	}
	if !req.Include.IsIncluded("parking") {
		crag.Parking = nil
	}
	if req.Include.IsIncluded("areas") && !req.Include.IsIncluded("areas.boulders") {
		crag.Areas = crag.Areas[:]
		for i := range crag.Areas {
			crag.Areas[i].Boulders = nil
		}
	}
	if req.Include.IsIncluded("areas") && !req.Include.IsIncluded("areas.polygon") {
		crag.Areas = crag.Areas[:]
		for i := range crag.Areas {
			crag.Areas[i].Polygon = nil
		}
	}
	return crag
}
