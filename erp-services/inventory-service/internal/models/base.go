package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// BaseModel contains common fields for all models
type BaseModel struct {
	ID        uuid.UUID `json:"id" gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	TenantID  uuid.UUID `json:"tenant_id" gorm:"type:uuid;not null;index"`
	CreatedAt time.Time `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt time.Time `json:"updated_at" gorm:"autoUpdateTime"`
	CreatedBy string    `json:"created_by,omitempty" gorm:"size:255"`
	UpdatedBy string    `json:"updated_by,omitempty" gorm:"size:255"`
}

// BeforeCreate will set a UUID rather than numeric ID
func (base *BaseModel) BeforeCreate(tx *gorm.DB) error {
	if base.ID == uuid.Nil {
		base.ID = uuid.New()
	}
	return nil
}

// SoftDeleteModel extends BaseModel with soft delete functionality
type SoftDeleteModel struct {
	BaseModel
	DeletedAt gorm.DeletedAt `json:"deleted_at,omitempty" gorm:"index"`
	DeletedBy string         `json:"deleted_by,omitempty" gorm:"size:255"`
}

// AuditModel contains audit trail fields
type AuditModel struct {
	Version   int       `json:"version" gorm:"default:1"`
	UpdatedBy string    `json:"updated_by,omitempty" gorm:"size:255"`
	UpdatedAt time.Time `json:"updated_at" gorm:"autoUpdateTime"`
}

// BeforeUpdate increments version for audit trail
func (audit *AuditModel) BeforeUpdate(tx *gorm.DB) error {
	audit.Version++
	return nil
}

// Status represents common status values
type Status string

const (
	StatusActive    Status = "active"
	StatusInactive  Status = "inactive"
	StatusDraft     Status = "draft"
	StatusPending   Status = "pending"
	StatusApproved  Status = "approved"
	StatusRejected  Status = "rejected"
	StatusCancelled Status = "cancelled"
	StatusCompleted Status = "completed"
)

// StockMovementType represents types of stock movements
type StockMovementType string

const (
	StockMovementIn         StockMovementType = "IN"
	StockMovementOut        StockMovementType = "OUT"
	StockMovementTransfer   StockMovementType = "TRANSFER"
	StockMovementAdjustment StockMovementType = "ADJUSTMENT"
	StockMovementReturn     StockMovementType = "RETURN"
	StockMovementDamaged    StockMovementType = "DAMAGED"
	StockMovementExpired    StockMovementType = "EXPIRED"
)

// Priority levels
type Priority string

const (
	PriorityLow    Priority = "low"
	PriorityMedium Priority = "medium"
	PriorityHigh   Priority = "high"
	PriorityUrgent Priority = "urgent"
)

// Common validation tags
const (
	ValidationRequired = "required"
	ValidationEmail    = "email"
	ValidationMin      = "min"
	ValidationMax      = "max"
	ValidationOneof    = "oneof"
)
