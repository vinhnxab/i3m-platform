package main

import (
	"log"
	"os"

	"storage-service/internal/config"
	"storage-service/internal/database"
	"storage-service/internal/handlers"
	"storage-service/internal/middleware"
	"storage-service/internal/repository"
	"storage-service/internal/service"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

/**
 * I3M Platform Storage Service
 *
 * Digital file and data management service for modern enterprises.
 * Provides file storage, metadata management, version control, and
 * integration with cloud storage providers (AWS S3, MinIO).
 *
 * Features:
 * - File upload/download with metadata
 * - Version control and history
 * - Thumbnail generation
 * - File type detection
 * - Access control and permissions
 * - Cloud storage integration
 * - Search and indexing
 *
 * @author I3M Platform Team
 * @version 1.0.0
 */
func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using system environment variables")
	}

	// Load configuration
	cfg := config.Load()

	// Initialize database
	db, err := database.Initialize(cfg.DatabaseURL)
	if err != nil {
		log.Fatal("Failed to initialize database:", err)
	}

	// Initialize Redis
	redisClient, err := database.InitializeRedis(cfg.RedisURL)
	if err != nil {
		log.Fatal("Failed to initialize Redis:", err)
	}

	// Initialize repository
	fileRepo := repository.NewFileRepository(db)

	// Initialize service
	storageService := service.NewStorageService(fileRepo, redisClient, cfg)

	// Initialize handlers
	fileHandler := handlers.NewFileHandler(storageService)

	// Setup router
	router := gin.Default()

	// Middleware
	router.Use(middleware.CORS())
	router.Use(middleware.Logger())
	router.Use(middleware.Recovery())

	// Health check
	router.GET("/health", handlers.HealthCheck)

	// API routes
	api := router.Group("/api/v1/storage")
	{
		// File operations
		api.POST("/upload", fileHandler.UploadFile)
		api.POST("/upload/batch", fileHandler.UploadFiles)
		api.GET("/files/:id", fileHandler.GetFile)
		api.GET("/files/:id/download", fileHandler.DownloadFile)
		api.GET("/files/:id/preview", fileHandler.GetFilePreview)
		api.GET("/files", fileHandler.ListFiles)
		api.PUT("/files/:id", fileHandler.UpdateFile)
		api.DELETE("/files/:id", fileHandler.DeleteFile)

		// Version control
		api.GET("/files/:id/versions", fileHandler.GetFileVersions)
		api.POST("/files/:id/versions/:version/restore", fileHandler.RestoreFileVersion)

		// Statistics and search
		api.GET("/stats", fileHandler.GetStorageStats)
		api.GET("/search", fileHandler.SearchFiles)
	}

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "3032"
	}

	log.Printf("Storage Service starting on port %s", port)
	log.Fatal(router.Run(":" + port))
}
