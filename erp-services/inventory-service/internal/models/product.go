package models

import (
	"database/sql/driver"
	"encoding/json"
	"fmt"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// Category represents product categories
type Category struct {
	BaseModel
	Name        string     `json:"name" gorm:"size:100;not null" validate:"required,min=2,max=100"`
	Description string     `json:"description" gorm:"size:500"`
	ParentID    *uuid.UUID `json:"parent_id,omitempty" gorm:"type:uuid"`
	Parent      *Category  `json:"parent,omitempty" gorm:"foreignKey:ParentID"`
	Children    []Category `json:"children,omitempty" gorm:"foreignKey:ParentID"`
	Status      Status     `json:"status" gorm:"default:active" validate:"oneof=active inactive"`
	SortOrder   int        `json:"sort_order" gorm:"default:0"`
}

// Unit represents measurement units
type Unit struct {
	BaseModel
	Name           string  `json:"name" gorm:"size:50;not null" validate:"required,min=1,max=50"`
	Symbol         string  `json:"symbol" gorm:"size:10;not null" validate:"required,max=10"`
	Description    string  `json:"description" gorm:"size:200"`
	BaseUnit       *string `json:"base_unit,omitempty" gorm:"size:50"`
	ConversionRate float64 `json:"conversion_rate" gorm:"default:1"`
	UnitType       string  `json:"unit_type" gorm:"size:50"` // weight, volume, length, quantity
	Status         Status  `json:"status" gorm:"default:active"`
}

// Supplier represents product suppliers
type Supplier struct {
	BaseModel
	Code          string     `json:"code" gorm:"size:50;uniqueIndex:idx_supplier_tenant_code" validate:"required,max=50"`
	Name          string     `json:"name" gorm:"size:200;not null" validate:"required,min=2,max=200"`
	ContactPerson string     `json:"contact_person" gorm:"size:100"`
	Email         string     `json:"email" gorm:"size:100" validate:"omitempty,email"`
	Phone         string     `json:"phone" gorm:"size:20"`
	Address       string     `json:"address" gorm:"size:500"`
	City          string     `json:"city" gorm:"size:100"`
	State         string     `json:"state" gorm:"size:100"`
	Country       string     `json:"country" gorm:"size:100"`
	PostalCode    string     `json:"postal_code" gorm:"size:20"`
	TaxNumber     string     `json:"tax_number" gorm:"size:50"`
	PaymentTerms  string     `json:"payment_terms" gorm:"size:50;default:NET30"`
	Currency      string     `json:"currency" gorm:"size:3;default:USD"`
	CreditLimit   float64    `json:"credit_limit" gorm:"default:0"`
	Rating        int        `json:"rating" gorm:"default:0"` // 1-5 stars
	Status        Status     `json:"status" gorm:"default:active"`
	LastOrderDate *time.Time `json:"last_order_date,omitempty"`
	Notes         string     `json:"notes" gorm:"type:text"`
}

// Product represents inventory products
type Product struct {
	BaseModel
	SKU             string            `json:"sku" gorm:"size:100;uniqueIndex:idx_product_tenant_sku" validate:"required,max=100"`
	Name            string            `json:"name" gorm:"size:200;not null" validate:"required,min=2,max=200"`
	Description     string            `json:"description" gorm:"type:text"`
	CategoryID      uuid.UUID         `json:"category_id" gorm:"type:uuid;not null" validate:"required"`
	Category        Category          `json:"category" gorm:"foreignKey:CategoryID"`
	UnitID          uuid.UUID         `json:"unit_id" gorm:"type:uuid;not null" validate:"required"`
	Unit            Unit              `json:"unit" gorm:"foreignKey:UnitID"`
	Brand           string            `json:"brand" gorm:"size:100"`
	Model           string            `json:"model" gorm:"size:100"`
	Barcode         string            `json:"barcode" gorm:"size:100;uniqueIndex:idx_product_tenant_barcode"`
	QRCode          string            `json:"qr_code" gorm:"size:200"`
	Weight          float64           `json:"weight" gorm:"default:0"`
	WeightUnit      string            `json:"weight_unit" gorm:"size:10;default:kg"`
	Dimensions      ProductDimension  `json:"dimensions" gorm:"type:jsonb"`
	CostPrice       float64           `json:"cost_price" gorm:"default:0"`
	SellingPrice    float64           `json:"selling_price" gorm:"default:0"`
	Currency        string            `json:"currency" gorm:"size:3;default:USD"`
	MinStockLevel   int               `json:"min_stock_level" gorm:"default:0"`
	MaxStockLevel   int               `json:"max_stock_level" gorm:"default:0"`
	ReorderLevel    int               `json:"reorder_level" gorm:"default:0"`
	ReorderQuantity int               `json:"reorder_quantity" gorm:"default:0"`
	LeadTime        int               `json:"lead_time" gorm:"default:0"`  // in days
	ShelfLife       int               `json:"shelf_life" gorm:"default:0"` // in days
	IsPerishable    bool              `json:"is_perishable" gorm:"default:false"`
	IsSerialTracked bool              `json:"is_serial_tracked" gorm:"default:false"`
	IsBatchTracked  bool              `json:"is_batch_tracked" gorm:"default:false"`
	Status          Status            `json:"status" gorm:"default:active"`
	Tags            ProductTags       `json:"tags" gorm:"type:jsonb"`
	Images          ProductImages     `json:"images" gorm:"type:jsonb"`
	Attributes      ProductAttributes `json:"attributes" gorm:"type:jsonb"`

	// Relationships
	Variants    []ProductVariant `json:"variants,omitempty" gorm:"foreignKey:ProductID"`
	StockLevels []StockLevel     `json:"stock_levels,omitempty" gorm:"foreignKey:ProductID"`
	Suppliers   []Supplier       `json:"suppliers,omitempty" gorm:"many2many:product_suppliers;"`
}

// ProductVariant represents product variants (size, color, etc.)
type ProductVariant struct {
	BaseModel
	ProductID    uuid.UUID         `json:"product_id" gorm:"type:uuid;not null"`
	Product      Product           `json:"product" gorm:"foreignKey:ProductID"`
	SKU          string            `json:"sku" gorm:"size:100;uniqueIndex:idx_variant_tenant_sku" validate:"required,max=100"`
	Name         string            `json:"name" gorm:"size:200;not null" validate:"required,min=2,max=200"`
	Barcode      string            `json:"barcode" gorm:"size:100;uniqueIndex:idx_variant_tenant_barcode"`
	CostPrice    float64           `json:"cost_price" gorm:"default:0"`
	SellingPrice float64           `json:"selling_price" gorm:"default:0"`
	Weight       float64           `json:"weight" gorm:"default:0"`
	Dimensions   ProductDimension  `json:"dimensions" gorm:"type:jsonb"`
	Status       Status            `json:"status" gorm:"default:active"`
	Attributes   ProductAttributes `json:"attributes" gorm:"type:jsonb"` // color, size, etc.
	Images       ProductImages     `json:"images" gorm:"type:jsonb"`

	// Relationships
	StockLevels []StockLevel `json:"stock_levels,omitempty" gorm:"foreignKey:ProductVariantID"`
}

// Custom types for JSONB fields
type ProductDimension struct {
	Length float64 `json:"length"`
	Width  float64 `json:"width"`
	Height float64 `json:"height"`
	Unit   string  `json:"unit"` // cm, m, in, ft
}

type ProductTags []string

type ProductImages []ProductImage

type ProductImage struct {
	URL       string `json:"url"`
	Alt       string `json:"alt"`
	IsPrimary bool   `json:"is_primary"`
	SortOrder int    `json:"sort_order"`
}

type ProductAttributes map[string]interface{}

// Implement driver.Valuer and sql.Scanner for JSONB fields
func (d ProductDimension) Value() (driver.Value, error) {
	return json.Marshal(d)
}

func (d *ProductDimension) Scan(value interface{}) error {
	if value == nil {
		return nil
	}

	bytes, ok := value.([]byte)
	if !ok {
		return fmt.Errorf("cannot scan %T into ProductDimension", value)
	}

	return json.Unmarshal(bytes, d)
}

func (t ProductTags) Value() (driver.Value, error) {
	return json.Marshal(t)
}

func (t *ProductTags) Scan(value interface{}) error {
	if value == nil {
		return nil
	}

	bytes, ok := value.([]byte)
	if !ok {
		return fmt.Errorf("cannot scan %T into ProductTags", value)
	}

	return json.Unmarshal(bytes, t)
}

func (i ProductImages) Value() (driver.Value, error) {
	return json.Marshal(i)
}

func (i *ProductImages) Scan(value interface{}) error {
	if value == nil {
		return nil
	}

	bytes, ok := value.([]byte)
	if !ok {
		return fmt.Errorf("cannot scan %T into ProductImages", value)
	}

	return json.Unmarshal(bytes, i)
}

func (a ProductAttributes) Value() (driver.Value, error) {
	return json.Marshal(a)
}

func (a *ProductAttributes) Scan(value interface{}) error {
	if value == nil {
		return nil
	}

	bytes, ok := value.([]byte)
	if !ok {
		return fmt.Errorf("cannot scan %T into ProductAttributes", value)
	}

	return json.Unmarshal(bytes, a)
}

// BeforeCreate hooks
func (p *Product) BeforeCreate(tx *gorm.DB) error {
	p.BaseModel.BeforeCreate(tx)

	// Auto-generate barcode if enabled and not provided
	if p.Barcode == "" {
		p.Barcode = fmt.Sprintf("PRD%d", time.Now().Unix())
	}

	return nil
}

func (v *ProductVariant) BeforeCreate(tx *gorm.DB) error {
	v.BaseModel.BeforeCreate(tx)

	// Auto-generate barcode if not provided
	if v.Barcode == "" {
		v.Barcode = fmt.Sprintf("VAR%d", time.Now().Unix())
	}

	return nil
}
