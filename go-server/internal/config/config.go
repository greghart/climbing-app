package config

import (
	"log"
	"log/slog"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

type Config struct {
	RootDir  string
	LogLevel int
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
	godotenv.Load(".env.local") // nolint:errcheck
	godotenv.Load()             // nolint:errcheck

	cfg := Config{
		RootDir:  getEnvString("ROOT_DIR", "/var/app"),
		LogLevel: getEnvInt("LOG_LEVEL", int(slog.LevelInfo)),
		// DB
		DBDriver: getEnvString("DB_DRIVER", "sqlite3"),
		DBSource: getEnvString("DB_SOURCE", "./database.sqlite"),
		// HTTP
		ExpectedHost: getEnvString("HOST", "localhost"),
		HTTPPort:     getEnvInt("HTTP_PORT", 8080),
		GRPCPort:     getEnvInt("GRPC_PORT", 8081),
	}
	return cfg
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
