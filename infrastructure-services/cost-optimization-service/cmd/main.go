package main

import (
	"context"
	"database/sql"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"github.com/sirupsen/logrus"

	"cost-optimization-service/internal/config"
	"cost-optimization-service/internal/handlers"
	"cost-optimization-service/internal/services"
)

type CostOptimizationService struct {
	router   *gin.Engine
	db       *sql.DB
	logger   *logrus.Logger
	config   *config.Config
	services *services.Services
}

func main() {
	logger := logrus.New()
	logger.SetFormatter(&logrus.JSONFormatter{})

	if os.Getenv("ENVIRONMENT") == "production" {
		logger.SetLevel(logrus.InfoLevel)
	} else {
		logger.SetLevel(logrus.DebugLevel)
	}

	cfg := config.Load()

	db, err := sql.Open("postgres", cfg.DatabaseURL)
	if err != nil {
		logger.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Close()

	if err := db.Ping(); err != nil {
		logger.Fatalf("Failed to ping database: %v", err)
	}
	logger.Info("Connected to PostgreSQL successfully")

	serviceInstances := services.New(db, logger, cfg)

	costSvc := &CostOptimizationService{
		db:       db,
		logger:   logger,
		config:   cfg,
		services: serviceInstances,
	}

	costSvc.setupRouter()
	costSvc.start()
}

func (s *CostOptimizationService) setupRouter() {
	if s.config.Environment == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	s.router = gin.New()
	s.router.Use(gin.Recovery())
	s.router.Use(gin.Logger())

	s.router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization", "X-Tenant-ID"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	s.router.GET("/health", s.healthCheck)
	s.router.GET("/metrics", gin.WrapH(promhttp.Handler()))

	v1 := s.router.Group("/api/v1/cost-optimization")
	{
		// Cost analysis
		v1.GET("/analysis", handlers.GetCostAnalysis(s.services))
		v1.POST("/analysis/generate", handlers.GenerateCostAnalysis(s.services))

		// Recommendations
		v1.GET("/recommendations", handlers.GetRecommendations(s.services))
		v1.POST("/recommendations/:id/apply", handlers.ApplyRecommendation(s.services))

		// Budgets and forecasting
		v1.GET("/budgets", handlers.GetBudgets(s.services))
		v1.POST("/budgets", handlers.CreateBudget(s.services))
		v1.PUT("/budgets/:id", handlers.UpdateBudget(s.services))
		v1.DELETE("/budgets/:id", handlers.DeleteBudget(s.services))

		// Cost forecasting
		v1.GET("/forecast", handlers.GetCostForecast(s.services))
		v1.POST("/forecast/generate", handlers.GenerateForecast(s.services))

		// Resource optimization
		v1.GET("/resources", handlers.GetResourceUsage(s.services))
		v1.POST("/resources/optimize", handlers.OptimizeResources(s.services))

		// Cost alerts
		v1.GET("/alerts", handlers.GetCostAlerts(s.services))
		v1.POST("/alerts", handlers.CreateCostAlert(s.services))
		v1.PUT("/alerts/:id", handlers.UpdateCostAlert(s.services))

		// Reports
		v1.GET("/reports", handlers.GetCostReports(s.services))
		v1.POST("/reports/generate", handlers.GenerateReport(s.services))

		// Savings tracking
		v1.GET("/savings", handlers.GetSavings(s.services))
		v1.POST("/savings/track", handlers.TrackSavings(s.services))
	}
}

func (s *CostOptimizationService) start() {
	srv := &http.Server{
		Addr:    ":" + s.config.Port,
		Handler: s.router,
	}

	go func() {
		s.logger.Infof("Cost Optimization Service starting on port %s", s.config.Port)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			s.logger.Fatalf("Failed to start server: %v", err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	s.logger.Info("Shutting down Cost Optimization Service...")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		s.logger.Fatalf("Server forced to shutdown: %v", err)
	}

	s.logger.Info("Cost Optimization Service stopped")
}

func (s *CostOptimizationService) healthCheck(c *gin.Context) {
	if err := s.db.Ping(); err != nil {
		c.JSON(http.StatusServiceUnavailable, gin.H{
			"status":    "unhealthy",
			"error":     "Database connection failed",
			"timestamp": time.Now().UTC().Format(time.RFC3339),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":    "healthy",
		"service":   "Cost Optimization Service",
		"version":   "1.0.0",
		"timestamp": time.Now().UTC().Format(time.RFC3339),
	})
}
