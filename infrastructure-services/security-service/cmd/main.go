package main

import (
	"context"
	"database/sql"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"github.com/redis/go-redis/v9"
	"github.com/sirupsen/logrus"
	"golang.org/x/time/rate"

	"security-service/internal/config"
	"security-service/internal/handlers"
	"security-service/internal/middleware"
	"security-service/internal/services"
)

type SecurityService struct {
	router      *gin.Engine
	db          *sql.DB
	redisClient *redis.Client
	logger      *logrus.Logger
	config      *config.Config
	services    *services.Services
	metrics     *Metrics
}

type Metrics struct {
	requestsTotal   *prometheus.CounterVec
	requestDuration *prometheus.HistogramVec
	threatsDetected prometheus.Counter
	encryptionOps   prometheus.Counter
	authAttempts    *prometheus.CounterVec
}

func main() {
	// Initialize logger
	logger := logrus.New()
	logger.SetFormatter(&logrus.JSONFormatter{})

	if os.Getenv("ENVIRONMENT") == "production" {
		logger.SetLevel(logrus.InfoLevel)
	} else {
		logger.SetLevel(logrus.DebugLevel)
	}

	// Load configuration
	cfg := config.Load()

	// Initialize database
	db, err := sql.Open("postgres", cfg.DatabaseURL)
	if err != nil {
		logger.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Close()

	if err := db.Ping(); err != nil {
		logger.Fatalf("Failed to ping database: %v", err)
	}
	logger.Info("Connected to PostgreSQL successfully")

	// Initialize Redis
	redisClient := redis.NewClient(&redis.Options{
		Addr:     fmt.Sprintf("%s:%s", cfg.RedisHost, cfg.RedisPort),
		Password: cfg.RedisPassword,
		DB:       cfg.RedisDB,
	})

	ctx := context.Background()
	if err := redisClient.Ping(ctx).Err(); err != nil {
		logger.Fatalf("Failed to connect to Redis: %v", err)
	}
	logger.Info("Connected to Redis successfully")

	// Initialize metrics
	metrics := initMetrics()

	// Initialize services
	serviceInstances := services.New(db, redisClient, logger, cfg)

	// Initialize security service
	securitySvc := &SecurityService{
		db:          db,
		redisClient: redisClient,
		logger:      logger,
		config:      cfg,
		services:    serviceInstances,
		metrics:     metrics,
	}

	// Setup router
	securitySvc.setupRouter()

	// Start server
	securitySvc.start()
}

func (s *SecurityService) setupRouter() {
	if s.config.Environment == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	s.router = gin.New()

	// Middlewares
	s.router.Use(gin.Recovery())
	s.router.Use(s.loggingMiddleware())
	s.router.Use(s.metricsMiddleware())
	s.router.Use(middleware.RateLimiter(rate.Limit(100), 200)) // 100 req/sec, burst 200

	// CORS
	s.router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization", "X-Tenant-ID"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Health and metrics endpoints
	s.router.GET("/health", s.healthCheck)
	s.router.GET("/metrics", gin.WrapH(promhttp.Handler()))

	// API routes
	v1 := s.router.Group("/api/v1/security")
	{
		// RBAC endpoints
		rbac := v1.Group("/rbac")
		{
			rbac.POST("/roles", handlers.CreateRole(s.services))
			rbac.GET("/roles", handlers.GetRoles(s.services))
			rbac.PUT("/roles/:id", handlers.UpdateRole(s.services))
			rbac.DELETE("/roles/:id", handlers.DeleteRole(s.services))
			rbac.POST("/roles/:id/permissions", handlers.AssignPermission(s.services))
			rbac.DELETE("/roles/:id/permissions/:permissionId", handlers.RevokePermission(s.services))
		}

		// Permission management
		permissions := v1.Group("/permissions")
		{
			permissions.POST("/", handlers.CreatePermission(s.services))
			permissions.GET("/", handlers.GetPermissions(s.services))
			permissions.PUT("/:id", handlers.UpdatePermission(s.services))
			permissions.DELETE("/:id", handlers.DeletePermission(s.services))
		}

		// User role assignments
		userRoles := v1.Group("/users")
		{
			userRoles.POST("/:userId/roles", handlers.AssignUserRole(s.services))
			userRoles.GET("/:userId/roles", handlers.GetUserRoles(s.services))
			userRoles.DELETE("/:userId/roles/:roleId", handlers.RevokeUserRole(s.services))
			userRoles.GET("/:userId/permissions", handlers.GetUserPermissions(s.services))
		}

		// Encryption services
		encryption := v1.Group("/encryption")
		{
			encryption.POST("/encrypt", handlers.EncryptData(s.services))
			encryption.POST("/decrypt", handlers.DecryptData(s.services))
			encryption.POST("/hash", handlers.HashData(s.services))
			encryption.POST("/verify", handlers.VerifyHash(s.services))
		}

		// Threat detection
		threats := v1.Group("/threats")
		{
			threats.POST("/scan", handlers.ScanForThreats(s.services))
			threats.GET("/reports", handlers.GetThreatReports(s.services))
			threats.POST("/alerts", handlers.CreateThreatAlert(s.services))
			threats.GET("/alerts", handlers.GetThreatAlerts(s.services))
		}

		// Security audit
		audit := v1.Group("/audit")
		{
			audit.POST("/logs", handlers.CreateAuditLog(s.services))
			audit.GET("/logs", handlers.GetAuditLogs(s.services))
			audit.GET("/compliance", handlers.GetComplianceReport(s.services))
		}

		// Access control
		access := v1.Group("/access")
		{
			access.POST("/check", handlers.CheckAccess(s.services))
			access.POST("/policies", handlers.CreateAccessPolicy(s.services))
			access.GET("/policies", handlers.GetAccessPolicies(s.services))
			access.PUT("/policies/:id", handlers.UpdateAccessPolicy(s.services))
			access.DELETE("/policies/:id", handlers.DeleteAccessPolicy(s.services))
		}
	}

	// Public endpoints (no authentication required)
	public := s.router.Group("/api/v1/public/security")
	{
		public.POST("/validate-token", handlers.ValidateToken(s.services))
		public.GET("/security-headers", handlers.GetSecurityHeaders(s.services))
	}
}

func (s *SecurityService) start() {
	srv := &http.Server{
		Addr:    ":" + s.config.Port,
		Handler: s.router,
	}

	go func() {
		s.logger.Infof("Security Service starting on port %s", s.config.Port)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			s.logger.Fatalf("Failed to start server: %v", err)
		}
	}()

	// Wait for interrupt signal
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	s.logger.Info("Shutting down Security Service...")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		s.logger.Fatalf("Server forced to shutdown: %v", err)
	}

	s.logger.Info("Security Service stopped")
}

func (s *SecurityService) healthCheck(c *gin.Context) {
	// Check database connection
	if err := s.db.Ping(); err != nil {
		c.JSON(http.StatusServiceUnavailable, gin.H{
			"status":    "unhealthy",
			"error":     "Database connection failed",
			"timestamp": time.Now().UTC().Format(time.RFC3339),
		})
		return
	}

	// Check Redis connection
	ctx := context.Background()
	if err := s.redisClient.Ping(ctx).Err(); err != nil {
		c.JSON(http.StatusServiceUnavailable, gin.H{
			"status":    "unhealthy",
			"error":     "Redis connection failed",
			"timestamp": time.Now().UTC().Format(time.RFC3339),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":    "healthy",
		"service":   "Security Service",
		"version":   "1.0.0",
		"timestamp": time.Now().UTC().Format(time.RFC3339),
	})
}

func (s *SecurityService) loggingMiddleware() gin.HandlerFunc {
	return gin.LoggerWithFormatter(func(param gin.LogFormatterParams) string {
		return fmt.Sprintf(`{"time":"%s","method":"%s","path":"%s","status":%d,"latency":"%s","ip":"%s","user_agent":"%s"}%s`,
			param.TimeStamp.Format(time.RFC3339),
			param.Method,
			param.Path,
			param.StatusCode,
			param.Latency,
			param.ClientIP,
			param.Request.UserAgent(),
			"\n",
		)
	})
}

func (s *SecurityService) metricsMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()

		tenantID := c.GetHeader("X-Tenant-ID")
		if tenantID == "" {
			tenantID = "unknown"
		}

		c.Next()

		duration := time.Since(start).Seconds()
		s.metrics.requestsTotal.WithLabelValues(
			c.Request.Method,
			c.FullPath(),
			fmt.Sprintf("%d", c.Writer.Status()),
			tenantID,
		).Inc()

		s.metrics.requestDuration.WithLabelValues(
			c.Request.Method,
			c.FullPath(),
			tenantID,
		).Observe(duration)
	}
}

func initMetrics() *Metrics {
	requestsTotal := prometheus.NewCounterVec(
		prometheus.CounterOpts{
			Name: "security_service_requests_total",
			Help: "Total number of requests processed by the Security Service",
		},
		[]string{"method", "endpoint", "status", "tenant_id"},
	)

	requestDuration := prometheus.NewHistogramVec(
		prometheus.HistogramOpts{
			Name:    "security_service_request_duration_seconds",
			Help:    "Request duration in seconds",
			Buckets: prometheus.DefBuckets,
		},
		[]string{"method", "endpoint", "tenant_id"},
	)

	threatsDetected := prometheus.NewCounter(
		prometheus.CounterOpts{
			Name: "security_threats_detected_total",
			Help: "Total number of security threats detected",
		},
	)

	encryptionOps := prometheus.NewCounter(
		prometheus.CounterOpts{
			Name: "security_encryption_operations_total",
			Help: "Total number of encryption operations performed",
		},
	)

	authAttempts := prometheus.NewCounterVec(
		prometheus.CounterOpts{
			Name: "security_auth_attempts_total",
			Help: "Total number of authentication attempts",
		},
		[]string{"result", "tenant_id"},
	)

	prometheus.MustRegister(requestsTotal, requestDuration, threatsDetected, encryptionOps, authAttempts)

	return &Metrics{
		requestsTotal:   requestsTotal,
		requestDuration: requestDuration,
		threatsDetected: threatsDetected,
		encryptionOps:   encryptionOps,
		authAttempts:    authAttempts,
	}
}
