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
	vault "github.com/hashicorp/vault/api"
	_ "github.com/lib/pq"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"github.com/sirupsen/logrus"

	"secrets-management-service/internal/config"
	"secrets-management-service/internal/handlers"
	"secrets-management-service/internal/services"
)

type SecretsManagementService struct {
	router      *gin.Engine
	db          *sql.DB
	vaultClient *vault.Client
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

	// Initialize Vault client (disabled)
	var vaultClient *vault.Client
	if cfg.VaultAddress != "" {
		vaultConfig := vault.DefaultConfig()
		vaultConfig.Address = cfg.VaultAddress

		var err error
		vaultClient, err = vault.NewClient(vaultConfig)
		if err != nil {
			logger.Warnf("Failed to create Vault client: %v", err)
			vaultClient = nil
		} else {
			if cfg.VaultToken != "" {
				vaultClient.SetToken(cfg.VaultToken)
			}
			logger.Info("Connected to HashiCorp Vault successfully")
		}
	} else {
		logger.Info("Vault disabled - running without Vault integration")
	}

	serviceInstances := services.New(db, vaultClient, logger, cfg)

	secretsSvc := &SecretsManagementService{
		db:          db,
		vaultClient: vaultClient,
		logger:      logger,
		config:      cfg,
		services:    serviceInstances,
	}

	secretsSvc.setupRouter()
	secretsSvc.start()
}

func (s *SecretsManagementService) setupRouter() {
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

	v1 := s.router.Group("/api/v1/secrets")
	{
		// Secret management
		v1.POST("/", handlers.CreateSecret(s.services))
		v1.GET("/:path", handlers.GetSecret(s.services))
		v1.PUT("/:path", handlers.UpdateSecret(s.services))
		v1.DELETE("/:path", handlers.DeleteSecret(s.services))
		v1.GET("/", handlers.ListSecrets(s.services))

		// Secret versions
		v1.GET("/:path/versions", handlers.GetSecretVersions(s.services))
		v1.GET("/:path/versions/:version", handlers.GetSecretVersion(s.services))
		v1.DELETE("/:path/versions/:version", handlers.DeleteSecretVersion(s.services))

		// Access control
		v1.POST("/policies", handlers.CreatePolicy(s.services))
		v1.GET("/policies", handlers.GetPolicies(s.services))
		v1.PUT("/policies/:name", handlers.UpdatePolicy(s.services))
		v1.DELETE("/policies/:name", handlers.DeletePolicy(s.services))

		// Token management
		v1.POST("/tokens", handlers.CreateToken(s.services))
		v1.GET("/tokens", handlers.GetTokens(s.services))
		v1.DELETE("/tokens/:accessor", handlers.RevokeToken(s.services))
		v1.POST("/tokens/:accessor/renew", handlers.RenewToken(s.services))

		// Key rotation
		v1.POST("/rotate", handlers.RotateSecrets(s.services))
		v1.GET("/rotation/status", handlers.GetRotationStatus(s.services))
		v1.POST("/rotation/schedule", handlers.ScheduleRotation(s.services))

		// Audit and compliance
		v1.GET("/audit", handlers.GetAuditLogs(s.services))
		v1.GET("/compliance", handlers.GetComplianceReport(s.services))

		// Backup and restore
		v1.POST("/backup", handlers.BackupSecrets(s.services))
		v1.POST("/restore", handlers.RestoreSecrets(s.services))
		v1.GET("/backups", handlers.GetBackups(s.services))

		// Health and status
		v1.GET("/vault/status", handlers.GetVaultStatus(s.services))
		v1.GET("/vault/health", handlers.GetVaultHealth(s.services))
	}

	// Public endpoints for service authentication
	public := s.router.Group("/api/v1/public/secrets")
	{
		public.POST("/authenticate", handlers.AuthenticateService(s.services))
		public.POST("/validate-token", handlers.ValidateToken(s.services))
	}
}

func (s *SecretsManagementService) start() {
	srv := &http.Server{
		Addr:    ":" + s.config.Port,
		Handler: s.router,
	}

	go func() {
		s.logger.Infof("Secrets Management Service starting on port %s", s.config.Port)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			s.logger.Fatalf("Failed to start server: %v", err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	s.logger.Info("Shutting down Secrets Management Service...")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		s.logger.Fatalf("Server forced to shutdown: %v", err)
	}

	s.logger.Info("Secrets Management Service stopped")
}

func (s *SecretsManagementService) healthCheck(c *gin.Context) {
	// Check database connection
	if err := s.db.Ping(); err != nil {
		c.JSON(http.StatusServiceUnavailable, gin.H{
			"status":    "unhealthy",
			"error":     "Database connection failed",
			"timestamp": time.Now().UTC().Format(time.RFC3339),
		})
		return
	}

	// Check Vault connection (optional)
	var vaultStatus string
	if s.vaultClient != nil {
		_, err := s.vaultClient.Sys().Health()
		if err != nil {
			vaultStatus = "disconnected"
		} else {
			vaultStatus = "connected"
		}
	} else {
		vaultStatus = "disabled"
	}

	c.JSON(http.StatusOK, gin.H{
		"status":       "healthy",
		"service":      "Secrets Management Service",
		"version":      "1.0.0",
		"vault_status": vaultStatus,
		"timestamp":    time.Now().UTC().Format(time.RFC3339),
	})
}
