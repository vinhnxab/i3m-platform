package config

import (
	"os"
	"strconv"
)

type Config struct {
	Port        string
	Environment string

	// Database
	DatabaseURL string

	// Redis
	RedisHost     string
	RedisPort     string
	RedisPassword string
	RedisDB       int

	// Security
	JWTSecret     string
	EncryptionKey string

	// Rate limiting
	RateLimit int
	RateBurst int

	// Threat detection
	ThreatDetectionEnabled bool
	MaxThreatScore         int
}

func Load() *Config {
	redisDB, _ := strconv.Atoi(getEnv("REDIS_DB", "0"))
	rateLimit, _ := strconv.Atoi(getEnv("RATE_LIMIT", "100"))
	rateBurst, _ := strconv.Atoi(getEnv("RATE_BURST", "200"))
	maxThreatScore, _ := strconv.Atoi(getEnv("MAX_THREAT_SCORE", "80"))
	threatDetectionEnabled, _ := strconv.ParseBool(getEnv("THREAT_DETECTION_ENABLED", "true"))

	return &Config{
		Port:        getEnv("PORT", "3040"),
		Environment: getEnv("ENVIRONMENT", "development"),

		DatabaseURL: getEnv("DATABASE_URL", "postgres://i3m_user:i3m_password@postgres:5432/i3m_platform?sslmode=disable"),

		RedisHost:     getEnv("REDIS_HOST", "redis"),
		RedisPort:     getEnv("REDIS_PORT", "6379"),
		RedisPassword: getEnv("REDIS_PASSWORD", "i3m_password"),
		RedisDB:       redisDB,

		JWTSecret:     getEnv("JWT_SECRET", "your-super-secret-jwt-key-here"),
		EncryptionKey: getEnv("ENCRYPTION_KEY", "your-32-byte-encryption-key-here!!"),

		RateLimit: rateLimit,
		RateBurst: rateBurst,

		ThreatDetectionEnabled: threatDetectionEnabled,
		MaxThreatScore:         maxThreatScore,
	}
}

func getEnv(key, defaultValue string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return defaultValue
}
