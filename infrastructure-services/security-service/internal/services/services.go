package services

import (
	"database/sql"

	"github.com/redis/go-redis/v9"
	"github.com/sirupsen/logrus"

	"github.com/i3m/security-service/internal/config"
)

// Services holds all service instances
type Services struct {
	RBAC       *RBACService
	Encryption *EncryptionService
	Threat     *ThreatService
	Audit      *AuditService
	Access     *AccessService
	Compliance *ComplianceService
}

// New creates a new Services instance
func New(db *sql.DB, redisClient *redis.Client, logger *logrus.Logger, cfg *config.Config) *Services {
	return &Services{
		RBAC:       NewRBACService(db, redisClient, logger),
		Encryption: NewEncryptionService(cfg.EncryptionKey, logger),
		Threat:     NewThreatService(db, redisClient, logger, cfg),
		Audit:      NewAuditService(db, logger),
		Access:     NewAccessService(db, redisClient, logger),
		Compliance: NewComplianceService(db, logger),
	}
}
