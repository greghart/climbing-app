package env

import (
	"fmt"

	"github.com/greghart/climbing-app/internal/config"
	"github.com/greghart/climbing-app/internal/db"
	"github.com/greghart/climbing-app/internal/service"
)

// The Env struct represents the managed environment for the application that's dependent on
// static configuration values.
// Eg config sets db settings, env sets up db and services
type Env struct {
	DB       *db.DB
	Repos    *db.Repos
	Services *Services
}

type Services struct {
	Crags *service.Crags
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
	trails := db.NewTrails(e.DB)
	areas := db.NewAreas(e.DB)
	e.Repos = &db.Repos{
		Crags:  db.NewCrags(e.DB, trails, areas),
		Areas:  db.NewAreas(e.DB),
		Trails: trails,
	}
	e.Services = &Services{
		Crags: service.NewCrags(e.Repos),
	}
	return nil
}

func (e *Env) Stop() {
	e.DB.Stop()
}
