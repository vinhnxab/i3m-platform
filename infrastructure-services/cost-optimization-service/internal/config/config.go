package config

import (
	"os"
)

type Config struct {
	Port          string
	DatabaseURL   string
	Environment   string
	RedisHost     string
	RedisPort     string
	RedisPassword string
	RedisDB       int
}

func Load() *Config {
	return &Config{
		Port:          getEnv("PORT", "3042"),
		DatabaseURL:   getEnv("DATABASE_URL", "postgres://i3m_user:i3m_password@postgres:5432/i3m_platform?sslmode=disable"),
		Environment:   getEnv("ENVIRONMENT", "development"),
		RedisHost:     getEnv("REDIS_HOST", "redis"),
		RedisPort:     getEnv("REDIS_PORT", "6379"),
		RedisPassword: getEnv("REDIS_PASSWORD", "i3m_password"),
		RedisDB:       0,
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
