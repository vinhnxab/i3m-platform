package models

import (
	"time"

	"github.com/google/uuid"
)

// Role represents a security role in the system
type Role struct {
	ID          uuid.UUID `json:"id" db:"id"`
	TenantID    uuid.UUID `json:"tenant_id" db:"tenant_id"`
	Name        string    `json:"name" db:"name"`
	Description string    `json:"description" db:"description"`
	CreatedAt   time.Time `json:"created_at" db:"created_at"`
	UpdatedAt   time.Time `json:"updated_at" db:"updated_at"`
}

// Permission represents a specific permission in the system
type Permission struct {
	ID          uuid.UUID `json:"id" db:"id"`
	Name        string    `json:"name" db:"name"`
	Resource    string    `json:"resource" db:"resource"`
	Action      string    `json:"action" db:"action"`
	Description string    `json:"description" db:"description"`
	CreatedAt   time.Time `json:"created_at" db:"created_at"`
}

// RolePermission represents the many-to-many relationship between roles and permissions
type RolePermission struct {
	RoleID       uuid.UUID `json:"role_id" db:"role_id"`
	PermissionID uuid.UUID `json:"permission_id" db:"permission_id"`
	CreatedAt    time.Time `json:"created_at" db:"created_at"`
}

// UserRole represents the many-to-many relationship between users and roles
type UserRole struct {
	UserID    uuid.UUID `json:"user_id" db:"user_id"`
	RoleID    uuid.UUID `json:"role_id" db:"role_id"`
	TenantID  uuid.UUID `json:"tenant_id" db:"tenant_id"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
}

// AuditLog represents security audit logs
type AuditLog struct {
	ID        uuid.UUID `json:"id" db:"id"`
	TenantID  uuid.UUID `json:"tenant_id" db:"tenant_id"`
	UserID    uuid.UUID `json:"user_id" db:"user_id"`
	Action    string    `json:"action" db:"action"`
	Resource  string    `json:"resource" db:"resource"`
	Details   string    `json:"details" db:"details"`
	IPAddress string    `json:"ip_address" db:"ip_address"`
	UserAgent string    `json:"user_agent" db:"user_agent"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
}

// ThreatAlert represents security threat alerts
type ThreatAlert struct {
	ID          uuid.UUID `json:"id" db:"id"`
	TenantID    uuid.UUID `json:"tenant_id" db:"tenant_id"`
	Type        string    `json:"type" db:"type"`
	Severity    string    `json:"severity" db:"severity"`
	Title       string    `json:"title" db:"title"`
	Description string    `json:"description" db:"description"`
	Source      string    `json:"source" db:"source"`
	Status      string    `json:"status" db:"status"`
	Score       int       `json:"score" db:"score"`
	Metadata    string    `json:"metadata" db:"metadata"`
	CreatedAt   time.Time `json:"created_at" db:"created_at"`
	UpdatedAt   time.Time `json:"updated_at" db:"updated_at"`
}

// AccessPolicy represents access control policies
type AccessPolicy struct {
	ID          uuid.UUID `json:"id" db:"id"`
	TenantID    uuid.UUID `json:"tenant_id" db:"tenant_id"`
	Name        string    `json:"name" db:"name"`
	Description string    `json:"description" db:"description"`
	Rules       string    `json:"rules" db:"rules"`
	Enabled     bool      `json:"enabled" db:"enabled"`
	CreatedAt   time.Time `json:"created_at" db:"created_at"`
	UpdatedAt   time.Time `json:"updated_at" db:"updated_at"`
}

// EncryptionRequest represents data encryption requests
type EncryptionRequest struct {
	Data      string `json:"data" binding:"required"`
	Algorithm string `json:"algorithm,omitempty"`
}

// EncryptionResponse represents data encryption responses
type EncryptionResponse struct {
	EncryptedData string `json:"encrypted_data"`
	Algorithm     string `json:"algorithm"`
	KeyID         string `json:"key_id,omitempty"`
}

// DecryptionRequest represents data decryption requests
type DecryptionRequest struct {
	EncryptedData string `json:"encrypted_data" binding:"required"`
	Algorithm     string `json:"algorithm,omitempty"`
	KeyID         string `json:"key_id,omitempty"`
}

// DecryptionResponse represents data decryption responses
type DecryptionResponse struct {
	Data string `json:"data"`
}

// HashRequest represents data hashing requests
type HashRequest struct {
	Data      string `json:"data" binding:"required"`
	Algorithm string `json:"algorithm,omitempty"`
	Salt      string `json:"salt,omitempty"`
}

// HashResponse represents data hashing responses
type HashResponse struct {
	Hash      string `json:"hash"`
	Algorithm string `json:"algorithm"`
	Salt      string `json:"salt,omitempty"`
}

// VerifyHashRequest represents hash verification requests
type VerifyHashRequest struct {
	Data      string `json:"data" binding:"required"`
	Hash      string `json:"hash" binding:"required"`
	Algorithm string `json:"algorithm,omitempty"`
	Salt      string `json:"salt,omitempty"`
}

// VerifyHashResponse represents hash verification responses
type VerifyHashResponse struct {
	Valid bool `json:"valid"`
}

// AccessCheckRequest represents access control check requests
type AccessCheckRequest struct {
	UserID   uuid.UUID `json:"user_id" binding:"required"`
	Resource string    `json:"resource" binding:"required"`
	Action   string    `json:"action" binding:"required"`
	TenantID uuid.UUID `json:"tenant_id" binding:"required"`
	Context  string    `json:"context,omitempty"`
}

// AccessCheckResponse represents access control check responses
type AccessCheckResponse struct {
	Allowed     bool     `json:"allowed"`
	Permissions []string `json:"permissions,omitempty"`
	Reason      string   `json:"reason,omitempty"`
}

// ThreatScanRequest represents threat scanning requests
type ThreatScanRequest struct {
	Content     string `json:"content" binding:"required"`
	ContentType string `json:"content_type,omitempty"`
	Source      string `json:"source,omitempty"`
}

// ThreatScanResponse represents threat scanning responses
type ThreatScanResponse struct {
	ThreatDetected  bool                    `json:"threat_detected"`
	Score           int                     `json:"score"`
	Threats         []ThreatDetectionResult `json:"threats,omitempty"`
	Recommendations []string                `json:"recommendations,omitempty"`
}

// ThreatDetectionResult represents individual threat detection results
type ThreatDetectionResult struct {
	Type        string `json:"type"`
	Severity    string `json:"severity"`
	Description string `json:"description"`
	Score       int    `json:"score"`
	Location    string `json:"location,omitempty"`
}

// ComplianceReport represents compliance reporting data
type ComplianceReport struct {
	TenantID        uuid.UUID             `json:"tenant_id"`
	ReportDate      time.Time             `json:"report_date"`
	Standards       []ComplianceStandard  `json:"standards"`
	OverallScore    int                   `json:"overall_score"`
	Recommendations []string              `json:"recommendations"`
	Violations      []ComplianceViolation `json:"violations"`
}

// ComplianceStandard represents compliance standards (GDPR, HIPAA, etc.)
type ComplianceStandard struct {
	Name        string `json:"name"`
	Score       int    `json:"score"`
	Status      string `json:"status"`
	Description string `json:"description"`
}

// ComplianceViolation represents compliance violations
type ComplianceViolation struct {
	Standard    string `json:"standard"`
	Rule        string `json:"rule"`
	Severity    string `json:"severity"`
	Description string `json:"description"`
	Remediation string `json:"remediation"`
}
