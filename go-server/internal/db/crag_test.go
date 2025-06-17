package db

import (
	"context"
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
	{"with areas", CragsReadRequest{IncludeArea: true}},
	{"with boulders", CragsReadRequest{IncludeArea: true, IncludeBoulder: true}},
	{"with parking", CragsReadRequest{IncludeParking: true}},
	{"areas+boulders", CragsReadRequest{IncludeArea: true, IncludeBoulder: true}},
	{"areas+parking", CragsReadRequest{IncludeArea: true, IncludeParking: true}},
	{"boulders+parking", CragsReadRequest{IncludeBoulder: true, IncludeParking: true}},
	{"all", CragsReadRequest{IncludeArea: true, IncludeBoulder: true, IncludeParking: true}},
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
	loadSanteeFixture(t, ctx, db)

	cragsRepo := NewCrags(db)
	for _, perm := range cragsReadPermutations {
		t.Run(perm.name, func(t *testing.T) {
			expected := testutil.LoadCragFromJSON(t, "testdata/santee.json")
			crags, err := cragsRepo.GetCrags(ctx, perm.input)
			errcmp.MustMatch(t, err, "")
			if len(crags) != 1 {
				t.Fatalf("expected 1 crag, got %d", len(crags))
			}
			got := &crags[0]
			want := expectedCragForInclude(expected, perm.input)
			if !cmp.Equal(got, want, cmpOpts) {
				t.Errorf("crag mismatch (-got +want):\n%s", cmp.Diff(got, want, cmpOpts))
			}
		})
	}
}

func TestCrags_GetCrag(t *testing.T) {
	db, ctx, cancel := testDB(t)
	defer cancel()
	loadSanteeFixture(t, ctx, db)

	cragsRepo := NewCrags(db)
	for _, perm := range cragsReadPermutations {
		t.Run(perm.name, func(t *testing.T) {
			expected := testutil.LoadCragFromJSON(t, "testdata/santee.json")
			input := perm.input
			input.ID = 55
			crag, err := cragsRepo.GetCrag(ctx, input)
			errcmp.MustMatch(t, err, "")
			want := expectedCragForInclude(expected, perm.input)
			if !cmp.Equal(crag, want, cmpOpts) {
				t.Errorf("crag mismatch (-got +want):\n%s", cmp.Diff(crag, want, cmpOpts))
			}
		})
	}
}

////////////////////////////////////////////////////////////////////////////////

// goc: helper to load santee.json fixture into DB
func loadSanteeFixture(t *testing.T, ctx context.Context, db *DB) {
	t.Helper()
	crag := testutil.LoadCragFromJSON(t, "testdata/santee.json")
	_, err := sqlp.Insert(ctx, db.DB, "crag", *crag)
	errcmp.MustMatch(t, err, "", "failed to insert crag")
	for _, a := range crag.Areas {
		a.CragID = crag.ID
		_, err := sqlp.Insert(ctx, db.DB, "area", a)
		errcmp.MustMatch(t, err, "", "failed to insert area")

		for _, b := range a.Boulders {
			b.AreaID = a.ID
			_, err := sqlp.Insert(ctx, db.DB, "boulder", b)
			errcmp.MustMatch(t, err, "", "failed to insert boulder")
		}
	}
	if crag.Parking != nil {
		crag.Parking.CragID = crag.ID
		_, err := sqlp.Insert(ctx, db.DB, "parking", *crag.Parking)
		errcmp.MustMatch(t, err, "", "failed to insert parking")
	}
	// TODO Eventually we will want to avoid keeping IDs from santee.json, since it keeps us from
	// treating `id` as an auto-increment field.
}

// goc: helper to produce the expected crag for a given include request
func expectedCragForInclude(crag *models.Crag, req CragsReadRequest) *models.Crag {
	if !req.IncludeArea && !req.IncludeBoulder {
		crag.Areas = nil
	}
	if !req.IncludeParking {
		crag.Parking = nil
	}
	if req.IncludeArea && !req.IncludeBoulder {
		for i := range crag.Areas {
			crag.Areas[i].Boulders = nil
		}
	}
	return crag
}
