package main

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"github.com/redis/go-redis/v9"
	"github.com/sirupsen/logrus"

	"github.com/i3m/load-balancer-service/internal/config"
	"github.com/i3m/load-balancer-service/internal/handlers"
	"github.com/i3m/load-balancer-service/internal/services"
)

type LoadBalancerService struct {
	router      *gin.Engine
	redisClient *redis.Client
	logger      *logrus.Logger
	config      *config.Config
	services    *services.Services
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

	serviceInstances := services.New(redisClient, logger, cfg)

	lbSvc := &LoadBalancerService{
		redisClient: redisClient,
		logger:      logger,
		config:      cfg,
		services:    serviceInstances,
	}

	lbSvc.setupRouter()
	lbSvc.start()
}

func (s *LoadBalancerService) setupRouter() {
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

	v1 := s.router.Group("/api/v1/load-balancer")
	{
		// Service discovery and registration
		v1.POST("/services/register", handlers.RegisterService(s.services))
		v1.DELETE("/services/:id", handlers.DeregisterService(s.services))
		v1.GET("/services", handlers.GetServices(s.services))
		v1.GET("/services/:id", handlers.GetService(s.services))

		// Health checks
		v1.GET("/services/:id/health", handlers.CheckServiceHealth(s.services))
		v1.POST("/services/:id/health", handlers.UpdateServiceHealth(s.services))

		// Load balancing configuration
		v1.GET("/config", handlers.GetLoadBalancerConfig(s.services))
		v1.PUT("/config", handlers.UpdateLoadBalancerConfig(s.services))

		// Traffic distribution
		v1.GET("/traffic/stats", handlers.GetTrafficStats(s.services))
		v1.POST("/traffic/distribute", handlers.DistributeTraffic(s.services))

		// Circuit breaker
		v1.GET("/circuit-breaker", handlers.GetCircuitBreakerStatus(s.services))
		v1.POST("/circuit-breaker/:serviceId/open", handlers.OpenCircuitBreaker(s.services))
		v1.POST("/circuit-breaker/:serviceId/close", handlers.CloseCircuitBreaker(s.services))

		// Upstream management
		v1.GET("/upstreams", handlers.GetUpstreams(s.services))
		v1.POST("/upstreams", handlers.CreateUpstream(s.services))
		v1.PUT("/upstreams/:id", handlers.UpdateUpstream(s.services))
		v1.DELETE("/upstreams/:id", handlers.DeleteUpstream(s.services))

		// Metrics and monitoring
		v1.GET("/metrics/services", handlers.GetServiceMetrics(s.services))
		v1.GET("/metrics/requests", handlers.GetRequestMetrics(s.services))
	}

	// Proxy endpoints - these handle actual traffic routing
	proxy := s.router.Group("/proxy")
	{
		proxy.Any("/*path", handlers.ProxyRequest(s.services))
	}
}

func (s *LoadBalancerService) start() {
	srv := &http.Server{
		Addr:    ":" + s.config.Port,
		Handler: s.router,
	}

	go func() {
		s.logger.Infof("Load Balancer Service starting on port %s", s.config.Port)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			s.logger.Fatalf("Failed to start server: %v", err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	s.logger.Info("Shutting down Load Balancer Service...")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		s.logger.Fatalf("Server forced to shutdown: %v", err)
	}

	s.logger.Info("Load Balancer Service stopped")
}

func (s *LoadBalancerService) healthCheck(c *gin.Context) {
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
		"service":   "Load Balancer Service",
		"version":   "1.0.0",
		"timestamp": time.Now().UTC().Format(time.RFC3339),
	})
}
