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

	combos := testutil.IncludeCombos(CragsIncludeSchema)
	for _, includes := range combos {
		t.Run(strings.Join(includes, ","), func(t *testing.T) {
			req := CragsReadRequest{
				Include: CragsIncludeSchema.Include(includes...),
			}
			_crags, err := service.ListCrags(ctx, req)
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
				want := expectedCragForInclude(*expected[i], req)
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

	for _, includes := range testutil.IncludeCombos(CragsIncludeSchema) {
		t.Run(strings.Join(includes, ","), func(t *testing.T) {
			expected := testutil.LoadCragFromJSON(t, "testdata/santee.json")
			req := CragsReadRequest{
				Include: CragsIncludeSchema.Include(includes...),
			}
			req.ID = 55
			crag, err := testutil.NormalizeCrag(service.GetCrag(ctx, req))
			errcmp.MustMatch(t, err, "")

			want := expectedCragForInclude(*expected, req)

			if !cmp.Equal(*crag, want, cmpOpts) {
				t.Errorf("crag mismatch (-got +want):\n%s", cmp.Diff(*crag, want, cmpOpts))
			}
		})
	}
}

////////////////////////////////////////////////////////////////////////////////

// expectedCragForInclude produces the expected crag for a given include request
func expectedCragForInclude(crag models.Crag, req CragsReadRequest) models.Crag {
	if !req.Include.IsIncluded("trail") {
		crag.Trail = nil
	}
	if req.Include.IsIncluded("trail") && !req.Include.IsIncluded("trail.lines") {
		if crag.Trail != nil {
			crag.Trail.Lines = nil
		}
	}
	if !req.Include.IsIncluded("areas") {
		crag.Areas = nil
	}
	if !req.Include.IsIncluded("parking") {
		crag.Parking = nil
	}
	if req.Include.IsIncluded("areas") && !req.Include.IsIncluded("areas.boulders") {
		for i := range crag.Areas {
			crag.Areas[i].Boulders = nil
		}
	}
	if req.Include.IsIncluded("areas.boulders") && !req.Include.IsIncluded("areas.boulders.routes") {
		for i := range crag.Areas {
			crag.Areas[i].Boulders = crag.Areas[i].Boulders[:]
			for j := range crag.Areas[i].Boulders {
				crag.Areas[i].Boulders[j].Routes = nil
			}
		}
	}
	if req.Include.IsIncluded("areas") && !req.Include.IsIncluded("areas.polygon") {
		for i := range crag.Areas {
			crag.Areas[i].Polygon = nil
		}
	}
	if req.Include.IsIncluded("areas.polygon") && !req.Include.IsIncluded("areas.polygon.coordinates") {
		for i := range crag.Areas {
			crag.Areas[i].Polygon.Coordinates = nil
		}
	}
	return crag
}
