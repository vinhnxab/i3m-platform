package config

import (
	"fmt"
	"os"
	"strconv"
	"strings"

	"github.com/joho/godotenv"
	"github.com/sirupsen/logrus"
)

type Config struct {
	// Server configuration
	Port string
	Env  string

	// Service info
	Service ServiceConfig

	// Database configuration
	Database DatabaseConfig

	// Redis configuration
	Redis RedisConfig

	// JWT configuration
	JWT JWTConfig

	// External services
	Services ExternalServices

	// CORS configuration
	CORS CORSConfig

	// Security configuration
	Security SecurityConfig

	// Inventory specific configuration
	Inventory InventoryConfig

	// Logging configuration
	Logging LoggingConfig

	// Monitoring configuration
	Monitoring MonitoringConfig

	// Pagination configuration
	Pagination PaginationConfig
}

type ServiceConfig struct {
	Name        string
	Version     string
	Description string
}

type DatabaseConfig struct {
	Host     string
	Port     string
	User     string
	Password string
	Name     string
	SSLMode  string
	DSN      string
}

type RedisConfig struct {
	Host     string
	Port     string
	Password string
	DB       int
}

type JWTConfig struct {
	Secret           string
	ExpiresIn        string
	RefreshExpiresIn string
}

type ExternalServices struct {
	AuthService    string
	UserService    string
	FinanceService string
	HRMService     string
	APIGateway     string
}

type CORSConfig struct {
	AllowedOrigins []string
	AllowedMethods []string
	AllowedHeaders []string
	AllowCredentials bool
}

type SecurityConfig struct {
	RateLimitRequests int
	BcryptRounds      int
	SessionTimeout    int
}

type InventoryConfig struct {
	DefaultWarehouse string
	LowStockThreshold int
	AutoReorderEnabled bool
	AutoReorderLevel   int
	MaxBatchSize       int
	Categories         []string
	Units              []string
	StockMovementTypes []string
	Suppliers          SupplierConfig
	Barcoding          BarcodingConfig
}

type SupplierConfig struct {
	DefaultCurrency    string
	PaymentTerms       []string
	DefaultPaymentTerm string
}

type BarcodingConfig struct {
	Enabled      bool
	Format       string // EAN13, CODE128, etc.
	AutoGenerate bool
}

type LoggingConfig struct {
	Level string
	File  FileLoggingConfig
}

type FileLoggingConfig struct {
	Enabled  bool
	Filename string
	MaxSize  int
	MaxFiles int
}

type MonitoringConfig struct {
	Enabled     bool
	MetricsPath string
	HealthPath  string
}

type PaginationConfig struct {
	DefaultLimit int
	MaxLimit     int
}

func Load() (*Config, error) {
	// Load .env file if it exists
	if err := godotenv.Load(); err != nil {
		logrus.Warn("No .env file found")
	}

	config := &Config{
		Port: getEnv("PORT", "3012"),
		Env:  getEnv("NODE_ENV", "development"),

		Service: ServiceConfig{
			Name:        "inventory-service",
			Version:     "1.0.0",
			Description: "I3M Platform Inventory Service - Inventory & Warehouse Management",
		},

		Database: DatabaseConfig{
			Host:     getEnv("DB_HOST", "postgres"),
			Port:     getEnv("DB_PORT", "5432"),
			User:     getEnv("DB_USER", "i3m_user"),
			Password: getEnv("DB_PASSWORD", "i3m_password"),
			Name:     getEnv("DB_NAME", "i3m_inventory_db"),
			SSLMode:  getEnv("DB_SSL_MODE", "disable"),
		},

		Redis: RedisConfig{
			Host:     getEnv("REDIS_HOST", "redis"),
			Port:     getEnv("REDIS_PORT", "6379"),
			Password: getEnv("REDIS_PASSWORD", "i3m_password"),
			DB:       getEnvAsInt("REDIS_DB", 4), // Database 4 for inventory service
		},

		JWT: JWTConfig{
			Secret:           getEnv("JWT_SECRET", "your-super-secret-jwt-key-here"),
			ExpiresIn:        getEnv("JWT_EXPIRES_IN", "15m"),
			RefreshExpiresIn: getEnv("JWT_REFRESH_EXPIRES_IN", "7d"),
		},

		Services: ExternalServices{
			AuthService:    getEnv("AUTH_SERVICE_URL", "http://auth-service:3008"),
			UserService:    getEnv("USER_SERVICE_URL", "http://user-service:3009"),
			FinanceService: getEnv("FINANCE_SERVICE_URL", "http://finance-service:3010"),
			HRMService:     getEnv("HRM_SERVICE_URL", "http://hrm-service:3011"),
			APIGateway:     getEnv("API_GATEWAY_URL", "http://api-gateway:3004"),
		},

		CORS: CORSConfig{
			AllowedOrigins:   strings.Split(getEnv("CORS_ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:3004"), ","),
			AllowedMethods:   strings.Split(getEnv("CORS_ALLOWED_METHODS", "GET,POST,PUT,DELETE,PATCH,OPTIONS"), ","),
			AllowedHeaders:   strings.Split(getEnv("CORS_ALLOWED_HEADERS", "Content-Type,Authorization,X-Tenant-ID,X-User-ID"), ","),
			AllowCredentials: getEnvAsBool("CORS_ALLOW_CREDENTIALS", true),
		},

		Security: SecurityConfig{
			RateLimitRequests: getEnvAsInt("RATE_LIMIT_REQUESTS", 100),
			BcryptRounds:      getEnvAsInt("BCRYPT_ROUNDS", 12),
			SessionTimeout:    getEnvAsInt("SESSION_TIMEOUT", 3600000), // 1 hour
		},

		Inventory: InventoryConfig{
			DefaultWarehouse:   getEnv("DEFAULT_WAREHOUSE", "MAIN"),
			LowStockThreshold:  getEnvAsInt("LOW_STOCK_THRESHOLD", 10),
			AutoReorderEnabled: getEnvAsBool("AUTO_REORDER_ENABLED", false),
			AutoReorderLevel:   getEnvAsInt("AUTO_REORDER_LEVEL", 5),
			MaxBatchSize:       getEnvAsInt("MAX_BATCH_SIZE", 1000),
			Categories: strings.Split(getEnv("INVENTORY_CATEGORIES", 
				"Raw Materials,Finished Goods,Work in Progress,Consumables,Spare Parts"), ","),
			Units: strings.Split(getEnv("INVENTORY_UNITS", 
				"pcs,kg,g,l,ml,m,cm,box,pack,set"), ","),
			StockMovementTypes: strings.Split(getEnv("STOCK_MOVEMENT_TYPES", 
				"IN,OUT,TRANSFER,ADJUSTMENT,RETURN,DAMAGED,EXPIRED"), ","),
			Suppliers: SupplierConfig{
				DefaultCurrency:    getEnv("SUPPLIER_DEFAULT_CURRENCY", "USD"),
				PaymentTerms:       strings.Split(getEnv("SUPPLIER_PAYMENT_TERMS", "NET30,NET60,NET90,COD,Prepaid"), ","),
				DefaultPaymentTerm: getEnv("SUPPLIER_DEFAULT_PAYMENT_TERM", "NET30"),
			},
			Barcoding: BarcodingConfig{
				Enabled:      getEnvAsBool("BARCODING_ENABLED", true),
				Format:       getEnv("BARCODE_FORMAT", "CODE128"),
				AutoGenerate: getEnvAsBool("BARCODE_AUTO_GENERATE", true),
			},
		},

		Logging: LoggingConfig{
			Level: getEnv("LOG_LEVEL", "info"),
			File: FileLoggingConfig{
				Enabled:  getEnvAsBool("LOG_TO_FILE", false),
				Filename: getEnv("LOG_FILENAME", "/app/logs/inventory-service.log"),
				MaxSize:  getEnvAsInt("LOG_MAX_SIZE", 10485760), // 10MB
				MaxFiles: getEnvAsInt("LOG_MAX_FILES", 5),
			},
		},

		Monitoring: MonitoringConfig{
			Enabled:     getEnvAsBool("MONITORING_ENABLED", true),
			MetricsPath: "/metrics",
			HealthPath:  "/health",
		},

		Pagination: PaginationConfig{
			DefaultLimit: getEnvAsInt("DEFAULT_PAGE_SIZE", 20),
			MaxLimit:     getEnvAsInt("MAX_PAGE_SIZE", 100),
		},
	}

	// Build database DSN
	config.Database.DSN = fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		config.Database.Host,
		config.Database.Port,
		config.Database.User,
		config.Database.Password,
		config.Database.Name,
		config.Database.SSLMode,
	)

	return config, nil
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func getEnvAsInt(key string, defaultValue int) int {
	if value := os.Getenv(key); value != "" {
		if intValue, err := strconv.Atoi(value); err == nil {
			return intValue
		}
	}
	return defaultValue
}

func getEnvAsBool(key string, defaultValue bool) bool {
	if value := os.Getenv(key); value != "" {
		if boolValue, err := strconv.ParseBool(value); err == nil {
			return boolValue
		}
	}
	return defaultValue
}
