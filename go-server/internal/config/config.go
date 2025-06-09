package config

import (
	"log"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

type Config struct {
	// DB config
	DBDriver string
	DBSource string
	// HTTP config
	ExpectedHost string
	HTTPPort     int
	GRPCPort     int
}

func Load() Config {
	// Load .env file if it exists
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found, using environment variables")
	}

	return Config{
		DBDriver:     getEnvString("DB_DRIVER", "sqlite3"),
		DBSource:     getEnvString("DB_SOURCE", "./database.sqlite"),
		ExpectedHost: getEnvString("HOST", "localhost"),
		HTTPPort:     getEnvInt("HTTP_PORT", 8080),
		GRPCPort:     getEnvInt("GRPC_PORT", 8081),
	}
}

type adapter[T any] func(string) (T, error)

func getEnv[T any](adapter adapter[T]) func(key string, fallback T) T {
	return func(key string, fallback T) T {
		if value, exists := os.LookupEnv(key); exists {
			adapted, err := adapter(value)
			if err != nil {
				log.Panicf("Error adapting environment variable %s: %v", key, err)
			}
			return adapted
		}
		return fallback
	}
}

var getEnvString = getEnv(func(s string) (string, error) { return s, nil })
var getEnvInt = getEnv(func(s string) (int, error) {
	return strconv.Atoi(s)
})
