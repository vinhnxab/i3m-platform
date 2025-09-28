package config

import (
	"os"
)

type Config struct {
	Port         string
	DatabaseURL  string
	Environment  string
	VaultURL     string
	VaultToken   string
	VaultAddress string
}

func Load() *Config {
	return &Config{
		Port:         getEnv("PORT", "3044"),
		DatabaseURL:  getEnv("DATABASE_URL", "postgres://i3m_user:i3m_password@postgres:5432/i3m_platform?sslmode=disable"),
		Environment:  getEnv("ENVIRONMENT", "development"),
		VaultURL:     getEnv("VAULT_URL", ""),
		VaultToken:   getEnv("VAULT_TOKEN", ""),
		VaultAddress: getEnv("VAULT_ADDRESS", ""),
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
