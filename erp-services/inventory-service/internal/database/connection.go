package database

import (
	"fmt"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"

	"inventory-service/internal/config"
	"inventory-service/internal/models"

	"github.com/sirupsen/logrus"
)

type Database struct {
	DB     *gorm.DB
	config *config.Config
}

func NewDatabase(cfg *config.Config) *Database {
	return &Database{
		config: cfg,
	}
}

func (d *Database) Connect() error {
	var err error

	// Configure GORM logger
	var gormLogLevel logger.LogLevel
	switch d.config.Logging.Level {
	case "debug":
		gormLogLevel = logger.Info
	case "info":
		gormLogLevel = logger.Warn
	default:
		gormLogLevel = logger.Error
	}

	gormConfig := &gorm.Config{
		Logger: logger.Default.LogMode(gormLogLevel),
	}

	// Connect to PostgreSQL
	d.DB, err = gorm.Open(postgres.Open(d.config.Database.DSN), gormConfig)
	if err != nil {
		return fmt.Errorf("failed to connect to database: %w", err)
	}

	// Configure connection pool
	sqlDB, err := d.DB.DB()
	if err != nil {
		return fmt.Errorf("failed to get underlying sql.DB: %w", err)
	}

	// Connection pool settings
	sqlDB.SetMaxOpenConns(25)
	sqlDB.SetMaxIdleConns(5)
	sqlDB.SetConnMaxLifetime(5 * time.Minute)

	// Test connection
	if err := sqlDB.Ping(); err != nil {
		return fmt.Errorf("failed to ping database: %w", err)
	}

	logrus.Info("Successfully connected to PostgreSQL database")
	return nil
}

func (d *Database) Disconnect() error {
	if d.DB != nil {
		sqlDB, err := d.DB.DB()
		if err != nil {
			return fmt.Errorf("failed to get underlying sql.DB: %w", err)
		}

		if err := sqlDB.Close(); err != nil {
			return fmt.Errorf("failed to close database connection: %w", err)
		}

		logrus.Info("Database connection closed")
	}
	return nil
}

func (d *Database) Migrate() error {
	logrus.Info("Running database migrations...")

	// Auto-migrate all models
	err := d.DB.AutoMigrate(
		&models.Category{},
		&models.Unit{},
		&models.Supplier{},
		&models.Warehouse{},
		&models.Location{},
		&models.Product{},
		&models.ProductVariant{},
		&models.StockLevel{},
		&models.StockMovement{},
		&models.PurchaseOrder{},
		&models.PurchaseOrderItem{},
		&models.StockAdjustment{},
		&models.StockAdjustmentItem{},
		&models.StockTransfer{},
		&models.StockTransferItem{},
	)

	if err != nil {
		return fmt.Errorf("failed to run migrations: %w", err)
	}

	logrus.Info("Database migrations completed successfully")
	return nil
}

func (d *Database) IsHealthy() bool {
	if d.DB == nil {
		return false
	}

	sqlDB, err := d.DB.DB()
	if err != nil {
		return false
	}

	return sqlDB.Ping() == nil
}

func (d *Database) GetStats() map[string]interface{} {
	if d.DB == nil {
		return nil
	}

	sqlDB, err := d.DB.DB()
	if err != nil {
		return nil
	}

	stats := sqlDB.Stats()
	return map[string]interface{}{
		"max_open_connections": stats.MaxOpenConnections,
		"open_connections":     stats.OpenConnections,
		"in_use":               stats.InUse,
		"idle":                 stats.Idle,
		"wait_count":           stats.WaitCount,
		"wait_duration":        stats.WaitDuration.String(),
		"max_idle_closed":      stats.MaxIdleClosed,
		"max_idle_time_closed": stats.MaxIdleTimeClosed,
		"max_lifetime_closed":  stats.MaxLifetimeClosed,
	}
}
