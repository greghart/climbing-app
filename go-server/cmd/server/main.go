package main

import (
	"log"

	"github.com/greghart/climbing-app/internal/config"
	"github.com/greghart/climbing-app/internal/http"
)

func main() {
	cfg := config.Load()
	env := config.NewEnv(cfg)
	defer env.Stop()

	if err := env.Start(); err != nil {
		log.Fatalf("Failed to start environment: %v", err)
	}

	server := http.NewServer(env, http.Options{
		ExpectedHost: cfg.ExpectedHost,
	})
	if err := server.Start(); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
