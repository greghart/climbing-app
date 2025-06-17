package db

import (
	"context"
	"fmt"
	"path"
	"testing"
	"time"

	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/sqlite3"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	"github.com/greghart/climbing-app/internal/config"
	"github.com/greghart/powerputtygo/errcmp"
)

////////////////////////////////////////////////////////////////////////////////

// testDB returns a test database and a cleanup function.
func testDB(t testing.TB) (*DB, context.Context, func()) {
	t.Helper()

	db := NewDB(Options{
		Driver: "sqlite3",
		Source: ":memory:", // Use an in-memory database for tests
	})
	errcmp.MustMatch(t, db.Start(), "", "failed to start test database")
	return testDBSetup(t, db)
}

func testDBSetup(t testing.TB, db *DB) (*DB, context.Context, func()) {
	t.Helper()
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)

	driver, err := sqlite3.WithInstance(db.DB.DB, &sqlite3.Config{})
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

	return db, ctx, func() {
		db.Close()
		cancel()
	}
}
