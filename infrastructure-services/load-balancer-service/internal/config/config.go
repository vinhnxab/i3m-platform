package config

import (
	"os"
)

type Config struct {
	Port          string
	RedisHost     string
	RedisPort     string
	RedisPassword string
	RedisDB       int
	LogLevel      string
	Environment   string
	BackendURLs   []string
}

func LoadConfig() *Config {
	// Đọc cấu hình từ biến môi trường, có thể mở rộng đọc file yaml/json nếu cần
	return &Config{
		Port:          getEnv("PORT", "3043"),
		RedisHost:     getEnv("REDIS_HOST", "redis"),
		RedisPort:     getEnv("REDIS_PORT", "6379"),
		RedisPassword: getEnv("REDIS_PASSWORD", ""),
		RedisDB:       0,
		LogLevel:      getEnv("LOG_LEVEL", "info"),
		Environment:   getEnv("ENVIRONMENT", "development"),
		BackendURLs: []string{
			getEnv("BACKEND_URL_1", "http://service1:8080"),
			getEnv("BACKEND_URL_2", "http://service2:8080"),
		},
	}
}

func getEnv(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}
