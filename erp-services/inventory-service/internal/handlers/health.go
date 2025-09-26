package handlers

import (
	"net/http"
	"time"

	"inventory-service/internal/config"
	"inventory-service/internal/database"

	"github.com/gin-gonic/gin"
)

type HealthHandler struct {
	config   *config.Config
	database *database.Database
}

func NewHealthHandler(cfg *config.Config, db *database.Database) *HealthHandler {
	return &HealthHandler{
		config:   cfg,
		database: db,
	}
}

// HealthCheck godoc
// @Summary Health check endpoint
// @Description Get the health status of the service
// @Tags health
// @Accept json
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 503 {object} map[string]interface{}
// @Router /health [get]
func (h *HealthHandler) HealthCheck(c *gin.Context) {
	startTime := time.Now()

	health := map[string]interface{}{
		"service":     h.config.Service.Name,
		"version":     h.config.Service.Version,
		"status":      "healthy",
		"timestamp":   time.Now().UTC().Format(time.RFC3339),
		"uptime":      time.Since(startTime).Seconds(),
		"environment": h.config.Env,
		"checks": map[string]interface{}{
			"database": h.checkDatabase(),
			"memory":   h.checkMemory(),
			"cpu":      h.checkCPU(),
		},
	}

	// Determine overall status
	dbCheck := health["checks"].(map[string]interface{})["database"].(map[string]interface{})
	if dbCheck["status"] != "healthy" {
		health["status"] = "degraded"
	}

	// Add response time
	health["response_time"] = time.Since(startTime).String()

	// Set appropriate status code
	statusCode := http.StatusOK
	if health["status"] == "degraded" {
		statusCode = http.StatusOK // Still operational
	} else if health["status"] == "unhealthy" {
		statusCode = http.StatusServiceUnavailable
	}

	c.JSON(statusCode, health)
}

// ReadinessCheck godoc
// @Summary Readiness check endpoint
// @Description Check if the service is ready to accept requests
// @Tags health
// @Accept json
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 503 {object} map[string]interface{}
// @Router /health/ready [get]
func (h *HealthHandler) ReadinessCheck(c *gin.Context) {
	if !h.database.IsHealthy() {
		c.JSON(http.StatusServiceUnavailable, gin.H{
			"status":    "not ready",
			"message":   "Database connection not available",
			"timestamp": time.Now().UTC().Format(time.RFC3339),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":    "ready",
		"timestamp": time.Now().UTC().Format(time.RFC3339),
	})
}

// LivenessCheck godoc
// @Summary Liveness check endpoint
// @Description Check if the service is alive
// @Tags health
// @Accept json
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Router /health/live [get]
func (h *HealthHandler) LivenessCheck(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status":    "alive",
		"timestamp": time.Now().UTC().Format(time.RFC3339),
		"uptime":    time.Since(time.Now()).Seconds(), // This should be application start time
	})
}

func (h *HealthHandler) checkDatabase() map[string]interface{} {
	start := time.Now()

	if !h.database.IsHealthy() {
		return map[string]interface{}{
			"status":        "unhealthy",
			"response_time": nil,
			"error":         "Database connection failed",
		}
	}

	stats := h.database.GetStats()
	return map[string]interface{}{
		"status":        "healthy",
		"response_time": time.Since(start).String(),
		"stats":         stats,
	}
}

func (h *HealthHandler) checkMemory() map[string]interface{} {
	// This is a placeholder - in a real implementation, you might want to check memory usage
	return map[string]interface{}{
		"status": "healthy",
	}
}

func (h *HealthHandler) checkCPU() map[string]interface{} {
	// This is a placeholder - in a real implementation, you might want to check CPU usage
	return map[string]interface{}{
		"status": "healthy",
	}
}
