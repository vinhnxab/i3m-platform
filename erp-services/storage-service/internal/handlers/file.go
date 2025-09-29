package handlers

import (
	"net/http"
	"strconv"

	"storage-service/internal/models"
	"storage-service/internal/service"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// FileHandler handles file-related HTTP requests
type FileHandler struct {
	storageService *service.StorageService
}

// NewFileHandler creates a new file handler
func NewFileHandler(storageService *service.StorageService) *FileHandler {
	return &FileHandler{
		storageService: storageService,
	}
}

// UploadFile handles single file upload
func (h *FileHandler) UploadFile(c *gin.Context) {
	// Get form data
	file, header, err := c.Request.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No file provided"})
		return
	}
	defer file.Close()

	// Get other form fields
	fileName := c.PostForm("fileName")
	if fileName == "" {
		fileName = header.Filename
	}
	description := c.PostForm("description")
	tags := c.PostForm("tags")
	isPublic := c.PostForm("isPublic") == "true"
	folder := c.PostForm("folder")
	tenantID := c.PostForm("tenantId")
	createdBy := c.PostForm("createdBy")

	// Create upload request
	uploadReq := &models.FileUploadRequest{
		FileName:    fileName,
		Description: description,
		Tags:        tags,
		IsPublic:    isPublic,
		Folder:      folder,
	}

	// Upload file
	response, err := h.storageService.UploadFile(file, header, uploadReq, tenantID, createdBy)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, response)
}

// UploadFiles handles multiple file upload
func (h *FileHandler) UploadFiles(c *gin.Context) {
	form, err := c.MultipartForm()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid multipart form"})
		return
	}

	files := form.File["files"]
	if len(files) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No files provided"})
		return
	}

	folder := c.PostForm("folder")
	tenantID := c.PostForm("tenantId")
	createdBy := c.PostForm("createdBy")

	responses, err := h.storageService.UploadFiles(files, folder, tenantID, createdBy)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, responses)
}

// GetFile handles getting file metadata
func (h *FileHandler) GetFile(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid file ID"})
		return
	}

	response, err := h.storageService.GetFile(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "File not found"})
		return
	}

	c.JSON(http.StatusOK, response)
}

// DownloadFile handles file download
func (h *FileHandler) DownloadFile(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid file ID"})
		return
	}

	fileData, metadata, err := h.storageService.DownloadFile(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "File not found"})
		return
	}

	// Set headers for file download
	c.Header("Content-Disposition", "attachment; filename=\""+metadata.OriginalName+"\"")
	c.Header("Content-Type", metadata.MimeType)
	c.Header("Content-Length", strconv.FormatInt(metadata.FileSize, 10))

	// Write file data
	c.Data(http.StatusOK, metadata.MimeType, fileData)
}

// GetFilePreview handles file preview/thumbnail
func (h *FileHandler) GetFilePreview(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid file ID"})
		return
	}

	previewData, err := h.storageService.GetFilePreview(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Preview not found"})
		return
	}

	c.Data(http.StatusOK, "image/jpeg", previewData)
}

// ListFiles handles file listing with pagination
func (h *FileHandler) ListFiles(c *gin.Context) {
	// Get query parameters
	tenantID := c.Query("tenantId")
	fileType := c.Query("fileType")
	tags := c.Query("tags")
	isPublicStr := c.Query("isPublic")
	search := c.Query("search")
	pageStr := c.DefaultQuery("page", "1")
	pageSizeStr := c.DefaultQuery("pageSize", "20")

	// Parse pagination parameters
	page, err := strconv.Atoi(pageStr)
	if err != nil || page < 1 {
		page = 1
	}
	pageSize, err := strconv.Atoi(pageSizeStr)
	if err != nil || pageSize < 1 || pageSize > 100 {
		pageSize = 20
	}

	// Parse isPublic parameter
	var isPublic *bool
	if isPublicStr != "" {
		if isPublicStr == "true" {
			val := true
			isPublic = &val
		} else if isPublicStr == "false" {
			val := false
			isPublic = &val
		}
	}

	// List files
	response, err := h.storageService.ListFiles(tenantID, fileType, tags, isPublic, search, page, pageSize)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, response)
}

// UpdateFile handles file metadata update
func (h *FileHandler) UpdateFile(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid file ID"})
		return
	}

	var updateReq models.FileUpdateRequest
	if err := c.ShouldBindJSON(&updateReq); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	response, err := h.storageService.UpdateFile(id, &updateReq)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "File not found"})
		return
	}

	c.JSON(http.StatusOK, response)
}

// DeleteFile handles file deletion
func (h *FileHandler) DeleteFile(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid file ID"})
		return
	}

	err = h.storageService.DeleteFile(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "File not found"})
		return
	}

	c.Status(http.StatusNoContent)
}

// GetFileVersions handles getting file versions
func (h *FileHandler) GetFileVersions(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid file ID"})
		return
	}

	versions, err := h.storageService.GetFileVersions(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "File not found"})
		return
	}

	c.JSON(http.StatusOK, versions)
}

// RestoreFileVersion handles file version restoration
func (h *FileHandler) RestoreFileVersion(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid file ID"})
		return
	}

	versionStr := c.Param("version")
	version, err := strconv.Atoi(versionStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid version"})
		return
	}

	response, err := h.storageService.RestoreFileVersion(id, version)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "File or version not found"})
		return
	}

	c.JSON(http.StatusOK, response)
}

// GetStorageStats handles storage statistics
func (h *FileHandler) GetStorageStats(c *gin.Context) {
	tenantID := c.Query("tenantId")

	stats, err := h.storageService.GetStorageStats(tenantID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, stats)
}

// SearchFiles handles file search
func (h *FileHandler) SearchFiles(c *gin.Context) {
	query := c.Query("query")
	if query == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Query parameter is required"})
		return
	}

	tenantID := c.Query("tenantId")
	fileType := c.Query("fileType")
	pageStr := c.DefaultQuery("page", "1")
	pageSizeStr := c.DefaultQuery("pageSize", "20")

	// Parse pagination parameters
	page, err := strconv.Atoi(pageStr)
	if err != nil || page < 1 {
		page = 1
	}
	pageSize, err := strconv.Atoi(pageSizeStr)
	if err != nil || pageSize < 1 || pageSize > 100 {
		pageSize = 20
	}

	response, err := h.storageService.SearchFiles(query, tenantID, fileType, page, pageSize)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, response)
}
