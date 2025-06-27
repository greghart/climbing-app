package service

import (
	"slices"
	"strings"
	"testing"

	"github.com/google/go-cmp/cmp"
	"github.com/google/go-cmp/cmp/cmpopts"
	"github.com/greghart/climbing-app/internal/models"
	"github.com/greghart/climbing-app/internal/testutil"
	"github.com/greghart/powerputtygo/errcmp"
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
	repos, ctx := testutil.TestRepos(t)
	service := NewCrags(repos)
	testutil.LoadCrags(t, ctx, repos.Crags.DB)

	for _, perm := range cragsReadPermutations {
		t.Run(perm.name, func(t *testing.T) {
			_crags, err := service.ListCrags(ctx, perm.input)
			errcmp.MustMatch(t, err, "")
			crags := make([]models.Crag, len(_crags))
			for i := range _crags {
				adapted, err := testutil.NormalizeCrag(&_crags[i], nil)
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
	repos, ctx := testutil.TestRepos(t)
	service := NewCrags(repos)
	testutil.LoadCrags(t, ctx, repos.Crags.DB)

	for _, perm := range cragsReadPermutations {
		t.Run(perm.name, func(t *testing.T) {
			expected := testutil.LoadCragFromJSON(t, "testdata/santee.json")
			input := perm.input
			input.ID = 55
			crag, err := testutil.NormalizeCrag(service.GetCrag(ctx, input))
			errcmp.MustMatch(t, err, "")

			want := expectedCragForInclude(*expected, perm.input)

			if !cmp.Equal(*crag, want, cmpOpts) {
				t.Errorf("crag mismatch (-got +want):\n%s", cmp.Diff(*crag, want, cmpOpts))
			}
		})
	}
}

////////////////////////////////////////////////////////////////////////////////

// expectedCragForInclude produces the expected crag for a given include request
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
