package main

import (
	"log"
	"net/http"

	"github.com/greghart/climbing-app/config"
	"github.com/greghart/climbing-app/db"
)

func main() {
	// Load configuration
	cfg := config.LoadConfig()

	// Connect to the database
	database := db.Connect(cfg)
	defer database.Close()

	// Placeholder for routes
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Welcome to the Climbing App API"))
	})

	// Start the server
	log.Println("Starting server on :8080")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
