package db

import (
	"fmt"
	"log/slog"

	"github.com/greghart/powerputtygo/sqlp"
	_ "github.com/mattn/go-sqlite3"
)

type Options struct {
	Driver string
	Source string
}

// DB is a loose wrapper around sqlp.DB that sets up app defaults and start/stop functionality.
type DB struct {
	*sqlp.DB
	Options
}

func NewDB(o Options) *DB {
	return &DB{
		Options: o,
	}
}

func (db *DB) Start() error {
	d, err := sqlp.Open(db.Options.Driver, db.Options.Source, sqlp.DBOptions{
		Metrics: sqlp.DBMetrics{
			QueryCounter:          metricsQueryCounter,
			QueryDurationObserver: metricsQueryDuration,
		},
	})
	if err != nil {
		return fmt.Errorf("Failed to connect to database: %v", err)
	}
	db.DB = d

	// Verify the connection
	if err := db.Ping(); err != nil {
		return fmt.Errorf("Failed to ping database: %v", err)
	}

	slog.Info("Database connection established")
	return nil
}

func (db *DB) Stop() {
	if db.DB == nil {
		return
	}
	if err := db.Close(); err != nil {
		slog.Error(fmt.Sprintf("Failed to close database connection: %v", err))
	} else {
		slog.Info("Database connection closed")
	}
}
