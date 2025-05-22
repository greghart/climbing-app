package db

import (
	"fmt"
	"log"

	"github.com/greghart/powerputtygo/sqlp"
	_ "github.com/mattn/go-sqlite3"
)

type Options struct {
	Driver string
	Source string
}

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
	d, err := sqlp.Open(db.Options.Driver, db.Options.Source)
	if err != nil {
		return fmt.Errorf("Failed to connect to database: %v", err)
	}
	db.DB = d

	// Verify the connection
	if err := db.Ping(); err != nil {
		return fmt.Errorf("Failed to ping database: %v", err)
	}

	// TODO: Integrate logging solution, maybe try grafana!
	log.Println("Database connection established")
	return nil
}

func (db *DB) Stop() {
	if db.DB == nil {
		return
	}
	if err := db.Close(); err != nil {
		log.Printf("Failed to close database connection: %v", err)
	} else {
		log.Println("Database connection closed")
	}
}
