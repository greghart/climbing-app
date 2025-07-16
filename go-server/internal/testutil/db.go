package testutil

import (
	"context"
	"encoding/json"
	"fmt"
	"path"
	"testing"
	"time"

	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/sqlite3"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	"github.com/greghart/climbing-app/internal/config"
	"github.com/greghart/climbing-app/internal/db"
	"github.com/greghart/climbing-app/internal/models"
	"github.com/greghart/powerputtygo/errcmp"
	"github.com/greghart/powerputtygo/servicep"
	"github.com/greghart/powerputtygo/sqlp"
)

////////////////////////////////////////////////////////////////////////////////

func TestRepos(t testing.TB) (*db.Repos, context.Context) {
	t.Helper()

	d, ctx := TestDB(t)

	repos := &db.Repos{
		Crags:  db.NewCrags(d),
		Areas:  db.NewAreas(d),
		Trails: db.NewTrails(d),
	}
	if repos.Crags.DB != d {
		t.Fatalf("repos.Crags.DB is not the same as d: %p != %p", repos.Crags.DB, d)
	}
	return repos, ctx
}

// TestDB returns a test database that has migrations applied.
func TestDB(t testing.TB) (*sqlp.DB, context.Context) {
	t.Helper()

	db := db.NewDB(db.Options{
		Driver: "sqlite3",
		Source: "file::memory:?cache=shared", // Use an in-memory database for tests
	})
	errcmp.MustMatch(t, db.Start(), "", "failed to start test database")
	return TestDBSetup(t, db.DB)
}

func TestDBSetup(t testing.TB, db *sqlp.DB) (*sqlp.DB, context.Context) {
	t.Helper()
	ctx, cancel := context.WithTimeout(context.Background(), 500*time.Second)

	driver, err := sqlite3.WithInstance(db.DB, &sqlite3.Config{})
	errcmp.MustMatch(t, err, "", "failed to create sqlite3 driver instance")

	migrationsPath := fmt.Sprintf(
		"file://%s",
		path.Join(config.Load().RootDir, "migrations"),
	)
	m, err := migrate.NewWithDatabaseInstance(
		migrationsPath,
		"sqlite3",
		driver)
	errcmp.MustMatch(t, err, "", "failed to create migrate instance")
	err = m.Up()
	errcmp.MustMatch(t, err, "", "failed to apply migrations")

	t.Cleanup(func() {
		db.Close()
		cancel()
	})
	return db, ctx
}

// helper to load crag fixtures into DB
func LoadCrags(t *testing.T, ctx context.Context, d *sqlp.DB) {
	t.Helper()

	santee := LoadCragFromJSON(t, "testdata/santee.json")
	santee.TrailID = servicep.ZeroToPtr(santee.Trail.ID) // Ensure TrailID is set for insertion
	_, err := sqlp.Insert(ctx, d, "crag", *santee)
	errcmp.MustMatch(t, err, "", "failed to insert crag")
	for _, a := range santee.Areas {
		a.CragID = santee.ID
		a.PolygonID = &a.Polygon.ID
		_, err := sqlp.Insert(ctx, d, "area", a)
		errcmp.MustMatch(t, err, "", "failed to insert area")

		// Insert area polygon if present
		if a.Polygon != nil {
			_, err := sqlp.Insert(ctx, d, "polygon", *a.Polygon)
			errcmp.MustMatch(t, err, "", "failed to insert area polygon")
			// Insert polygon coordinates if present
			for i, pc := range a.Polygon.Coordinates {
				pc.PolygonID = a.Polygon.ID
				pc.Order = i + 1 // Order starts at 1
				_, err := sqlp.Insert(ctx, d, "polygon_coordinate", pc)
				errcmp.MustMatch(t, err, "", "failed to insert polygon coordinate")
			}
		}

		for _, b := range a.Boulders {
			b.AreaID = a.ID
			_, err := sqlp.Insert(ctx, d, "boulder", b)
			errcmp.MustMatch(t, err, "", "failed to insert boulder")

			for _, r := range b.Routes {
				r.BoulderID = b.ID
				if r.Grade != nil {
					r.GradeRaw = r.Grade.Raw
				}
				_, err := sqlp.Insert(ctx, d, "route", r)
				errcmp.MustMatch(t, err, "", "failed to insert route")
			}
		}
	}
	if santee.Parking != nil {
		santee.Parking.CragID = santee.ID
		_, err := sqlp.Insert(ctx, d, "parking", *santee.Parking)
		errcmp.MustMatch(t, err, "", "failed to insert parking")
	}
	if santee.Trail != nil {
		_, err := d.Exec(ctx, "INSERT INTO trail (id) VALUES (?)", santee.Trail.ID)
		errcmp.MustMatch(t, err, "", "failed to insert trail")
		for i, l := range santee.Trail.Lines {
			l.TrailID = santee.Trail.ID
			l.Order = i
			_, err := sqlp.Insert(ctx, d, "trail_line", l)
			errcmp.MustMatch(t, err, "", "failed to insert trail line")
		}
	}

	empty := LoadCragFromJSON(t, "testdata/empty.json")
	_, err = sqlp.Insert(ctx, d, "crag", *empty)
	errcmp.MustMatch(t, err, "", "failed to insert empty crag")
}

// NormalizeCrag to make it easier to compare between our fixture JSON and direct db results.
// Direct DB includes things like bi-directional foreign keys and `order` fields that aren't leaked
// to user -- since santee.json is user-land, we want to adapt to that here.
func NormalizeCrag(c *models.Crag, err error) (*models.Crag, error) {
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
