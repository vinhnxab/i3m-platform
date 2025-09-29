package handlers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

// HealthCheck handles health check requests
func HealthCheck(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status":    "healthy",
		"service":   "Storage Service",
		"version":   "1.0.0",
		"timestamp": time.Now().Unix(),
	})
}
