package main

import (
	"context"
	"database/sql"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/go-redis/redis/v8"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"github.com/sirupsen/logrus"
)

type AuthService struct {
	router      *gin.Engine
	db          *sql.DB
	redisClient *redis.Client
	logger      *logrus.Logger
	config      *Config
	metrics     *Metrics
}

type Config struct {
	Port        string
	DatabaseURL string
	RedisURL    string
	JWTSecret   string
	Environment string
}

type Metrics struct {
	authAttempts  *prometheus.CounterVec
	activeTokens  prometheus.Gauge
	tokenDuration *prometheus.HistogramVec
}

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		logrus.Warn("No .env file found")
	}

	// Initialize logger
	logger := logrus.New()
	logger.SetFormatter(&logrus.JSONFormatter{})

	if os.Getenv("ENVIRONMENT") == "production" {
		logger.SetLevel(logrus.InfoLevel)
	} else {
		logger.SetLevel(logrus.DebugLevel)
	}

	// Load configuration
	config := &Config{
		Port:        getEnv("PORT", "3008"),
		DatabaseURL: getEnv("DATABASE_URL", "postgres://i3m_user:i3m_password@localhost:5432/i3m_platform?sslmode=disable"),
		RedisURL:    getEnv("REDIS_URL", "redis://localhost:6379"),
		JWTSecret:   getEnv("JWT_SECRET", "your-super-secret-jwt-key-here"),
		Environment: getEnv("ENVIRONMENT", "development"),
	}

	// Initialize database connection
	db, err := sql.Open("postgres", config.DatabaseURL)
	if err != nil {
		logger.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Close()

	// Test database connection
	if err := db.Ping(); err != nil {
		logger.Fatalf("Failed to ping database: %v", err)
	}
	logger.Info("Connected to PostgreSQL successfully")

	// Initialize Redis client
	opt, err := redis.ParseURL(config.RedisURL)
	if err != nil {
		logger.Fatalf("Failed to parse Redis URL: %v", err)
	}

	redisClient := redis.NewClient(opt)
	ctx := context.Background()

	// Test Redis connection
	if err := redisClient.Ping(ctx).Err(); err != nil {
		logger.Fatalf("Failed to connect to Redis: %v", err)
	}
	logger.Info("Connected to Redis successfully")

	// Initialize metrics
	metrics := initAuthMetrics()

	// Initialize Auth Service
	authService := &AuthService{
		db:          db,
		redisClient: redisClient,
		logger:      logger,
		config:      config,
		metrics:     metrics,
	}

	// Setup router
	authService.setupRouter()

	// Start server
	authService.start()
}

func (as *AuthService) setupRouter() {
	// Set Gin mode
	if as.config.Environment == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	as.router = gin.New()

	// Middlewares
	as.router.Use(gin.Recovery())
	as.router.Use(as.loggingMiddleware())
	as.router.Use(as.metricsMiddleware())
	as.router.Use(as.tenantMiddleware())

	// Health check endpoint
	as.router.GET("/health", as.healthCheck)
	as.router.GET("/metrics", gin.WrapH(promhttp.Handler()))

	// API routes
	v1 := as.router.Group("/api/v1/auth")
	{
		// Public routes
		v1.POST("/login", as.login)
		v1.POST("/register", as.register)
		v1.POST("/refresh", as.refreshToken)
		v1.POST("/forgot-password", as.forgotPassword)
		v1.POST("/reset-password", as.resetPassword)

		// Protected routes
		protected := v1.Group("/")
		protected.Use(as.authMiddleware())
		{
			protected.GET("/profile", as.getProfile)
			protected.PUT("/profile", as.updateProfile)
			protected.POST("/logout", as.logout)
			protected.POST("/change-password", as.changePassword)
			protected.GET("/sessions", as.getUserSessions)
			protected.DELETE("/sessions/:session_id", as.revokeSession)
		}

		// Admin routes
		admin := v1.Group("/admin")
		admin.Use(as.authMiddleware(), as.adminMiddleware())
		{
			admin.GET("/users", as.getUsers)
			admin.GET("/users/:id", as.getUserByIDHandler)
			admin.PUT("/users/:id/status", as.updateUserStatus)
			admin.GET("/sessions", as.getAllSessions)
			admin.DELETE("/sessions/:session_id", as.revokeSessionAdmin)
		}
	}
}

func (as *AuthService) start() {
	// Create HTTP server
	srv := &http.Server{
		Addr:    ":" + as.config.Port,
		Handler: as.router,
	}

	// Start server in a goroutine
	go func() {
		as.logger.Infof("Auth Service starting on port %s", as.config.Port)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			as.logger.Fatalf("Failed to start server: %v", err)
		}
	}()

	// Wait for interrupt signal to gracefully shutdown the server
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	as.logger.Info("Shutting down Auth Service...")

	// Give outstanding requests a deadline for completion
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Shutdown server
	if err := srv.Shutdown(ctx); err != nil {
		as.logger.Fatalf("Server forced to shutdown: %v", err)
	}

	// Close database connection
	if err := as.db.Close(); err != nil {
		as.logger.Errorf("Failed to close database connection: %v", err)
	}

	// Close Redis connection
	if err := as.redisClient.Close(); err != nil {
		as.logger.Errorf("Failed to close Redis connection: %v", err)
	}

	as.logger.Info("Auth Service stopped")
}

func initAuthMetrics() *Metrics {
	authAttempts := prometheus.NewCounterVec(
		prometheus.CounterOpts{
			Name: "auth_service_login_attempts_total",
			Help: "Total number of authentication attempts",
		},
		[]string{"tenant_id", "status", "method"},
	)

	activeTokens := prometheus.NewGauge(
		prometheus.GaugeOpts{
			Name: "auth_service_active_tokens",
			Help: "Number of active JWT tokens",
		},
	)

	tokenDuration := prometheus.NewHistogramVec(
		prometheus.HistogramOpts{
			Name:    "auth_service_token_duration_seconds",
			Help:    "Duration of token validity",
			Buckets: []float64{300, 900, 1800, 3600, 7200, 14400, 28800, 86400}, // 5min to 24h
		},
		[]string{"tenant_id", "token_type"},
	)

	// Register metrics
	prometheus.MustRegister(authAttempts)
	prometheus.MustRegister(activeTokens)
	prometheus.MustRegister(tokenDuration)

	return &Metrics{
		authAttempts:  authAttempts,
		activeTokens:  activeTokens,
		tokenDuration: tokenDuration,
	}
}

func getEnv(key, defaultValue string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return defaultValue
}

func (as *AuthService) healthCheck(c *gin.Context) {
	// Check database connection
	if err := as.db.Ping(); err != nil {
		c.JSON(http.StatusServiceUnavailable, gin.H{
			"status":    "unhealthy",
			"error":     "Database connection failed",
			"timestamp": time.Now().UTC().Format(time.RFC3339),
		})
		return
	}

	// Check Redis connection
	ctx := context.Background()
	if err := as.redisClient.Ping(ctx).Err(); err != nil {
		c.JSON(http.StatusServiceUnavailable, gin.H{
			"status":    "unhealthy",
			"error":     "Redis connection failed",
			"timestamp": time.Now().UTC().Format(time.RFC3339),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":    "healthy",
		"service":   "Auth Service",
		"version":   "1.0.0",
		"timestamp": time.Now().UTC().Format(time.RFC3339),
	})
}
