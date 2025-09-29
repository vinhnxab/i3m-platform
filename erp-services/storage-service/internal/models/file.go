package models

import (
	"time"

	"github.com/google/uuid"
)

// FileMetadata represents file metadata and storage information
type FileMetadata struct {
	ID              uuid.UUID  `json:"id" db:"id"`
	FileName        string     `json:"file_name" db:"file_name"`
	OriginalName    string     `json:"original_name" db:"original_name"`
	FilePath        string     `json:"file_path" db:"file_path"`
	FileType        string     `json:"file_type" db:"file_type"`
	MimeType        string     `json:"mime_type" db:"mime_type"`
	FileSize        int64      `json:"file_size" db:"file_size"`
	FileHash        string     `json:"file_hash" db:"file_hash"`
	Version         int        `json:"version" db:"version"`
	IsPublic        bool       `json:"is_public" db:"is_public"`
	IsDeleted       bool       `json:"is_deleted" db:"is_deleted"`
	Description     string     `json:"description" db:"description"`
	Tags            string     `json:"tags" db:"tags"`
	ThumbnailPath   string     `json:"thumbnail_path" db:"thumbnail_path"`
	StorageProvider string     `json:"storage_provider" db:"storage_provider"`
	StorageBucket   string     `json:"storage_bucket" db:"storage_bucket"`
	StorageKey      string     `json:"storage_key" db:"storage_key"`
	TenantID        string     `json:"tenant_id" db:"tenant_id"`
	CreatedBy       string     `json:"created_by" db:"created_by"`
	CreatedAt       time.Time  `json:"created_at" db:"created_at"`
	UpdatedAt       time.Time  `json:"updated_at" db:"updated_at"`
	AccessedAt      *time.Time `json:"accessed_at" db:"accessed_at"`
}

// FileUploadRequest represents the request data for file upload
type FileUploadRequest struct {
	FileName    string   `json:"file_name" binding:"required"`
	Description string   `json:"description"`
	Tags        string   `json:"tags"`
	IsPublic    bool     `json:"is_public"`
	Folder      string   `json:"folder"`
	Permissions []string `json:"permissions"`
	Category    string   `json:"category"`
	Subcategory string   `json:"subcategory"`
}

// FileResponse represents the response data for file operations
type FileResponse struct {
	ID              uuid.UUID  `json:"id"`
	FileName        string     `json:"file_name"`
	OriginalName    string     `json:"original_name"`
	FilePath        string     `json:"file_path"`
	FileType        string     `json:"file_type"`
	MimeType        string     `json:"mime_type"`
	FileSize        int64      `json:"file_size"`
	FileHash        string     `json:"file_hash"`
	Version         int        `json:"version"`
	IsPublic        bool       `json:"is_public"`
	Description     string     `json:"description"`
	Tags            string     `json:"tags"`
	ThumbnailPath   string     `json:"thumbnail_path"`
	StorageProvider string     `json:"storage_provider"`
	StorageBucket   string     `json:"storage_bucket"`
	StorageKey      string     `json:"storage_key"`
	TenantID        string     `json:"tenant_id"`
	CreatedBy       string     `json:"created_by"`
	CreatedAt       time.Time  `json:"created_at"`
	UpdatedAt       time.Time  `json:"updated_at"`
	AccessedAt      *time.Time `json:"accessed_at"`
	DownloadURL     string     `json:"download_url"`
	PreviewURL      string     `json:"preview_url"`
}

// FileListResponse represents the response for file listing
type FileListResponse struct {
	Files      []FileResponse `json:"files"`
	Total      int64          `json:"total"`
	Page       int            `json:"page"`
	PageSize   int            `json:"page_size"`
	TotalPages int            `json:"total_pages"`
}

// StorageStats represents storage statistics
type StorageStats struct {
	TotalFiles     int64            `json:"total_files"`
	TotalSize      int64            `json:"total_size"`
	FileTypeCounts map[string]int64 `json:"file_type_counts"`
	StorageUsage   map[string]int64 `json:"storage_usage"`
}

// FileSearchRequest represents the request for file search
type FileSearchRequest struct {
	Query    string `form:"query" binding:"required"`
	TenantID string `form:"tenant_id"`
	FileType string `form:"file_type"`
	Page     int    `form:"page"`
	PageSize int    `form:"page_size"`
}

// FileUpdateRequest represents the request for file update
type FileUpdateRequest struct {
	FileName    string `json:"file_name"`
	Description string `json:"description"`
	Tags        string `json:"tags"`
	IsPublic    *bool  `json:"is_public"`
}
