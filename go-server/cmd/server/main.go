package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/greghart/climbing-app/internal/config"
	"github.com/greghart/climbing-app/internal/db"
)

func main() {
	// Load configuration
	cfg := config.Load()

	// Connect to the database
	database := db.NewDB(db.Options{
		Driver: cfg.DBDriver,
		Source: cfg.DBSource,
	})
	defer database.Stop()
	if err := database.Start(); err != nil {
		log.Fatalf("Failed to start database: %v", err)
	}

	crags := db.NewCrags(database.DB)

	// Placeholder for routes
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		respond(w, "Welcome to the Climbing App API")
	})

	http.HandleFunc("/crags", func(w http.ResponseWriter, r *http.Request) {
		ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
		defer cancel()

		crags, err := crags.GetCrags(ctx)
		if err != nil {
			respondError(w, fmt.Errorf("Failed to get crags: %v", err))
			return
		}
		respond(w, crags)
	})

	// Start the server
	log.Println("Starting server on :8080")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}

func respond(w http.ResponseWriter, payload any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(w).Encode(payload); err != nil {
		respondError(w, fmt.Errorf("Failed to encode response: %v", err))
		return
	}
}

func respondError(w http.ResponseWriter, err error, _status ...int) {
	// TODO: Integrate logging solution, exception reporting
	// TODO: Implement error classifications -- don't surface unexpected errors to the user
	status := http.StatusInternalServerError
	if len(_status) == 1 {
		status = _status[0]
	}
	http.Error(w, err.Error(), status)
}
