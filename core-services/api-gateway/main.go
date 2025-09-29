package main

import (
	"context"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/go-redis/redis/v8"
	"github.com/joho/godotenv"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"github.com/sirupsen/logrus"
)

type APIGateway struct {
	router      *gin.Engine
	redisClient *redis.Client
	logger      *logrus.Logger
	config      *Config
	metrics     *Metrics
}

type Config struct {
	Port        string
	RedisURL    string
	JWTSecret   string
	Environment string
	AuthService string
	UserService string
	RateLimit   int
	EnableCORS  bool
}

type Metrics struct {
	requestsTotal     *prometheus.CounterVec
	requestDuration   *prometheus.HistogramVec
	activeConnections prometheus.Gauge
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
		Port:        getEnv("PORT", "3004"),
		RedisURL:    getEnv("REDIS_URL", "redis://localhost:6379"),
		JWTSecret:   getEnv("JWT_SECRET", "your-super-secret-jwt-key-here"),
		Environment: getEnv("ENVIRONMENT", "development"),
		AuthService: getEnv("AUTH_SERVICE", "http://localhost:3008"),
		UserService: getEnv("USER_SERVICE", "http://localhost:3009"),
		RateLimit:   60, // requests per minute
		EnableCORS:  true,
	}

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
	metrics := initMetrics()

	// Initialize API Gateway
	gateway := &APIGateway{
		redisClient: redisClient,
		logger:      logger,
		config:      config,
		metrics:     metrics,
	}

	// Setup router
	gateway.setupRouter()

	// Start server
	gateway.start()
}

func (gw *APIGateway) setupRouter() {
	// Set Gin mode
	if gw.config.Environment == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	gw.router = gin.New()

	// Middlewares
	gw.router.Use(gin.Recovery())
	gw.router.Use(gw.loggingMiddleware())
	gw.router.Use(gw.metricsMiddleware())

	if gw.config.EnableCORS {
		gw.router.Use(cors.New(cors.Config{
			AllowOrigins:     []string{"*"}, // Configure properly for production
			AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"},
			AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization", "X-Tenant-ID"},
			ExposeHeaders:    []string{"Content-Length"},
			AllowCredentials: true,
			MaxAge:           12 * time.Hour,
		}))
	}

	// Health check endpoint
	gw.router.GET("/health", gw.healthCheck)
	gw.router.GET("/metrics", gin.WrapH(promhttp.Handler()))

	// API routes with versioning
	v1 := gw.router.Group("/api/v1")
	{
		// Authentication routes (proxy to auth service)
		auth := v1.Group("/auth")
		{
			auth.POST("/login", gw.rateLimitMiddleware(), gw.proxyToAuthService)
			auth.POST("/register", gw.rateLimitMiddleware(), gw.proxyToAuthService)
			auth.POST("/logout", gw.authMiddleware(), gw.proxyToAuthService)
			auth.POST("/refresh", gw.rateLimitMiddleware(), gw.proxyToAuthService)
			auth.GET("/profile", gw.authMiddleware(), gw.proxyToAuthService)

			// Multi-group management routes - public for testing
			auth.Any("/groups/*path", gw.proxyToAuthService)

			// Primary group management routes
			auth.Any("/primary-group/*path", gw.proxyToAuthService)

			// Primary role management routes
			auth.Any("/primary-role/*path", gw.proxyToAuthService)
		}

		// User routes (proxy to user service)
		users := v1.Group("/users")
		users.Use(gw.authMiddleware())
		{
			users.GET("/", gw.proxyToUserService)
			users.GET("/:id", gw.proxyToUserService)
			users.PUT("/:id", gw.proxyToUserService)
			users.DELETE("/:id", gw.proxyToUserService)
		}

		// Protected routes that require authentication
		protected := v1.Group("/")
		protected.Use(gw.authMiddleware())
		{
			// Core ERP Services routes
			protected.Any("/core/commerce/*path", gw.proxyToService("COMMERCE_SERVICE", "http://localhost:3014"))
			protected.Any("/core/cms/*path", gw.proxyToService("CMS_SERVICE", "http://localhost:3021"))
			protected.Any("/core/finance/*path", gw.proxyToService("FINANCE_SERVICE", "http://localhost:3028"))
			protected.Any("/core/hrm/*path", gw.proxyToService("HRM_SERVICE", "http://localhost:3029"))
			protected.Any("/core/inventory/*path", gw.proxyToService("INVENTORY_SERVICE", "http://localhost:3030"))
			protected.Any("/core/procurement/*path", gw.proxyToService("PROCUREMENT_SERVICE", "http://localhost:3031"))
			protected.Any("/core/crm/*path", gw.proxyToService("CRM_SERVICE", "http://localhost:3033"))

			// Industry Services routes
			protected.Any("/industry/ecommerce/*path", gw.proxyToService("INDUSTRY_ECOMMERCE_SERVICE", "http://localhost:3014"))
			protected.Any("/industry/retail/*path", gw.proxyToService("RETAIL_SERVICE", "http://localhost:3036"))
			protected.Any("/industry/restaurant/*path", gw.proxyToService("RESTAURANT_SERVICE", "http://localhost:3037"))
			protected.Any("/industry/healthcare/*path", gw.proxyToService("HEALTHCARE_SERVICE", "http://localhost:3034"))
			protected.Any("/industry/agriculture/*path", gw.proxyToService("AGRICULTURE_SERVICE", "http://localhost:3035"))
			protected.Any("/industry/manufacturing/*path", gw.proxyToService("MANUFACTURING_SERVICE", "http://localhost:3038"))

			// Analytics Services routes
			protected.Any("/ai/*path", gw.proxyToService("AI_SERVICE", "http://localhost:3017"))
			protected.Any("/ml-pipeline/*path", gw.proxyToService("ML_PIPELINE_SERVICE", "http://localhost:3018"))
			protected.Any("/analytics/*path", gw.proxyToService("ANALYTICS_SERVICE", "http://localhost:3019"))
			protected.Any("/user-analytics/*path", gw.proxyToService("USER_ANALYTICS_SERVICE", "http://localhost:3020"))

			// Legacy Content Services routes (deprecated - use /core/cms)
			protected.Any("/content/*path", gw.proxyToService("CONTENT_SERVICE", "http://localhost:3021"))
			protected.Any("/media/*path", gw.proxyToService("MEDIA_SERVICE", "http://localhost:3022"))
			protected.Any("/metadata/*path", gw.proxyToService("METADATA_SERVICE", "http://localhost:3023"))

			// Legacy Ecommerce route (deprecated - use /core/commerce or /industry/ecommerce)
			protected.Any("/ecommerce/*path", gw.proxyToService("ECOMMERCE_SERVICE", "http://localhost:3032"))

			// Infrastructure Services routes
			protected.Any("/security/*path", gw.proxyToService("SECURITY_SERVICE", "http://localhost:3040"))
			protected.Any("/observability/*path", gw.proxyToService("OBSERVABILITY_SERVICE", "http://localhost:3041"))
			protected.Any("/cost-optimization/*path", gw.proxyToService("COST_OPTIMIZATION_SERVICE", "http://localhost:3042"))
			protected.Any("/load-balancer/*path", gw.proxyToService("LOAD_BALANCER_SERVICE", "http://localhost:3043"))
			protected.Any("/secrets/*path", gw.proxyToService("SECRETS_MANAGEMENT_SERVICE", "http://localhost:3044"))

			// Integration Services routes
			protected.Any("/api-docs/*path", gw.proxyToService("API_DOCUMENTATION_SERVICE", "http://localhost:3050"))
			protected.Any("/integration/*path", gw.proxyToService("INTEGRATION_SERVICE", "http://localhost:3051"))
			protected.Any("/currency/*path", gw.proxyToService("CURRENCY_EXCHANGE_SERVICE", "http://localhost:3052"))

			// Marketplace Services routes
			protected.Any("/templates/*path", gw.proxyToService("TEMPLATE_MARKETPLACE", "http://localhost:3060"))
			protected.Any("/template-install/*path", gw.proxyToService("TEMPLATE_INSTALLATION", "http://localhost:3061"))
			protected.Any("/template-preview/*path", gw.proxyToService("TEMPLATE_PREVIEW", "http://localhost:3062"))

			// Shared Services routes
			protected.Any("/notifications/*path", gw.proxyToService("NOTIFICATION_SERVICE", "http://localhost:3070"))
			protected.Any("/workflow/*path", gw.proxyToService("WORKFLOW_SERVICE", "http://localhost:3071"))
			protected.Any("/billing/*path", gw.proxyToService("BILLING_SERVICE", "http://localhost:3072"))
		}

		// Public routes (no authentication required)
		public := v1.Group("/public")
		{
			public.Any("/templates/*path", gw.proxyToService("TEMPLATE_MARKETPLACE", "http://localhost:3060"))
			public.Any("/content/*path", gw.proxyToService("CONTENT_SERVICE", "http://localhost:3021"))
			public.Any("/currency/*path", gw.proxyToService("CURRENCY_EXCHANGE_SERVICE", "http://localhost:3052"))
			public.Any("/api-docs/*path", gw.proxyToService("API_DOCUMENTATION_SERVICE", "http://localhost:3050"))
		}
	}

	// Catch-all route for undefined endpoints
	gw.router.NoRoute(func(c *gin.Context) {
		c.JSON(http.StatusNotFound, gin.H{
			"error":   "endpoint not found",
			"path":    c.Request.URL.Path,
			"method":  c.Request.Method,
			"message": "The requested endpoint does not exist",
		})
	})
}

func (gw *APIGateway) start() {
	// Create HTTP server
	srv := &http.Server{
		Addr:    ":" + gw.config.Port,
		Handler: gw.router,
	}

	// Start server in a goroutine
	go func() {
		gw.logger.Infof("API Gateway starting on port %s", gw.config.Port)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			gw.logger.Fatalf("Failed to start server: %v", err)
		}
	}()

	// Wait for interrupt signal to gracefully shutdown the server
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	gw.logger.Info("Shutting down API Gateway...")

	// Give outstanding requests a deadline for completion
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Shutdown server
	if err := srv.Shutdown(ctx); err != nil {
		gw.logger.Fatalf("Server forced to shutdown: %v", err)
	}

	// Close Redis connection
	if err := gw.redisClient.Close(); err != nil {
		gw.logger.Errorf("Failed to close Redis connection: %v", err)
	}

	gw.logger.Info("API Gateway stopped")
}

func initMetrics() *Metrics {
	requestsTotal := prometheus.NewCounterVec(
		prometheus.CounterOpts{
			Name: "api_gateway_requests_total",
			Help: "Total number of requests processed by the API Gateway",
		},
		[]string{"method", "endpoint", "status", "tenant_id"},
	)

	requestDuration := prometheus.NewHistogramVec(
		prometheus.HistogramOpts{
			Name:    "api_gateway_request_duration_seconds",
			Help:    "Request duration in seconds",
			Buckets: prometheus.DefBuckets,
		},
		[]string{"method", "endpoint", "tenant_id"},
	)

	activeConnections := prometheus.NewGauge(
		prometheus.GaugeOpts{
			Name: "api_gateway_active_connections",
			Help: "Number of active connections",
		},
	)

	// Register metrics
	prometheus.MustRegister(requestsTotal)
	prometheus.MustRegister(requestDuration)
	prometheus.MustRegister(activeConnections)

	return &Metrics{
		requestsTotal:     requestsTotal,
		requestDuration:   requestDuration,
		activeConnections: activeConnections,
	}
}

func getEnv(key, defaultValue string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return defaultValue
}

func (gw *APIGateway) healthCheck(c *gin.Context) {
	// Check Redis connection
	ctx := context.Background()
	if err := gw.redisClient.Ping(ctx).Err(); err != nil {
		c.JSON(http.StatusServiceUnavailable, gin.H{
			"status":    "unhealthy",
			"error":     "Redis connection failed",
			"timestamp": time.Now().UTC().Format(time.RFC3339),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":    "healthy",
		"service":   "API Gateway",
		"version":   "1.0.0",
		"timestamp": time.Now().UTC().Format(time.RFC3339),
		"uptime":    time.Since(time.Now()).String(), // This would be calculated from start time
	})
}
