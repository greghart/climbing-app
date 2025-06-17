package env

import (
	"fmt"

	"github.com/greghart/climbing-app/internal/config"
	"github.com/greghart/climbing-app/internal/db"
)

// The Env struct represents the managed environment for the application that's dependent on
// static configuration values.
// Eg config sets db settings, env sets up db and services
type Env struct {
	DB    *db.DB
	Repos Repos
}

type Repos struct {
	Crags *db.Crags
}

func New(cfg config.Config) *Env {
	database := db.NewDB(db.Options{
		Driver: cfg.DBDriver,
		Source: cfg.DBSource,
	})
	env := &Env{
		DB: database,
	}

	return env
}

func (e *Env) Start() error {
	if err := e.DB.Start(); err != nil {
		return fmt.Errorf("failed to start db: %w", err)
	}
	e.Repos = Repos{
		Crags: db.NewCrags(e.DB),
	}
	return nil
}

func (e *Env) Stop() {
	e.DB.Stop()
}
