package db

import (
	"fmt"
	"log"

	"github.com/jmoiron/sqlx"
	_ "modernc.org/sqlite"
)

type Options struct {
	Driver string
	Source string
}

type DB struct {
	*sqlx.DB
	Options
}

func (db *DB) Start() error {
	d, err := sqlx.Open(db.Options.Driver, db.Options.Source)
	if err != nil {
		return fmt.Errorf("Failed to connect to database: %v", err)
	}

	// Verify the connection
	if err := db.Ping(); err != nil {
		return fmt.Errorf("Failed to ping database: %v", err)
	}

	// TODO: Integrate logging solution, maybe try grafana!
	db.DB = d
	log.Println("Database connection established")
	return nil
}
