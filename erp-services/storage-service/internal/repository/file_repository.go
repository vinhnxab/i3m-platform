package repository

import (
	"database/sql"
	"fmt"

	"storage-service/internal/models"

	"github.com/google/uuid"
)

// FileRepository handles file metadata database operations
type FileRepository struct {
	db *sql.DB
}

// NewFileRepository creates a new file repository
func NewFileRepository(db *sql.DB) *FileRepository {
	return &FileRepository{db: db}
}

// Create creates a new file metadata record
func (r *FileRepository) Create(file *models.FileMetadata) error {
	query := `
		INSERT INTO core.file_metadata (
			id, file_name, original_name, file_path, file_type, mime_type,
			file_size, file_hash, version, is_public, is_deleted, description,
			tags, thumbnail_path, storage_provider, storage_bucket, storage_key,
			tenant_id, created_by, created_at, updated_at
		) VALUES (
			$1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21
		)
	`

	_, err := r.db.Exec(query,
		file.ID, file.FileName, file.OriginalName, file.FilePath, file.FileType,
		file.MimeType, file.FileSize, file.FileHash, file.Version, file.IsPublic,
		file.IsDeleted, file.Description, file.Tags, file.ThumbnailPath,
		file.StorageProvider, file.StorageBucket, file.StorageKey, file.TenantID,
		file.CreatedBy, file.CreatedAt, file.UpdatedAt,
	)

	return err
}

// GetByID retrieves a file metadata by ID
func (r *FileRepository) GetByID(id uuid.UUID) (*models.FileMetadata, error) {
	query := `
		SELECT id, file_name, original_name, file_path, file_type, mime_type,
			   file_size, file_hash, version, is_public, is_deleted, description,
			   tags, thumbnail_path, storage_provider, storage_bucket, storage_key,
			   tenant_id, created_by, created_at, updated_at, accessed_at
		FROM core.file_metadata
		WHERE id = $1 AND is_deleted = false
	`

	file := &models.FileMetadata{}
	err := r.db.QueryRow(query, id).Scan(
		&file.ID, &file.FileName, &file.OriginalName, &file.FilePath, &file.FileType,
		&file.MimeType, &file.FileSize, &file.FileHash, &file.Version, &file.IsPublic,
		&file.IsDeleted, &file.Description, &file.Tags, &file.ThumbnailPath,
		&file.StorageProvider, &file.StorageBucket, &file.StorageKey, &file.TenantID,
		&file.CreatedBy, &file.CreatedAt, &file.UpdatedAt, &file.AccessedAt,
	)

	if err != nil {
		return nil, err
	}

	return file, nil
}

// Update updates a file metadata record
func (r *FileRepository) Update(file *models.FileMetadata) error {
	query := `
		UPDATE core.file_metadata SET
			file_name = $2, description = $3, tags = $4, is_public = $5,
			updated_at = $6
		WHERE id = $1
	`

	_, err := r.db.Exec(query, file.ID, file.FileName, file.Description,
		file.Tags, file.IsPublic, file.UpdatedAt)

	return err
}

// Delete soft deletes a file metadata record
func (r *FileRepository) Delete(id uuid.UUID) error {
	query := `UPDATE core.file_metadata SET is_deleted = true, updated_at = NOW() WHERE id = $1`
	_, err := r.db.Exec(query, id)
	return err
}

// List retrieves files with pagination and filters
func (r *FileRepository) List(tenantID, fileType, tags string, isPublic *bool, search string, page, pageSize int) (*models.FileListResponse, error) {
	// Build WHERE clause
	whereClause := "WHERE is_deleted = false"
	args := []interface{}{}
	argIndex := 1

	if tenantID != "" {
		whereClause += fmt.Sprintf(" AND tenant_id = $%d", argIndex)
		args = append(args, tenantID)
		argIndex++
	}

	if fileType != "" {
		whereClause += fmt.Sprintf(" AND file_type = $%d", argIndex)
		args = append(args, fileType)
		argIndex++
	}

	if tags != "" {
		whereClause += fmt.Sprintf(" AND tags ILIKE $%d", argIndex)
		args = append(args, "%"+tags+"%")
		argIndex++
	}

	if isPublic != nil {
		whereClause += fmt.Sprintf(" AND is_public = $%d", argIndex)
		args = append(args, *isPublic)
		argIndex++
	}

	if search != "" {
		whereClause += fmt.Sprintf(" AND to_tsvector('english', file_name || ' ' || COALESCE(description, '') || ' ' || COALESCE(tags, '')) @@ plainto_tsquery('english', $%d)", argIndex)
		args = append(args, search)
		argIndex++
	}

	// Count total records
	countQuery := "SELECT COUNT(*) FROM core.file_metadata " + whereClause
	var total int64
	err := r.db.QueryRow(countQuery, args...).Scan(&total)
	if err != nil {
		return nil, err
	}

	// Calculate pagination
	offset := (page - 1) * pageSize
	totalPages := int((total + int64(pageSize) - 1) / int64(pageSize))

	// Build main query
	query := `
		SELECT id, file_name, original_name, file_path, file_type, mime_type,
			   file_size, file_hash, version, is_public, is_deleted, description,
			   tags, thumbnail_path, storage_provider, storage_bucket, storage_key,
			   tenant_id, created_by, created_at, updated_at, accessed_at
		FROM core.file_metadata
		` + whereClause + `
		ORDER BY created_at DESC
		LIMIT $` + fmt.Sprintf("%d", argIndex) + ` OFFSET $` + fmt.Sprintf("%d", argIndex+1)

	args = append(args, pageSize, offset)

	rows, err := r.db.Query(query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var files []models.FileResponse
	for rows.Next() {
		var file models.FileMetadata
		err := rows.Scan(
			&file.ID, &file.FileName, &file.OriginalName, &file.FilePath, &file.FileType,
			&file.MimeType, &file.FileSize, &file.FileHash, &file.Version, &file.IsPublic,
			&file.IsDeleted, &file.Description, &file.Tags, &file.ThumbnailPath,
			&file.StorageProvider, &file.StorageBucket, &file.StorageKey, &file.TenantID,
			&file.CreatedBy, &file.CreatedAt, &file.UpdatedAt, &file.AccessedAt,
		)
		if err != nil {
			return nil, err
		}

		// Convert to response
		response := convertToResponse(&file)
		files = append(files, response)
	}

	return &models.FileListResponse{
		Files:      files,
		Total:      total,
		Page:       page,
		PageSize:   pageSize,
		TotalPages: totalPages,
	}, nil
}

// GetStorageStats retrieves storage statistics
func (r *FileRepository) GetStorageStats(tenantID string) (*models.StorageStats, error) {
	whereClause := "WHERE is_deleted = false"
	args := []interface{}{}
	argIndex := 1

	if tenantID != "" {
		whereClause += fmt.Sprintf(" AND tenant_id = $%d", argIndex)
		args = append(args, tenantID)
		argIndex++
	}

	// Get total files and size
	statsQuery := `
		SELECT COUNT(*), COALESCE(SUM(file_size), 0)
		FROM core.file_metadata
		` + whereClause

	var totalFiles int64
	var totalSize int64
	err := r.db.QueryRow(statsQuery, args...).Scan(&totalFiles, &totalSize)
	if err != nil {
		return nil, err
	}

	// Get file type counts
	typeQuery := `
		SELECT file_type, COUNT(*)
		FROM core.file_metadata
		` + whereClause + `
		GROUP BY file_type
	`

	rows, err := r.db.Query(typeQuery, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	fileTypeCounts := make(map[string]int64)
	for rows.Next() {
		var fileType string
		var count int64
		if err := rows.Scan(&fileType, &count); err != nil {
			return nil, err
		}
		fileTypeCounts[fileType] = count
	}

	return &models.StorageStats{
		TotalFiles:     totalFiles,
		TotalSize:      totalSize,
		FileTypeCounts: fileTypeCounts,
		StorageUsage:   make(map[string]int64),
	}, nil
}

// UpdateAccessTime updates the accessed_at timestamp
func (r *FileRepository) UpdateAccessTime(id uuid.UUID) error {
	query := `UPDATE core.file_metadata SET accessed_at = NOW() WHERE id = $1`
	_, err := r.db.Exec(query, id)
	return err
}

// convertToResponse converts FileMetadata to FileResponse
func convertToResponse(file *models.FileMetadata) models.FileResponse {
	return models.FileResponse{
		ID:              file.ID,
		FileName:        file.FileName,
		OriginalName:    file.OriginalName,
		FilePath:        file.FilePath,
		FileType:        file.FileType,
		MimeType:        file.MimeType,
		FileSize:        file.FileSize,
		FileHash:        file.FileHash,
		Version:         file.Version,
		IsPublic:        file.IsPublic,
		Description:     file.Description,
		Tags:            file.Tags,
		ThumbnailPath:   file.ThumbnailPath,
		StorageProvider: file.StorageProvider,
		StorageBucket:   file.StorageBucket,
		StorageKey:      file.StorageKey,
		TenantID:        file.TenantID,
		CreatedBy:       file.CreatedBy,
		CreatedAt:       file.CreatedAt,
		UpdatedAt:       file.UpdatedAt,
		AccessedAt:      file.AccessedAt,
		DownloadURL:     "/api/v1/storage/files/" + file.ID.String() + "/download",
		PreviewURL:      "/api/v1/storage/files/" + file.ID.String() + "/preview",
	}
}
