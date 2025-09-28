package services

import (
	"database/sql"

	"github.com/redis/go-redis/v9"
	"github.com/sirupsen/logrus"

	"security-service/internal/config"
)

// Services holds all service instances
type Services struct {
	// Add service fields here
}

// New creates a new Services instance
func New(db *sql.DB, redisClient *redis.Client, logger *logrus.Logger, cfg *config.Config) *Services {
	return &Services{
		// Initialize services here
	}
}
