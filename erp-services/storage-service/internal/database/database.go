package database

import (
	"context"
	"database/sql"
	"fmt"
	"log"

	_ "github.com/lib/pq"
	"github.com/redis/go-redis/v9"
)

// Initialize initializes the PostgreSQL database connection
func Initialize(databaseURL string) (*sql.DB, error) {
	db, err := sql.Open("postgres", databaseURL)
	if err != nil {
		return nil, fmt.Errorf("failed to open database: %w", err)
	}

	// Test the connection
	if err := db.Ping(); err != nil {
		return nil, fmt.Errorf("failed to ping database: %w", err)
	}

	// Create schema if not exists
	if err := createSchema(db); err != nil {
		return nil, fmt.Errorf("failed to create schema: %w", err)
	}

	log.Println("Database connection established successfully")
	return db, nil
}

// InitializeRedis initializes the Redis connection
func InitializeRedis(redisURL string) (*redis.Client, error) {
	opt, err := redis.ParseURL(redisURL)
	if err != nil {
		return nil, fmt.Errorf("failed to parse Redis URL: %w", err)
	}

	client := redis.NewClient(opt)

	// Test the connection
	if err := client.Ping(context.Background()).Err(); err != nil {
		return nil, fmt.Errorf("failed to ping Redis: %w", err)
	}

	log.Println("Redis connection established successfully")
	return client, nil
}

// createSchema creates the database schema
func createSchema(db *sql.DB) error {
	schema := `
	CREATE SCHEMA IF NOT EXISTS core;

	CREATE TABLE IF NOT EXISTS core.file_metadata (
		id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
		file_name VARCHAR(255) NOT NULL,
		original_name VARCHAR(255) NOT NULL,
		file_path VARCHAR(1000) NOT NULL,
		file_type VARCHAR(100) NOT NULL,
		mime_type VARCHAR(100) NOT NULL,
		file_size BIGINT NOT NULL,
		file_hash VARCHAR(64),
		version INTEGER NOT NULL DEFAULT 1,
		is_public BOOLEAN NOT NULL DEFAULT false,
		is_deleted BOOLEAN NOT NULL DEFAULT false,
		description TEXT,
		tags TEXT,
		thumbnail_path VARCHAR(1000),
		storage_provider VARCHAR(50) NOT NULL DEFAULT 'local',
		storage_bucket VARCHAR(255),
		storage_key VARCHAR(1000),
		tenant_id VARCHAR(255) NOT NULL,
		created_by VARCHAR(255) NOT NULL,
		created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
		updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
		accessed_at TIMESTAMP WITH TIME ZONE
	);

	CREATE INDEX IF NOT EXISTS idx_file_metadata_tenant_id ON core.file_metadata(tenant_id);
	CREATE INDEX IF NOT EXISTS idx_file_metadata_created_by ON core.file_metadata(created_by);
	CREATE INDEX IF NOT EXISTS idx_file_metadata_file_type ON core.file_metadata(file_type);
	CREATE INDEX IF NOT EXISTS idx_file_metadata_is_public ON core.file_metadata(is_public);
	CREATE INDEX IF NOT EXISTS idx_file_metadata_is_deleted ON core.file_metadata(is_deleted);
	CREATE INDEX IF NOT EXISTS idx_file_metadata_storage_provider ON core.file_metadata(storage_provider);
	CREATE INDEX IF NOT EXISTS idx_file_metadata_created_at ON core.file_metadata(created_at);

	-- Full text search index
	CREATE INDEX IF NOT EXISTS idx_file_metadata_search ON core.file_metadata USING gin(
		to_tsvector('english', file_name || ' ' || COALESCE(description, '') || ' ' || COALESCE(tags, ''))
	);
	`

	if _, err := db.Exec(schema); err != nil {
		return fmt.Errorf("failed to create schema: %w", err)
	}

	log.Println("Database schema created successfully")
	return nil
}
