package config

import (
	"os"
	"strconv"
)

// Config holds all configuration for the storage service
type Config struct {
	Port           string
	DatabaseURL    string
	RedisURL       string
	JWTSecret      string
	UploadPath     string
	ThumbnailPath  string
	MaxFileSize    int64
	MaxRequestSize int64
	Storage        StorageConfig
}

// StorageConfig holds storage provider configuration
type StorageConfig struct {
	Local LocalConfig
	S3    S3Config
	MinIO MinIOConfig
}

// LocalConfig holds local storage configuration
type LocalConfig struct {
	Enabled bool
	Path    string
}

// S3Config holds AWS S3 configuration
type S3Config struct {
	Enabled   bool
	Bucket    string
	Region    string
	AccessKey string
	SecretKey string
}

// MinIOConfig holds MinIO configuration
type MinIOConfig struct {
	Enabled   bool
	Endpoint  string
	Bucket    string
	AccessKey string
	SecretKey string
}

// Load loads configuration from environment variables
func Load() *Config {
	return &Config{
		Port:           getEnv("PORT", "3032"),
		DatabaseURL:    getEnv("DATABASE_URL", "postgres://i3m_user:i3m_password@localhost:5433/i3m_platform?sslmode=disable"),
		RedisURL:       getEnv("REDIS_URL", "redis://localhost:6379"),
		JWTSecret:      getEnv("JWT_SECRET", "your-secret-key-here"),
		UploadPath:     getEnv("STORAGE_UPLOAD_PATH", "/app/storage/uploads"),
		ThumbnailPath:  getEnv("STORAGE_THUMBNAIL_PATH", "/app/storage/thumbnails"),
		MaxFileSize:    getEnvAsInt64("STORAGE_MAX_FILE_SIZE", 100*1024*1024),     // 100MB
		MaxRequestSize: getEnvAsInt64("STORAGE_MAX_REQUEST_SIZE", 1000*1024*1024), // 1000MB
		Storage: StorageConfig{
			Local: LocalConfig{
				Enabled: getEnvAsBool("STORAGE_LOCAL_ENABLED", true),
				Path:    getEnv("STORAGE_LOCAL_PATH", "/app/storage"),
			},
			S3: S3Config{
				Enabled:   getEnvAsBool("STORAGE_S3_ENABLED", false),
				Bucket:    getEnv("STORAGE_S3_BUCKET", ""),
				Region:    getEnv("STORAGE_S3_REGION", "us-east-1"),
				AccessKey: getEnv("STORAGE_S3_ACCESS_KEY", ""),
				SecretKey: getEnv("STORAGE_S3_SECRET_KEY", ""),
			},
			MinIO: MinIOConfig{
				Enabled:   getEnvAsBool("STORAGE_MINIO_ENABLED", false),
				Endpoint:  getEnv("STORAGE_MINIO_ENDPOINT", "http://localhost:9000"),
				Bucket:    getEnv("STORAGE_MINIO_BUCKET", "i3m-storage"),
				AccessKey: getEnv("STORAGE_MINIO_ACCESS_KEY", ""),
				SecretKey: getEnv("STORAGE_MINIO_SECRET_KEY", ""),
			},
		},
	}
}

// getEnv gets an environment variable with a default value
func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

// getEnvAsInt64 gets an environment variable as int64 with a default value
func getEnvAsInt64(key string, defaultValue int64) int64 {
	if value := os.Getenv(key); value != "" {
		if intValue, err := strconv.ParseInt(value, 10, 64); err == nil {
			return intValue
		}
	}
	return defaultValue
}

// getEnvAsBool gets an environment variable as bool with a default value
func getEnvAsBool(key string, defaultValue bool) bool {
	if value := os.Getenv(key); value != "" {
		if boolValue, err := strconv.ParseBool(value); err == nil {
			return boolValue
		}
	}
	return defaultValue
}
