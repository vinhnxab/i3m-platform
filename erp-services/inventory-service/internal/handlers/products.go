package handlers

import (
	"net/http"
	"strconv"

	"inventory-service/internal/config"
	"inventory-service/internal/models"
	"inventory-service/internal/services"
	"inventory-service/pkg/errors"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type ProductHandler struct {
	config         *config.Config
	productService *services.ProductService
}

func NewProductHandler(cfg *config.Config, productService *services.ProductService) *ProductHandler {
	return &ProductHandler{
		config:         cfg,
		productService: productService,
	}
}

// GetProducts godoc
// @Summary Get products with pagination and filtering
// @Description Get all products for tenant with pagination and filtering
// @Tags products
// @Accept json
// @Produce json
// @Param page query int false "Page number" default(1)
// @Param limit query int false "Items per page" default(20)
// @Param category query string false "Category filter"
// @Param status query string false "Status filter"
// @Param search query string false "Search term"
// @Success 200 {object} map[string]interface{}
// @Failure 400 {object} map[string]interface{}
// @Failure 500 {object} map[string]interface{}
// @Router /api/v1/products [get]
// @Security BearerAuth
func (h *ProductHandler) GetProducts(c *gin.Context) {
	tenantID, exists := c.Get("tenant_id")
	if !exists {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Tenant ID not found",
		})
		return
	}

	// Parse query parameters
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
	category := c.Query("category")
	status := c.Query("status")
	search := c.Query("search")

	// Validate pagination
	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > h.config.Pagination.MaxLimit {
		limit = h.config.Pagination.DefaultLimit
	}

	filters := &services.ProductFilters{
		TenantID: tenantID.(uuid.UUID),
		Category: category,
		Status:   status,
		Search:   search,
		Page:     page,
		Limit:    limit,
	}

	products, total, err := h.productService.GetProducts(c.Request.Context(), filters)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Failed to fetch products",
			"error":   err.Error(),
		})
		return
	}

	pagination := map[string]interface{}{
		"current":       page,
		"total":         (total + int64(limit) - 1) / int64(limit), // Ceiling division
		"count":         len(products),
		"total_records": total,
	}

	c.JSON(http.StatusOK, gin.H{
		"success":    true,
		"data":       products,
		"pagination": pagination,
	})
}

// GetProduct godoc
// @Summary Get product by ID
// @Description Get a specific product by ID
// @Tags products
// @Accept json
// @Produce json
// @Param id path string true "Product ID"
// @Success 200 {object} map[string]interface{}
// @Failure 400 {object} map[string]interface{}
// @Failure 404 {object} map[string]interface{}
// @Failure 500 {object} map[string]interface{}
// @Router /api/v1/products/{id} [get]
// @Security BearerAuth
func (h *ProductHandler) GetProduct(c *gin.Context) {
	tenantID, exists := c.Get("tenant_id")
	if !exists {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Tenant ID not found",
		})
		return
	}

	productID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Invalid product ID",
		})
		return
	}

	product, err := h.productService.GetProduct(c.Request.Context(), tenantID.(uuid.UUID), productID)
	if err != nil {
		if err == errors.ErrNotFound {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"message": "Product not found",
			})
			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Failed to fetch product",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    product,
	})
}

// CreateProduct godoc
// @Summary Create new product
// @Description Create a new product
// @Tags products
// @Accept json
// @Produce json
// @Param product body models.Product true "Product data"
// @Success 201 {object} map[string]interface{}
// @Failure 400 {object} map[string]interface{}
// @Failure 409 {object} map[string]interface{}
// @Failure 500 {object} map[string]interface{}
// @Router /api/v1/products [post]
// @Security BearerAuth
func (h *ProductHandler) CreateProduct(c *gin.Context) {
	tenantID, exists := c.Get("tenant_id")
	if !exists {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Tenant ID not found",
		})
		return
	}

	userID, _ := c.Get("user_id")

	var product models.Product
	if err := c.ShouldBindJSON(&product); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Invalid request data",
			"error":   err.Error(),
		})
		return
	}

	// Set tenant ID and creator
	product.TenantID = tenantID.(uuid.UUID)
	if userID != nil {
		product.CreatedBy = userID.(string)
	}

	createdProduct, err := h.productService.CreateProduct(c.Request.Context(), &product)
	if err != nil {
		if err == errors.ErrAlreadyExists {
			c.JSON(http.StatusConflict, gin.H{
				"success": false,
				"message": "Product with this SKU already exists",
			})
			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Failed to create product",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"message": "Product created successfully",
		"data":    createdProduct,
	})
}

// UpdateProduct godoc
// @Summary Update product
// @Description Update an existing product
// @Tags products
// @Accept json
// @Produce json
// @Param id path string true "Product ID"
// @Param product body models.Product true "Product data"
// @Success 200 {object} map[string]interface{}
// @Failure 400 {object} map[string]interface{}
// @Failure 404 {object} map[string]interface{}
// @Failure 500 {object} map[string]interface{}
// @Router /api/v1/products/{id} [put]
// @Security BearerAuth
func (h *ProductHandler) UpdateProduct(c *gin.Context) {
	tenantID, exists := c.Get("tenant_id")
	if !exists {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Tenant ID not found",
		})
		return
	}

	productID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Invalid product ID",
		})
		return
	}

	userID, _ := c.Get("user_id")

	var updates models.Product
	if err := c.ShouldBindJSON(&updates); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Invalid request data",
			"error":   err.Error(),
		})
		return
	}

	// Set updater
	if userID != nil {
		updates.UpdatedBy = userID.(string)
	}

	updatedProduct, err := h.productService.UpdateProduct(c.Request.Context(), tenantID.(uuid.UUID), productID, &updates)
	if err != nil {
		if err == errors.ErrNotFound {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"message": "Product not found",
			})
			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Failed to update product",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Product updated successfully",
		"data":    updatedProduct,
	})
}

// DeleteProduct godoc
// @Summary Delete product
// @Description Delete a product (soft delete)
// @Tags products
// @Accept json
// @Produce json
// @Param id path string true "Product ID"
// @Success 200 {object} map[string]interface{}
// @Failure 400 {object} map[string]interface{}
// @Failure 404 {object} map[string]interface{}
// @Failure 500 {object} map[string]interface{}
// @Router /api/v1/products/{id} [delete]
// @Security BearerAuth
func (h *ProductHandler) DeleteProduct(c *gin.Context) {
	tenantID, exists := c.Get("tenant_id")
	if !exists {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Tenant ID not found",
		})
		return
	}

	productID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Invalid product ID",
		})
		return
	}

	userID, _ := c.Get("user_id")
	deletedBy := ""
	if userID != nil {
		deletedBy = userID.(string)
	}

	err = h.productService.DeleteProduct(c.Request.Context(), tenantID.(uuid.UUID), productID, deletedBy)
	if err != nil {
		if err == errors.ErrNotFound {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"message": "Product not found",
			})
			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Failed to delete product",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Product deleted successfully",
	})
}
