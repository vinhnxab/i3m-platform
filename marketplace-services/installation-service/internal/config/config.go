package config

import (
	"os"
)

type Config struct {
	Port        string
	Environment string
	DatabaseURL string
	RedisURL    string
	LogLevel    string
}

func Load() *Config {
	return &Config{
		Port:        getEnv("PORT", "3061"),
		Environment: getEnv("ENVIRONMENT", "development"),
		DatabaseURL: getEnv("DATABASE_URL", "postgresql://i3m_user:i3m_password@localhost:5433/i3m_platform"),
		RedisURL:    getEnv("REDIS_URL", "redis://:i3m_password@localhost:6380/15"),
		LogLevel:    getEnv("LOG_LEVEL", "info"),
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
