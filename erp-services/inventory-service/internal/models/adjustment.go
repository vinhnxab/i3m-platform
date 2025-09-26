package models

import (
	"fmt"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// StockAdjustment represents stock adjustments (cycle counts, corrections)
type StockAdjustment struct {
	BaseModel
	AdjustmentNumber string    `json:"adjustment_number" gorm:"size:50;uniqueIndex:idx_adjustment_tenant_number"`
	WarehouseID      uuid.UUID `json:"warehouse_id" gorm:"type:uuid;not null"`
	Warehouse        Warehouse `json:"warehouse" gorm:"foreignKey:WarehouseID"`

	AdjustmentType string    `json:"adjustment_type" gorm:"size:50;not null"` // cycle_count, correction, write_off
	AdjustmentDate time.Time `json:"adjustment_date" gorm:"not null"`

	Status Status `json:"status" gorm:"default:draft"`

	TotalItems       int     `json:"total_items" gorm:"default:0"`
	TotalAdjustments int     `json:"total_adjustments" gorm:"default:0"`
	TotalValue       float64 `json:"total_value" gorm:"default:0"`

	Reason string `json:"reason" gorm:"size:500"`
	Notes  string `json:"notes" gorm:"type:text"`

	// Approval workflow
	ApprovedBy string     `json:"approved_by,omitempty" gorm:"size:255"`
	ApprovedAt *time.Time `json:"approved_at,omitempty"`

	// Relationships
	Items []StockAdjustmentItem `json:"items,omitempty" gorm:"foreignKey:StockAdjustmentID"`
}

// StockAdjustmentItem represents individual items in a stock adjustment
type StockAdjustmentItem struct {
	BaseModel
	StockAdjustmentID uuid.UUID       `json:"stock_adjustment_id" gorm:"type:uuid;not null"`
	StockAdjustment   StockAdjustment `json:"stock_adjustment" gorm:"foreignKey:StockAdjustmentID"`
	ProductID         *uuid.UUID      `json:"product_id,omitempty" gorm:"type:uuid"`
	Product           *Product        `json:"product,omitempty" gorm:"foreignKey:ProductID"`
	ProductVariantID  *uuid.UUID      `json:"product_variant_id,omitempty" gorm:"type:uuid"`
	ProductVariant    *ProductVariant `json:"product_variant,omitempty" gorm:"foreignKey:ProductVariantID"`
	LocationID        *uuid.UUID      `json:"location_id,omitempty" gorm:"type:uuid"`
	Location          *Location       `json:"location,omitempty" gorm:"foreignKey:LocationID"`

	SystemQuantity     int `json:"system_quantity" gorm:"not null"`     // Current system quantity
	PhysicalQuantity   int `json:"physical_quantity" gorm:"not null"`   // Actual counted quantity
	AdjustmentQuantity int `json:"adjustment_quantity" gorm:"not null"` // Difference (physical - system)

	UnitCost  float64 `json:"unit_cost" gorm:"default:0"`
	TotalCost float64 `json:"total_cost" gorm:"default:0"`

	BatchNumber  string     `json:"batch_number" gorm:"size:100"`
	SerialNumber string     `json:"serial_number" gorm:"size:100"`
	ExpiryDate   *time.Time `json:"expiry_date,omitempty"`

	Reason string `json:"reason" gorm:"size:500"`
	Notes  string `json:"notes" gorm:"size:500"`
}

// StockTransfer represents stock transfers between locations/warehouses
type StockTransfer struct {
	BaseModel
	TransferNumber string `json:"transfer_number" gorm:"size:50;uniqueIndex:idx_transfer_tenant_number"`

	FromWarehouseID uuid.UUID `json:"from_warehouse_id" gorm:"type:uuid;not null"`
	FromWarehouse   Warehouse `json:"from_warehouse" gorm:"foreignKey:FromWarehouseID"`
	ToWarehouseID   uuid.UUID `json:"to_warehouse_id" gorm:"type:uuid;not null"`
	ToWarehouse     Warehouse `json:"to_warehouse" gorm:"foreignKey:ToWarehouseID"`

	TransferDate  time.Time  `json:"transfer_date" gorm:"not null"`
	ExpectedDate  *time.Time `json:"expected_date,omitempty"`
	CompletedDate *time.Time `json:"completed_date,omitempty"`

	Status   Status   `json:"status" gorm:"default:draft"`
	Priority Priority `json:"priority" gorm:"default:medium"`

	TotalItems    int     `json:"total_items" gorm:"default:0"`
	TotalQuantity int     `json:"total_quantity" gorm:"default:0"`
	TotalValue    float64 `json:"total_value" gorm:"default:0"`

	Reason string `json:"reason" gorm:"size:500"`
	Notes  string `json:"notes" gorm:"type:text"`

	// Tracking
	ShippingMethod string `json:"shipping_method" gorm:"size:100"`
	TrackingNumber string `json:"tracking_number" gorm:"size:100"`
	Carrier        string `json:"carrier" gorm:"size:100"`

	// Approval workflow
	ApprovedBy string     `json:"approved_by,omitempty" gorm:"size:255"`
	ApprovedAt *time.Time `json:"approved_at,omitempty"`

	// Relationships
	Items []StockTransferItem `json:"items,omitempty" gorm:"foreignKey:StockTransferID"`
}

// StockTransferItem represents individual items in a stock transfer
type StockTransferItem struct {
	BaseModel
	StockTransferID  uuid.UUID       `json:"stock_transfer_id" gorm:"type:uuid;not null"`
	StockTransfer    StockTransfer   `json:"stock_transfer" gorm:"foreignKey:StockTransferID"`
	ProductID        *uuid.UUID      `json:"product_id,omitempty" gorm:"type:uuid"`
	Product          *Product        `json:"product,omitempty" gorm:"foreignKey:ProductID"`
	ProductVariantID *uuid.UUID      `json:"product_variant_id,omitempty" gorm:"type:uuid"`
	ProductVariant   *ProductVariant `json:"product_variant,omitempty" gorm:"foreignKey:ProductVariantID"`

	FromLocationID *uuid.UUID `json:"from_location_id,omitempty" gorm:"type:uuid"`
	FromLocation   *Location  `json:"from_location,omitempty" gorm:"foreignKey:FromLocationID"`
	ToLocationID   *uuid.UUID `json:"to_location_id,omitempty" gorm:"type:uuid"`
	ToLocation     *Location  `json:"to_location,omitempty" gorm:"foreignKey:ToLocationID"`

	RequestedQuantity int `json:"requested_quantity" gorm:"not null"`
	ShippedQuantity   int `json:"shipped_quantity" gorm:"default:0"`
	ReceivedQuantity  int `json:"received_quantity" gorm:"default:0"`

	UnitCost  float64 `json:"unit_cost" gorm:"default:0"`
	TotalCost float64 `json:"total_cost" gorm:"default:0"`

	BatchNumber  string     `json:"batch_number" gorm:"size:100"`
	SerialNumber string     `json:"serial_number" gorm:"size:100"`
	ExpiryDate   *time.Time `json:"expiry_date,omitempty"`

	Notes string `json:"notes" gorm:"size:500"`
}

// BeforeCreate hooks
func (sa *StockAdjustment) BeforeCreate(tx *gorm.DB) error {
	sa.BaseModel.BeforeCreate(tx)

	// Auto-generate adjustment number
	if sa.AdjustmentNumber == "" {
		sa.AdjustmentNumber = GenerateAdjustmentNumber()
	}

	return nil
}

func (st *StockTransfer) BeforeCreate(tx *gorm.DB) error {
	st.BaseModel.BeforeCreate(tx)

	// Auto-generate transfer number
	if st.TransferNumber == "" {
		st.TransferNumber = GenerateTransferNumber()
	}

	return nil
}

func (sai *StockAdjustmentItem) BeforeCreate(tx *gorm.DB) error {
	sai.BaseModel.BeforeCreate(tx)

	// Calculate adjustment quantity
	sai.AdjustmentQuantity = sai.PhysicalQuantity - sai.SystemQuantity

	// Calculate total cost
	sai.TotalCost = sai.UnitCost * float64(sai.AdjustmentQuantity)

	return nil
}

func (sti *StockTransferItem) BeforeCreate(tx *gorm.DB) error {
	sti.BaseModel.BeforeCreate(tx)

	// Calculate total cost
	sti.TotalCost = sti.UnitCost * float64(sti.RequestedQuantity)

	return nil
}

// Helper functions
func GenerateAdjustmentNumber() string {
	return fmt.Sprintf("ADJ%d", time.Now().Unix())
}

func GenerateTransferNumber() string {
	return fmt.Sprintf("TRF%d", time.Now().Unix())
}
