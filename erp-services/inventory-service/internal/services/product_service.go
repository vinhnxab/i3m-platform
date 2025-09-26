package services

import (
	"context"
	"fmt"

	"inventory-service/internal/models"
	"inventory-service/pkg/errors"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type ProductService struct {
	db *gorm.DB
}

type ProductFilters struct {
	TenantID uuid.UUID
	Category string
	Status   string
	Search   string
	Page     int
	Limit    int
}

func NewProductService(db *gorm.DB) *ProductService {
	return &ProductService{
		db: db,
	}
}

func (s *ProductService) GetProducts(ctx context.Context, filters *ProductFilters) ([]*models.Product, int64, error) {
	var products []*models.Product
	var total int64

	query := s.db.WithContext(ctx).Model(&models.Product{}).
		Where("tenant_id = ?", filters.TenantID)

	// Apply filters
	if filters.Category != "" {
		query = query.Joins("JOIN categories ON categories.id = products.category_id").
			Where("categories.name ILIKE ?", "%"+filters.Category+"%")
	}

	if filters.Status != "" {
		query = query.Where("status = ?", filters.Status)
	}

	if filters.Search != "" {
		searchTerm := "%" + filters.Search + "%"
		query = query.Where(
			"name ILIKE ? OR sku ILIKE ? OR description ILIKE ? OR barcode ILIKE ?",
			searchTerm, searchTerm, searchTerm, searchTerm,
		)
	}

	// Get total count
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count products: %w", err)
	}

	// Apply pagination and fetch products
	offset := (filters.Page - 1) * filters.Limit
	err := query.
		Preload("Category").
		Preload("Unit").
		Preload("Suppliers").
		Offset(offset).
		Limit(filters.Limit).
		Order("name ASC").
		Find(&products).Error

	if err != nil {
		return nil, 0, fmt.Errorf("failed to fetch products: %w", err)
	}

	return products, total, nil
}

func (s *ProductService) GetProduct(ctx context.Context, tenantID, productID uuid.UUID) (*models.Product, error) {
	var product models.Product

	err := s.db.WithContext(ctx).
		Where("id = ? AND tenant_id = ?", productID, tenantID).
		Preload("Category").
		Preload("Unit").
		Preload("Variants").
		Preload("StockLevels").
		Preload("StockLevels.Warehouse").
		Preload("StockLevels.Location").
		Preload("Suppliers").
		First(&product).Error

	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, errors.ErrNotFound
		}
		return nil, fmt.Errorf("failed to fetch product: %w", err)
	}

	return &product, nil
}

func (s *ProductService) CreateProduct(ctx context.Context, product *models.Product) (*models.Product, error) {
	// Check if SKU already exists for this tenant
	var existingProduct models.Product
	err := s.db.WithContext(ctx).
		Where("sku = ? AND tenant_id = ?", product.SKU, product.TenantID).
		First(&existingProduct).Error

	if err == nil {
		return nil, errors.ErrAlreadyExists
	}

	if err != gorm.ErrRecordNotFound {
		return nil, fmt.Errorf("failed to check existing product: %w", err)
	}

	// Create the product
	if err := s.db.WithContext(ctx).Create(product).Error; err != nil {
		return nil, fmt.Errorf("failed to create product: %w", err)
	}

	// Reload with associations
	return s.GetProduct(ctx, product.TenantID, product.ID)
}

func (s *ProductService) UpdateProduct(ctx context.Context, tenantID, productID uuid.UUID, updates *models.Product) (*models.Product, error) {
	// Check if product exists
	var existingProduct models.Product
	err := s.db.WithContext(ctx).
		Where("id = ? AND tenant_id = ?", productID, tenantID).
		First(&existingProduct).Error

	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, errors.ErrNotFound
		}
		return nil, fmt.Errorf("failed to fetch product: %w", err)
	}

	// Check SKU uniqueness if SKU is being updated
	if updates.SKU != "" && updates.SKU != existingProduct.SKU {
		var skuCheck models.Product
		err := s.db.WithContext(ctx).
			Where("sku = ? AND tenant_id = ? AND id != ?", updates.SKU, tenantID, productID).
			First(&skuCheck).Error

		if err == nil {
			return nil, errors.ErrAlreadyExists
		}

		if err != gorm.ErrRecordNotFound {
			return nil, fmt.Errorf("failed to check SKU uniqueness: %w", err)
		}
	}

	// Update the product
	if err := s.db.WithContext(ctx).Model(&existingProduct).Updates(updates).Error; err != nil {
		return nil, fmt.Errorf("failed to update product: %w", err)
	}

	// Return updated product with associations
	return s.GetProduct(ctx, tenantID, productID)
}

func (s *ProductService) DeleteProduct(ctx context.Context, tenantID, productID uuid.UUID, deletedBy string) error {
	// Check if product exists
	var product models.Product
	err := s.db.WithContext(ctx).
		Where("id = ? AND tenant_id = ?", productID, tenantID).
		First(&product).Error

	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return errors.ErrNotFound
		}
		return fmt.Errorf("failed to fetch product: %w", err)
	}

	// Soft delete the product
	if err := s.db.WithContext(ctx).Model(&product).Updates(map[string]interface{}{
		"deleted_by": deletedBy,
		"deleted_at": gorm.DeletedAt{Valid: true},
	}).Error; err != nil {
		return fmt.Errorf("failed to delete product: %w", err)
	}

	return nil
}

func (s *ProductService) GetProductBySKU(ctx context.Context, tenantID uuid.UUID, sku string) (*models.Product, error) {
	var product models.Product

	err := s.db.WithContext(ctx).
		Where("sku = ? AND tenant_id = ?", sku, tenantID).
		Preload("Category").
		Preload("Unit").
		First(&product).Error

	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, errors.ErrNotFound
		}
		return nil, fmt.Errorf("failed to fetch product by SKU: %w", err)
	}

	return &product, nil
}

func (s *ProductService) GetLowStockProducts(ctx context.Context, tenantID uuid.UUID) ([]*models.Product, error) {
	var products []*models.Product

	// This is a complex query that would join with stock levels
	// For now, return mock data
	err := s.db.WithContext(ctx).
		Where("tenant_id = ? AND status = ?", tenantID, models.StatusActive).
		Preload("Category").
		Preload("Unit").
		Preload("StockLevels").
		Find(&products).Error

	if err != nil {
		return nil, fmt.Errorf("failed to fetch low stock products: %w", err)
	}

	// Filter products with low stock
	var lowStockProducts []*models.Product
	for _, product := range products {
		for _, stockLevel := range product.StockLevels {
			if stockLevel.QuantityAvailable <= product.MinStockLevel {
				lowStockProducts = append(lowStockProducts, product)
				break
			}
		}
	}

	return lowStockProducts, nil
}
