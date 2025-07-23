package service

import (
	"slices"
	"strings"
	"testing"
	"time"

	"github.com/google/go-cmp/cmp"
	"github.com/google/go-cmp/cmp/cmpopts"
	"github.com/greghart/climbing-app/internal/models"
	"github.com/greghart/climbing-app/internal/testutil"
	"github.com/greghart/powerputtygo/errcmp"
	"github.com/greghart/powerputtygo/servicep"
)

func TestCrags_GetCrags(t *testing.T) {
	repos, ctx := testutil.TestRepos(t)
	services := NewServices(repos)
	testutil.LoadCrags(t, ctx, repos.Crags.DB)

	combos := testutil.IncludeCombos(CragsIncludeSchema)
	for _, includes := range combos {
		t.Run(strings.Join(includes, ","), func(t *testing.T) {
			req := CragsReadRequest{
				Include: CragsIncludeSchema.Include(includes...),
			}
			_crags, err := services.Crags.ListCrags(ctx, req)
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
	services := NewServices(repos)
	testutil.LoadCrags(t, ctx, repos.Crags.DB)

	for _, includes := range testutil.IncludeCombos(CragsIncludeSchema) {
		t.Run(strings.Join(includes, ","), func(t *testing.T) {
			expected := testutil.LoadCragFromJSON(t, "testdata/santee.json")
			req := CragsReadRequest{
				Include: CragsIncludeSchema.Include(includes...),
			}
			req.ID = 55
			crag, err := testutil.NormalizeCrag(services.Crags.GetCrag(ctx, req))
			errcmp.MustMatch(t, err, "")

			want := expectedCragForInclude(*expected, req)

			if !cmp.Equal(*crag, want, cmpOpts) {
				t.Errorf("crag mismatch (-got +want):\n%s", cmp.Diff(*crag, want, cmpOpts))
			}
		})
	}
}

func TestCrags_UpdateCrag(t *testing.T) {
	santee := testutil.LoadCragFromJSON(t, "testdata/santee.json")
	empty := testutil.LoadCragFromJSON(t, "testdata/empty.json")

	tests := map[string]struct {
		crag   *models.Crag
		update CragUpdateRequest
		err    string
		expect func(*testing.T, *models.Crag, *CragUpdateRequest)
	}{
		"update basic attrs": {
			update: CragUpdateRequest{
				FieldMask:   servicep.NewFieldMask([]string{"name", "description"}),
				Name:        "Updated name",
				Description: servicep.ZeroToPtr("Updated description"),
			},
			expect: func(t *testing.T, crag *models.Crag, req *CragUpdateRequest) {
				if crag.Name != req.Name {
					t.Errorf("crag.Name = %s, wanted '%s'", crag.Name, req.Name)
				}
				if !cmp.Equal(crag.Description, req.Description) {
					t.Errorf("crag.Description = %s, wanted '%s'", *crag.Description, *req.Description)
				}
			},
		},
		"update basic attrs without field mask": {
			update: CragUpdateRequest{
				FieldMask:   servicep.NewFieldMask([]string{}),
				Name:        "Updated name",
				Description: servicep.ZeroToPtr("Updated description"),
			},
			expect: func(t *testing.T, crag *models.Crag, req *CragUpdateRequest) {
				if crag.Name != santee.Name {
					t.Errorf("crag.Name = '%s', wanted '%s'", crag.Name, santee.Name)
				}
				if !cmp.Equal(crag.Description, santee.Description) {
					t.Errorf("crag.Description = %s, wanted '%s'", *crag.Description, *santee.Description)
				}
			},
		},
		"zero out description to nil": {
			update: CragUpdateRequest{
				FieldMask:   servicep.NewFieldMask([]string{"description"}),
				Description: servicep.ZeroToPtr(""), // this mirrors how user data comes in
			},
			expect: func(t *testing.T, crag *models.Crag, req *CragUpdateRequest) {
				if crag.Description != nil {
					t.Errorf("crag.Description = %s, wanted nil", *crag.Description)
				}
			},
		},
		"nil out bounds not allowed": {
			update: CragUpdateRequest{
				FieldMask: servicep.NewFieldMask([]string{"bounds"}),
				Bounds:    nil,
			},
			err: "bounds cannot be nil'ed out",
		},
		"update bounds": {
			update: CragUpdateRequest{
				FieldMask: servicep.NewFieldMask([]string{"bounds"}),
				Bounds: &models.Bounds{
					TopLeft: models.Coordinate{
						Lat: 1.0,
						Lng: 2.0,
					},
					BottomRight: models.Coordinate{
						Lat: 3.0,
						Lng: 4.0,
					},
				},
			},
			expect: func(t *testing.T, crag *models.Crag, req *CragUpdateRequest) {
				if !cmp.Equal(crag.Bounds, *req.Bounds) {
					t.Errorf("crag.Bounds = %v, wanted %v", crag.Bounds, *req.Bounds)
				}
			},
		},
		"create new trail": {
			crag: empty,
			update: CragUpdateRequest{
				FieldMask: servicep.NewFieldMask([]string{"trail"}),
				Trail: &models.Trail{
					Lines: []models.Line{
						{
							Start: models.Coordinate{Lat: 1.0, Lng: 2.0},
							End:   models.Coordinate{Lat: 3.0, Lng: 4.0},
						},
					},
				},
			},
			expect: func(t *testing.T, crag *models.Crag, req *CragUpdateRequest) {
				if crag.Trail == nil {
					t.Fatalf("crag.Trail is nil, expected a new trail to be created")
				}
				req.Trail.ID = crag.Trail.ID
				if !cmp.Equal(*crag.Trail, *req.Trail, cmpOpts) {
					t.Fatalf("crag.Trail not created as expected\n:%s", cmp.Diff(*crag.Trail, *req.Trail, cmpOpts))
				}
			},
		},
		"update existing trail": {
			crag: santee,
			update: CragUpdateRequest{
				FieldMask: servicep.NewFieldMask([]string{"trail"}),
				Trail: &models.Trail{
					Lines: []models.Line{
						{
							Start: models.Coordinate{Lat: 1.0, Lng: 2.0},
							End:   models.Coordinate{Lat: 3.0, Lng: 4.0},
						},
					},
				},
			},
			expect: func(t *testing.T, crag *models.Crag, req *CragUpdateRequest) {
				expected := models.Trail{
					ID: santee.Trail.ID,
					Lines: []models.Line{
						{
							Start: models.Coordinate{Lat: 1.0, Lng: 2.0},
							End:   models.Coordinate{Lat: 3.0, Lng: 4.0},
						},
					},
				}
				if !cmp.Equal(*crag.Trail, expected, cmpOpts) {
					t.Fatalf("crag.Trail not created as expected\n:%s", cmp.Diff(*crag.Trail, expected, cmpOpts))
				}
			},
		},
		"remove existing trail": {
			crag: santee,
			update: CragUpdateRequest{
				FieldMask: servicep.NewFieldMask([]string{"trail"}),
				Trail:     nil,
			},
			expect: func(t *testing.T, crag *models.Crag, req *CragUpdateRequest) {
				if crag.Trail != nil {
					t.Fatalf("crag.Trail not deleted as expected:\n%v", crag.Trail)
				}
			},
		},
		"out of date update is rejected": {
			update: CragUpdateRequest{
				FieldMask:   servicep.NewFieldMask([]string{"name"}),
				ID:          santee.ID,
				Name:        "Updated name",
				RequestedAt: time.Now().Add(-365 * 15 * 24 * time.Hour), // Simulate an out-of-date update
			},
			err: "update is out of date",
		},
	}

	for name, tests := range tests {
		t.Run(name, func(t *testing.T) {
			repos, ctx := testutil.TestRepos(t)
			services := NewServices(repos)
			testutil.LoadCrags(t, ctx, repos.Crags.DB)

			crag := tests.crag
			if crag == nil {
				crag = santee
			}
			req := tests.update
			req.ID = crag.ID
			if req.RequestedAt.IsZero() {
				req.RequestedAt = time.Now()
			}
			err := services.Crags.Update(ctx, req)
			errcmp.MustMatch(t, err, tests.err)

			updated, err := services.Crags.GetCrag(ctx, CragsReadRequest{
				ID:      req.ID,
				Include: servicep.NewIncludeRequest().Include("trail.lines"),
			})
			errcmp.MustMatch(t, err, "", "failed to get crag after update")
			if updated == nil {
				t.Fatal("crag not found after update")
			}

			if tests.expect != nil {
				tests.expect(t, updated, &req)
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

// Ignore timestamps since those are
var cmpOpts = cmp.Options{
	cmpopts.EquateEmpty(),
	cmp.FilterPath(
		func(p cmp.Path) bool {
			return strings.Contains(p.String(), "UpdatedAt") || strings.Contains(p.String(), "CreatedAt") || strings.Contains(p.String(), "ID")
		},
		cmp.Ignore(),
	),
}
