package models

import (
	"fmt"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// Warehouse represents storage locations
type Warehouse struct {
	BaseModel
	Code        string `json:"code" gorm:"size:50;uniqueIndex:idx_warehouse_tenant_code" validate:"required,max=50"`
	Name        string `json:"name" gorm:"size:200;not null" validate:"required,min=2,max=200"`
	Description string `json:"description" gorm:"size:500"`
	Address     string `json:"address" gorm:"size:500"`
	City        string `json:"city" gorm:"size:100"`
	State       string `json:"state" gorm:"size:100"`
	Country     string `json:"country" gorm:"size:100"`
	PostalCode  string `json:"postal_code" gorm:"size:20"`
	Phone       string `json:"phone" gorm:"size:20"`
	Email       string `json:"email" gorm:"size:100" validate:"omitempty,email"`
	ManagerName string `json:"manager_name" gorm:"size:100"`
	IsDefault   bool   `json:"is_default" gorm:"default:false"`
	Status      Status `json:"status" gorm:"default:active"`

	// Relationships
	Locations   []Location   `json:"locations,omitempty" gorm:"foreignKey:WarehouseID"`
	StockLevels []StockLevel `json:"stock_levels,omitempty" gorm:"foreignKey:WarehouseID"`
}

// Location represents specific locations within a warehouse
type Location struct {
	BaseModel
	WarehouseID  uuid.UUID `json:"warehouse_id" gorm:"type:uuid;not null"`
	Warehouse    Warehouse `json:"warehouse" gorm:"foreignKey:WarehouseID"`
	Code         string    `json:"code" gorm:"size:50;not null" validate:"required,max=50"`
	Name         string    `json:"name" gorm:"size:200;not null" validate:"required,min=2,max=200"`
	Description  string    `json:"description" gorm:"size:500"`
	Zone         string    `json:"zone" gorm:"size:50"`       // A, B, C
	Aisle        string    `json:"aisle" gorm:"size:50"`      // 01, 02, 03
	Rack         string    `json:"rack" gorm:"size:50"`       // R1, R2, R3
	Shelf        string    `json:"shelf" gorm:"size:50"`      // S1, S2, S3
	Bin          string    `json:"bin" gorm:"size:50"`        // B1, B2, B3
	Capacity     float64   `json:"capacity" gorm:"default:0"` // Maximum capacity
	Unit         string    `json:"unit" gorm:"size:20"`       // pcs, kg, m3
	IsPickable   bool      `json:"is_pickable" gorm:"default:true"`
	IsReceivable bool      `json:"is_receivable" gorm:"default:true"`
	Status       Status    `json:"status" gorm:"default:active"`

	// Relationships
	StockLevels []StockLevel `json:"stock_levels,omitempty" gorm:"foreignKey:LocationID"`
}

// StockLevel represents current stock levels
type StockLevel struct {
	BaseModel
	ProductID        *uuid.UUID      `json:"product_id,omitempty" gorm:"type:uuid"`
	Product          *Product        `json:"product,omitempty" gorm:"foreignKey:ProductID"`
	ProductVariantID *uuid.UUID      `json:"product_variant_id,omitempty" gorm:"type:uuid"`
	ProductVariant   *ProductVariant `json:"product_variant,omitempty" gorm:"foreignKey:ProductVariantID"`
	WarehouseID      uuid.UUID       `json:"warehouse_id" gorm:"type:uuid;not null"`
	Warehouse        Warehouse       `json:"warehouse" gorm:"foreignKey:WarehouseID"`
	LocationID       *uuid.UUID      `json:"location_id,omitempty" gorm:"type:uuid"`
	Location         *Location       `json:"location,omitempty" gorm:"foreignKey:LocationID"`

	QuantityOnHand    int `json:"quantity_on_hand" gorm:"default:0"`
	QuantityReserved  int `json:"quantity_reserved" gorm:"default:0"`
	QuantityAvailable int `json:"quantity_available" gorm:"default:0"`
	QuantityInTransit int `json:"quantity_in_transit" gorm:"default:0"`

	CostPerUnit      float64    `json:"cost_per_unit" gorm:"default:0"`
	TotalValue       float64    `json:"total_value" gorm:"default:0"`
	LastMovementDate *time.Time `json:"last_movement_date,omitempty"`
	LastCountDate    *time.Time `json:"last_count_date,omitempty"`

	// Batch/Serial tracking
	BatchNumber     string     `json:"batch_number" gorm:"size:100"`
	SerialNumber    string     `json:"serial_number" gorm:"size:100"`
	ExpiryDate      *time.Time `json:"expiry_date,omitempty"`
	ManufactureDate *time.Time `json:"manufacture_date,omitempty"`
}

// StockMovement represents stock transactions
type StockMovement struct {
	BaseModel
	MovementNumber   string            `json:"movement_number" gorm:"size:50;uniqueIndex:idx_movement_tenant_number"`
	MovementType     StockMovementType `json:"movement_type" gorm:"not null"`
	ProductID        *uuid.UUID        `json:"product_id,omitempty" gorm:"type:uuid"`
	Product          *Product          `json:"product,omitempty" gorm:"foreignKey:ProductID"`
	ProductVariantID *uuid.UUID        `json:"product_variant_id,omitempty" gorm:"type:uuid"`
	ProductVariant   *ProductVariant   `json:"product_variant,omitempty" gorm:"foreignKey:ProductVariantID"`

	FromWarehouseID *uuid.UUID `json:"from_warehouse_id,omitempty" gorm:"type:uuid"`
	FromWarehouse   *Warehouse `json:"from_warehouse,omitempty" gorm:"foreignKey:FromWarehouseID"`
	FromLocationID  *uuid.UUID `json:"from_location_id,omitempty" gorm:"type:uuid"`
	FromLocation    *Location  `json:"from_location,omitempty" gorm:"foreignKey:FromLocationID"`

	ToWarehouseID *uuid.UUID `json:"to_warehouse_id,omitempty" gorm:"type:uuid"`
	ToWarehouse   *Warehouse `json:"to_warehouse,omitempty" gorm:"foreignKey:ToWarehouseID"`
	ToLocationID  *uuid.UUID `json:"to_location_id,omitempty" gorm:"type:uuid"`
	ToLocation    *Location  `json:"to_location,omitempty" gorm:"foreignKey:ToLocationID"`

	Quantity  int     `json:"quantity" gorm:"not null"`
	UnitCost  float64 `json:"unit_cost" gorm:"default:0"`
	TotalCost float64 `json:"total_cost" gorm:"default:0"`

	BatchNumber  string     `json:"batch_number" gorm:"size:100"`
	SerialNumber string     `json:"serial_number" gorm:"size:100"`
	ExpiryDate   *time.Time `json:"expiry_date,omitempty"`

	Reason          string `json:"reason" gorm:"size:500"`
	ReferenceType   string `json:"reference_type" gorm:"size:50"` // purchase_order, sales_order, adjustment, etc.
	ReferenceID     string `json:"reference_id" gorm:"size:100"`
	ReferenceNumber string `json:"reference_number" gorm:"size:100"`

	MovementDate time.Time `json:"movement_date" gorm:"not null"`
	Status       Status    `json:"status" gorm:"default:completed"`

	Notes string `json:"notes" gorm:"type:text"`
}

// PurchaseOrder represents purchase orders from suppliers
type PurchaseOrder struct {
	BaseModel
	OrderNumber string    `json:"order_number" gorm:"size:50;uniqueIndex:idx_po_tenant_number"`
	SupplierID  uuid.UUID `json:"supplier_id" gorm:"type:uuid;not null"`
	Supplier    Supplier  `json:"supplier" gorm:"foreignKey:SupplierID"`
	WarehouseID uuid.UUID `json:"warehouse_id" gorm:"type:uuid;not null"`
	Warehouse   Warehouse `json:"warehouse" gorm:"foreignKey:WarehouseID"`

	OrderDate    time.Time  `json:"order_date" gorm:"not null"`
	ExpectedDate *time.Time `json:"expected_date,omitempty"`
	ReceivedDate *time.Time `json:"received_date,omitempty"`

	Status   Status   `json:"status" gorm:"default:draft"`
	Priority Priority `json:"priority" gorm:"default:medium"`

	Currency     string  `json:"currency" gorm:"size:3;default:USD"`
	ExchangeRate float64 `json:"exchange_rate" gorm:"default:1"`

	SubTotal     float64 `json:"sub_total" gorm:"default:0"`
	TaxAmount    float64 `json:"tax_amount" gorm:"default:0"`
	ShippingCost float64 `json:"shipping_cost" gorm:"default:0"`
	TotalAmount  float64 `json:"total_amount" gorm:"default:0"`

	PaymentTerms  string `json:"payment_terms" gorm:"size:50"`
	DeliveryTerms string `json:"delivery_terms" gorm:"size:100"`

	Notes         string `json:"notes" gorm:"type:text"`
	InternalNotes string `json:"internal_notes" gorm:"type:text"`

	// Relationships
	Items []PurchaseOrderItem `json:"items,omitempty" gorm:"foreignKey:PurchaseOrderID"`
}

// PurchaseOrderItem represents individual items in a purchase order
type PurchaseOrderItem struct {
	BaseModel
	PurchaseOrderID  uuid.UUID       `json:"purchase_order_id" gorm:"type:uuid;not null"`
	PurchaseOrder    PurchaseOrder   `json:"purchase_order" gorm:"foreignKey:PurchaseOrderID"`
	ProductID        *uuid.UUID      `json:"product_id,omitempty" gorm:"type:uuid"`
	Product          *Product        `json:"product,omitempty" gorm:"foreignKey:ProductID"`
	ProductVariantID *uuid.UUID      `json:"product_variant_id,omitempty" gorm:"type:uuid"`
	ProductVariant   *ProductVariant `json:"product_variant,omitempty" gorm:"foreignKey:ProductVariantID"`

	Quantity         int     `json:"quantity" gorm:"not null"`
	ReceivedQuantity int     `json:"received_quantity" gorm:"default:0"`
	UnitPrice        float64 `json:"unit_price" gorm:"not null"`
	TotalPrice       float64 `json:"total_price" gorm:"not null"`

	TaxRate   float64 `json:"tax_rate" gorm:"default:0"`
	TaxAmount float64 `json:"tax_amount" gorm:"default:0"`

	Notes string `json:"notes" gorm:"size:500"`
}

// BeforeCreate hooks
func (sm *StockMovement) BeforeCreate(tx *gorm.DB) error {
	sm.BaseModel.BeforeCreate(tx)

	// Auto-generate movement number
	if sm.MovementNumber == "" {
		sm.MovementNumber = GenerateMovementNumber(sm.MovementType)
	}

	// Calculate total cost
	sm.TotalCost = sm.UnitCost * float64(sm.Quantity)

	return nil
}

func (po *PurchaseOrder) BeforeCreate(tx *gorm.DB) error {
	po.BaseModel.BeforeCreate(tx)

	// Auto-generate order number
	if po.OrderNumber == "" {
		po.OrderNumber = GeneratePurchaseOrderNumber()
	}

	return nil
}

// Helper functions
func GenerateMovementNumber(movementType StockMovementType) string {
	prefix := map[StockMovementType]string{
		StockMovementIn:         "IN",
		StockMovementOut:        "OUT",
		StockMovementTransfer:   "TRF",
		StockMovementAdjustment: "ADJ",
		StockMovementReturn:     "RET",
		StockMovementDamaged:    "DMG",
		StockMovementExpired:    "EXP",
	}

	return fmt.Sprintf("%s%d", prefix[movementType], time.Now().Unix())
}

func GeneratePurchaseOrderNumber() string {
	return fmt.Sprintf("PO%d", time.Now().Unix())
}
