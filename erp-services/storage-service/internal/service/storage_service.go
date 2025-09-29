package service

import (
	"crypto/md5"
	"fmt"
	"io"
	"mime/multipart"
	"os"
	"path/filepath"
	"strings"
	"time"

	"storage-service/internal/config"
	"storage-service/internal/models"
	"storage-service/internal/repository"

	"github.com/google/uuid"
	"github.com/h2non/filetype"
	"github.com/redis/go-redis/v9"
)

// StorageService handles file storage operations
type StorageService struct {
	fileRepo *repository.FileRepository
	redis    *redis.Client
	config   *config.Config
}

// NewStorageService creates a new storage service
func NewStorageService(fileRepo *repository.FileRepository, redis *redis.Client, cfg *config.Config) *StorageService {
	return &StorageService{
		fileRepo: fileRepo,
		redis:    redis,
		config:   cfg,
	}
}

// UploadFile uploads a single file
func (s *StorageService) UploadFile(file multipart.File, header *multipart.FileHeader, uploadReq *models.FileUploadRequest, tenantID, createdBy string) (*models.FileResponse, error) {
	// Read file data
	fileData, err := io.ReadAll(file)
	if err != nil {
		return nil, fmt.Errorf("failed to read file: %w", err)
	}

	// Validate file size
	if int64(len(fileData)) > s.config.MaxFileSize {
		return nil, fmt.Errorf("file size exceeds maximum allowed size")
	}

	// Detect file type
	fileType, mimeType := s.detectFileType(fileData, header.Filename)

	// Generate unique filename
	fileID := uuid.New()
	fileExt := filepath.Ext(header.Filename)
	uniqueFilename := fileID.String() + fileExt

	// Create file path
	filePath := filepath.Join(s.config.UploadPath, uniqueFilename)

	// Ensure upload directory exists
	if err := os.MkdirAll(s.config.UploadPath, 0755); err != nil {
		return nil, fmt.Errorf("failed to create upload directory: %w", err)
	}

	// Save file to disk
	if err := os.WriteFile(filePath, fileData, 0644); err != nil {
		return nil, fmt.Errorf("failed to save file: %w", err)
	}

	// Calculate file hash
	fileHash := fmt.Sprintf("%x", md5.Sum(fileData))

	// Create file metadata
	metadata := &models.FileMetadata{
		ID:              fileID,
		FileName:        uploadReq.FileName,
		OriginalName:    header.Filename,
		FilePath:        filePath,
		FileType:        fileType,
		MimeType:        mimeType,
		FileSize:        int64(len(fileData)),
		FileHash:        fileHash,
		Version:         1,
		IsPublic:        uploadReq.IsPublic,
		IsDeleted:       false,
		Description:     uploadReq.Description,
		Tags:            uploadReq.Tags,
		StorageProvider: "local",
		TenantID:        tenantID,
		CreatedBy:       createdBy,
		CreatedAt:       time.Now(),
		UpdatedAt:       time.Now(),
	}

	// Save metadata to database
	if err := s.fileRepo.Create(metadata); err != nil {
		// Clean up file if database save fails
		os.Remove(filePath)
		return nil, fmt.Errorf("failed to save file metadata: %w", err)
	}

	// Generate thumbnail for images
	if s.isImageFile(mimeType) {
		thumbnailPath, err := s.generateThumbnail(filePath, fileID.String())
		if err == nil {
			metadata.ThumbnailPath = thumbnailPath
			s.fileRepo.Update(metadata)
		}
	}

	// Convert to response
	response := s.convertToResponse(metadata)
	return &response, nil
}

// UploadFiles uploads multiple files
func (s *StorageService) UploadFiles(files []*multipart.FileHeader, folder, tenantID, createdBy string) ([]models.FileResponse, error) {
	var responses []models.FileResponse

	for _, header := range files {
		file, err := header.Open()
		if err != nil {
			continue // Skip problematic files
		}

		uploadReq := &models.FileUploadRequest{
			FileName: header.Filename,
			Folder:   folder,
		}

		response, err := s.UploadFile(file, header, uploadReq, tenantID, createdBy)
		file.Close()

		if err != nil {
			continue // Skip problematic files
		}

		responses = append(responses, *response)
	}

	return responses, nil
}

// GetFile retrieves file metadata
func (s *StorageService) GetFile(id uuid.UUID) (*models.FileResponse, error) {
	metadata, err := s.fileRepo.GetByID(id)
	if err != nil {
		return nil, err
	}

	// Update access time
	s.fileRepo.UpdateAccessTime(id)

	response := s.convertToResponse(metadata)
	return &response, nil
}

// DownloadFile downloads a file
func (s *StorageService) DownloadFile(id uuid.UUID) ([]byte, *models.FileMetadata, error) {
	metadata, err := s.fileRepo.GetByID(id)
	if err != nil {
		return nil, nil, err
	}

	// Read file data
	fileData, err := os.ReadFile(metadata.FilePath)
	if err != nil {
		return nil, nil, fmt.Errorf("failed to read file: %w", err)
	}

	// Update access time
	s.fileRepo.UpdateAccessTime(id)

	return fileData, metadata, nil
}

// GetFilePreview gets file preview/thumbnail
func (s *StorageService) GetFilePreview(id uuid.UUID) ([]byte, error) {
	metadata, err := s.fileRepo.GetByID(id)
	if err != nil {
		return nil, err
	}

	// If thumbnail exists, return it
	if metadata.ThumbnailPath != "" {
		thumbnailData, err := os.ReadFile(metadata.ThumbnailPath)
		if err == nil {
			return thumbnailData, nil
		}
	}

	// Fallback to original file for images
	if s.isImageFile(metadata.MimeType) {
		fileData, err := os.ReadFile(metadata.FilePath)
		if err != nil {
			return nil, fmt.Errorf("failed to read file: %w", err)
		}
		return fileData, nil
	}

	return nil, fmt.Errorf("preview not available")
}

// ListFiles lists files with pagination and filters
func (s *StorageService) ListFiles(tenantID, fileType, tags string, isPublic *bool, search string, page, pageSize int) (*models.FileListResponse, error) {
	return s.fileRepo.List(tenantID, fileType, tags, isPublic, search, page, pageSize)
}

// UpdateFile updates file metadata
func (s *StorageService) UpdateFile(id uuid.UUID, updateReq *models.FileUpdateRequest) (*models.FileResponse, error) {
	metadata, err := s.fileRepo.GetByID(id)
	if err != nil {
		return nil, err
	}

	// Update fields
	if updateReq.FileName != "" {
		metadata.FileName = updateReq.FileName
	}
	if updateReq.Description != "" {
		metadata.Description = updateReq.Description
	}
	if updateReq.Tags != "" {
		metadata.Tags = updateReq.Tags
	}
	if updateReq.IsPublic != nil {
		metadata.IsPublic = *updateReq.IsPublic
	}

	metadata.UpdatedAt = time.Now()

	// Save changes
	if err := s.fileRepo.Update(metadata); err != nil {
		return nil, err
	}

	response := s.convertToResponse(metadata)
	return &response, nil
}

// DeleteFile deletes a file
func (s *StorageService) DeleteFile(id uuid.UUID) error {
	metadata, err := s.fileRepo.GetByID(id)
	if err != nil {
		return err
	}

	// Soft delete in database
	if err := s.fileRepo.Delete(id); err != nil {
		return err
	}

	// Remove physical file
	os.Remove(metadata.FilePath)
	if metadata.ThumbnailPath != "" {
		os.Remove(metadata.ThumbnailPath)
	}

	return nil
}

// GetFileVersions gets file versions (simplified - returns current version)
func (s *StorageService) GetFileVersions(id uuid.UUID) ([]models.FileResponse, error) {
	metadata, err := s.fileRepo.GetByID(id)
	if err != nil {
		return nil, err
	}

	response := s.convertToResponse(metadata)
	return []models.FileResponse{response}, nil
}

// RestoreFileVersion restores a file version (simplified - returns current file)
func (s *StorageService) RestoreFileVersion(id uuid.UUID, version int) (*models.FileResponse, error) {
	return s.GetFile(id)
}

// GetStorageStats gets storage statistics
func (s *StorageService) GetStorageStats(tenantID string) (*models.StorageStats, error) {
	return s.fileRepo.GetStorageStats(tenantID)
}

// SearchFiles searches files
func (s *StorageService) SearchFiles(query, tenantID, fileType string, page, pageSize int) (*models.FileListResponse, error) {
	return s.fileRepo.List(tenantID, fileType, "", nil, query, page, pageSize)
}

// Helper methods

// detectFileType detects file type and MIME type
func (s *StorageService) detectFileType(data []byte, filename string) (string, string) {
	// Try to detect by file content
	if kind, err := filetype.Match(data); err == nil {
		return strings.TrimPrefix(kind.Extension, "."), kind.MIME.Value
	}

	// Fallback to filename extension
	ext := strings.ToLower(filepath.Ext(filename))
	if ext != "" {
		ext = ext[1:] // Remove the dot
	}

	// Map common extensions to MIME types
	mimeTypes := map[string]string{
		"jpg":  "image/jpeg",
		"jpeg": "image/jpeg",
		"png":  "image/png",
		"gif":  "image/gif",
		"pdf":  "application/pdf",
		"txt":  "text/plain",
		"doc":  "application/msword",
		"docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
		"xls":  "application/vnd.ms-excel",
		"xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
	}

	mimeType := "application/octet-stream"
	if mt, exists := mimeTypes[ext]; exists {
		mimeType = mt
	}

	return ext, mimeType
}

// isImageFile checks if the MIME type is an image
func (s *StorageService) isImageFile(mimeType string) bool {
	return strings.HasPrefix(mimeType, "image/")
}

// generateThumbnail generates a thumbnail for image files
func (s *StorageService) generateThumbnail(filePath, fileID string) (string, error) {
	// Ensure thumbnail directory exists
	if err := os.MkdirAll(s.config.ThumbnailPath, 0755); err != nil {
		return "", err
	}

	thumbnailPath := filepath.Join(s.config.ThumbnailPath, fileID+"_thumb.jpg")

	// For now, just copy the original file as thumbnail
	// In a real implementation, you would use an image processing library
	// like github.com/disintegration/imaging to create actual thumbnails
	originalData, err := os.ReadFile(filePath)
	if err != nil {
		return "", err
	}

	if err := os.WriteFile(thumbnailPath, originalData, 0644); err != nil {
		return "", err
	}

	return thumbnailPath, nil
}

// convertToResponse converts FileMetadata to FileResponse
func (s *StorageService) convertToResponse(metadata *models.FileMetadata) models.FileResponse {
	return models.FileResponse{
		ID:              metadata.ID,
		FileName:        metadata.FileName,
		OriginalName:    metadata.OriginalName,
		FilePath:        metadata.FilePath,
		FileType:        metadata.FileType,
		MimeType:        metadata.MimeType,
		FileSize:        metadata.FileSize,
		FileHash:        metadata.FileHash,
		Version:         metadata.Version,
		IsPublic:        metadata.IsPublic,
		Description:     metadata.Description,
		Tags:            metadata.Tags,
		ThumbnailPath:   metadata.ThumbnailPath,
		StorageProvider: metadata.StorageProvider,
		StorageBucket:   metadata.StorageBucket,
		StorageKey:      metadata.StorageKey,
		TenantID:        metadata.TenantID,
		CreatedBy:       metadata.CreatedBy,
		CreatedAt:       metadata.CreatedAt,
		UpdatedAt:       metadata.UpdatedAt,
		AccessedAt:      metadata.AccessedAt,
		DownloadURL:     "/api/v1/storage/files/" + metadata.ID.String() + "/download",
		PreviewURL:      "/api/v1/storage/files/" + metadata.ID.String() + "/preview",
	}
}
