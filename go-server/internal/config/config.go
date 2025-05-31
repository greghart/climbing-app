package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	// DB config
	DBDriver string
	DBSource string
	// HTTP config
	ExpectedHost string
}

func Load() Config {
	// Load .env file if it exists
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found, using environment variables")
	}

	return Config{
		DBDriver:     getEnv("DB_DRIVER", "sqlite3"),
		DBSource:     getEnv("DB_SOURCE", "./database.sqlite"),
		ExpectedHost: getEnv("HOST", "localhost:8080"),
	}
}

func getEnv(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return fallback
}
