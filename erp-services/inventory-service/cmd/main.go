package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-contrib/gzip"
	"github.com/gin-gonic/gin"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"github.com/sirupsen/logrus"

	"inventory-service/internal/config"
	"inventory-service/internal/database"
	"inventory-service/internal/handlers"
	"inventory-service/internal/middleware"
	"inventory-service/internal/services"
)

func main() {
	// Load configuration
	cfg, err := config.Load()
	if err != nil {
		log.Fatal("Failed to load configuration:", err)
	}

	// Setup logging
	setupLogging(cfg)

	// Initialize database
	db := database.NewDatabase(cfg)
	if err := db.Connect(); err != nil {
		logrus.Fatal("Failed to connect to database:", err)
	}
	defer func() {
		if err := db.Disconnect(); err != nil {
			logrus.Error("Failed to disconnect from database:", err)
		}
	}()

	// Run migrations
	if err := db.Migrate(); err != nil {
		logrus.Fatal("Failed to run database migrations:", err)
	}

	// Initialize services
	productService := services.NewProductService(db.DB)

	// Initialize handlers
	healthHandler := handlers.NewHealthHandler(cfg, db)
	productHandler := handlers.NewProductHandler(cfg, productService)

	// Setup router
	router := setupRouter(cfg, healthHandler, productHandler)

	// Create HTTP server
	server := &http.Server{
		Addr:    ":" + cfg.Port,
		Handler: router,
	}

	// Start server in a goroutine
	go func() {
		logrus.Infof("Starting %s on port %s", cfg.Service.Name, cfg.Port)
		logrus.Infof("Environment: %s", cfg.Env)
		logrus.Infof("Health check: http://localhost:%s%s", cfg.Port, cfg.Monitoring.HealthPath)

		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			logrus.Fatal("Failed to start server:", err)
		}
	}()

	// Wait for interrupt signal to gracefully shutdown the server
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	logrus.Info("Shutting down server...")

	// Graceful shutdown
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	if err := server.Shutdown(ctx); err != nil {
		logrus.Fatal("Server forced to shutdown:", err)
	}

	logrus.Info("Server exited")
}

func setupLogging(cfg *config.Config) {
	// Set log level
	level, err := logrus.ParseLevel(cfg.Logging.Level)
	if err != nil {
		logrus.Warn("Invalid log level, using info")
		level = logrus.InfoLevel
	}
	logrus.SetLevel(level)

	// Set log format
	if cfg.Env == "production" {
		logrus.SetFormatter(&logrus.JSONFormatter{})
	} else {
		logrus.SetFormatter(&logrus.TextFormatter{
			FullTimestamp: true,
		})
	}

	// Set output to file if enabled
	if cfg.Logging.File.Enabled {
		if file, err := os.OpenFile(cfg.Logging.File.Filename, os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666); err == nil {
			logrus.SetOutput(file)
		} else {
			logrus.Warn("Failed to open log file, using stdout")
		}
	}
}

func setupRouter(cfg *config.Config, healthHandler *handlers.HealthHandler, productHandler *handlers.ProductHandler) *gin.Engine {
	// Set gin mode
	if cfg.Env == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	router := gin.New()

	// Middleware
	router.Use(gin.Logger())
	router.Use(gin.Recovery())
	router.Use(gzip.Gzip(gzip.DefaultCompression))

	// CORS configuration
	corsConfig := cors.Config{
		AllowOrigins:     cfg.CORS.AllowedOrigins,
		AllowMethods:     cfg.CORS.AllowedMethods,
		AllowHeaders:     cfg.CORS.AllowedHeaders,
		AllowCredentials: cfg.CORS.AllowCredentials,
		MaxAge:           12 * time.Hour,
	}
	router.Use(cors.New(corsConfig))

	// Rate limiting middleware (placeholder)
	// router.Use(middleware.RateLimit(cfg))

	// Health endpoints (no auth required)
	router.GET("/health", healthHandler.HealthCheck)
	router.GET("/health/ready", healthHandler.ReadinessCheck)
	router.GET("/health/live", healthHandler.LivenessCheck)

	// Metrics endpoint
	router.GET("/metrics", gin.WrapH(promhttp.Handler()))

	// Root endpoint
	router.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"service":     cfg.Service.Name,
			"version":     cfg.Service.Version,
			"description": cfg.Service.Description,
			"status":      "running",
			"timestamp":   time.Now().UTC().Format(time.RFC3339),
		})
	})

	// API routes with authentication
	api := router.Group("/api/v1")
	api.Use(middleware.AuthMiddleware(cfg))
	api.Use(middleware.TenantMiddleware())
	{
		// Products routes
		products := api.Group("/products")
		{
			products.GET("", productHandler.GetProducts)
			products.GET("/:id", productHandler.GetProduct)
			products.POST("", productHandler.CreateProduct)
			products.PUT("/:id", productHandler.UpdateProduct)
			products.DELETE("/:id", productHandler.DeleteProduct)
		}

		// Stock routes (placeholder)
		stock := api.Group("/stock")
		{
			stock.GET("", func(c *gin.Context) {
				c.JSON(http.StatusOK, gin.H{
					"success": true,
					"message": "Stock endpoints - Coming soon",
					"data":    []interface{}{},
				})
			})
		}

		// Warehouses routes (placeholder)
		warehouses := api.Group("/warehouses")
		{
			warehouses.GET("", func(c *gin.Context) {
				c.JSON(http.StatusOK, gin.H{
					"success": true,
					"message": "Warehouses endpoints - Coming soon",
					"data":    []interface{}{},
				})
			})
		}

		// Purchase orders routes (placeholder)
		purchaseOrders := api.Group("/purchase-orders")
		{
			purchaseOrders.GET("", func(c *gin.Context) {
				c.JSON(http.StatusOK, gin.H{
					"success": true,
					"message": "Purchase Orders endpoints - Coming soon",
					"data":    []interface{}{},
				})
			})
		}
	}

	return router
}
