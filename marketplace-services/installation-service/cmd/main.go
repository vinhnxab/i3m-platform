package main

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/i3m-platform/installation-service/internal/config"
	"github.com/i3m-platform/installation-service/internal/handlers"
	"github.com/i3m-platform/installation-service/internal/services"
)

func main() {
	// Load configuration
	cfg := config.Load()

	// Set Gin mode
	if cfg.Environment == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	// Initialize router
	r := gin.Default()

	// Initialize services
	installationService := services.NewInstallationService(cfg)

	// Initialize handlers
	installationHandler := handlers.NewInstallationHandler(installationService)

	// Setup routes
	api := r.Group("/api/v1")
	{
		api.GET("/health", installationHandler.Health)
		api.POST("/install", installationHandler.InstallTemplate)
		api.GET("/status/:id", installationHandler.GetInstallationStatus)
		api.DELETE("/uninstall/:id", installationHandler.UninstallTemplate)
		api.GET("/templates", installationHandler.ListInstalledTemplates)
	}

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "3061"
	}

	log.Printf("Template Installation Service starting on port %s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
