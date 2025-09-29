package main

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

// User model
type User struct {
	ID           string     `json:"id" db:"id"`
	TenantID     string     `json:"tenant_id" db:"tenant_id"`
	Email        string     `json:"email" db:"email"`
	PasswordHash string     `json:"-" db:"password_hash"`
	FirstName    *string    `json:"first_name" db:"first_name"`
	LastName     *string    `json:"last_name" db:"last_name"`
	Role         string     `json:"role" db:"role"`
	PrimaryRole  *string    `json:"primary_role" db:"primary_role"` // ← Thêm primary role
	Status       string     `json:"status" db:"status"`
	Preferences  JSONB      `json:"preferences" db:"preferences"`
	LastLoginAt  *time.Time `json:"last_login_at" db:"last_login_at"`
	CreatedAt    time.Time  `json:"created_at" db:"created_at"`
	UpdatedAt    time.Time  `json:"updated_at" db:"updated_at"`
}

// UserSession model
type UserSession struct {
	ID        string    `json:"id" db:"id"`
	UserID    string    `json:"user_id" db:"user_id"`
	TenantID  string    `json:"tenant_id" db:"tenant_id"`
	TokenHash string    `json:"-" db:"token_hash"`
	ExpiresAt time.Time `json:"expires_at" db:"expires_at"`
	IPAddress *string   `json:"ip_address" db:"ip_address"`
	UserAgent *string   `json:"user_agent" db:"user_agent"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
}

// Tenant model
type Tenant struct {
	ID        string    `json:"id" db:"id"`
	Name      string    `json:"name" db:"name"`
	Subdomain string    `json:"subdomain" db:"subdomain"`
	Status    string    `json:"status" db:"status"`
	Plan      string    `json:"plan" db:"plan"`
	Settings  JSONB     `json:"settings" db:"settings"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
	UpdatedAt time.Time `json:"updated_at" db:"updated_at"`
}

// JWT Claims
type Claims struct {
	UserID   string `json:"user_id"`
	TenantID string `json:"tenant_id"`
	Role     string `json:"role"`
	jwt.RegisteredClaims
}

// Request/Response models
type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
	TenantID string `json:"tenant_id"`
}

type LoginResponse struct {
	AccessToken  string     `json:"access_token"`
	RefreshToken string     `json:"refresh_token"`
	TokenType    string     `json:"token_type"`
	ExpiresIn    int64      `json:"expires_in"`
	User         User       `json:"user"`
	TenantToken  *string    `json:"tenant_token,omitempty"`
	PrimaryGroup *UserGroup `json:"primary_group,omitempty"`
}

type RegisterRequest struct {
	Email     string  `json:"email" binding:"required,email"`
	Password  string  `json:"password" binding:"required,min=6"`
	FirstName *string `json:"first_name"`
	LastName  *string `json:"last_name"`
	TenantID  string  `json:"tenant_id"`
}

type RegisterResponse struct {
	Message string `json:"message"`
	User    User   `json:"user"`
}

type RefreshTokenRequest struct {
	RefreshToken string `json:"refresh_token" binding:"required"`
}

type RefreshTokenResponse struct {
	AccessToken string `json:"access_token"`
	TokenType   string `json:"token_type"`
	ExpiresIn   int64  `json:"expires_in"`
}

type ForgotPasswordRequest struct {
	Email    string `json:"email" binding:"required,email"`
	TenantID string `json:"tenant_id"`
}

type ResetPasswordRequest struct {
	Token       string `json:"token" binding:"required"`
	NewPassword string `json:"new_password" binding:"required,min=6"`
}

type ChangePasswordRequest struct {
	CurrentPassword string `json:"current_password" binding:"required"`
	NewPassword     string `json:"new_password" binding:"required,min=6"`
}

type UpdateProfileRequest struct {
	FirstName   *string `json:"first_name"`
	LastName    *string `json:"last_name"`
	Preferences JSONB   `json:"preferences"`
}

type UpdateUserStatusRequest struct {
	Status string `json:"status" binding:"required,oneof=active inactive suspended"`
}

// JSONB type for PostgreSQL JSONB columns
type JSONB map[string]interface{}

// Value implements the driver.Valuer interface
func (j JSONB) Value() (driver.Value, error) {
	if j == nil {
		return nil, nil
	}
	return json.Marshal(j)
}

// Scan implements the sql.Scanner interface
func (j *JSONB) Scan(value interface{}) error {
	if value == nil {
		*j = nil
		return nil
	}

	bytes, ok := value.([]byte)
	if !ok {
		return errors.New("type assertion to []byte failed")
	}

	return json.Unmarshal(bytes, j)
}

// Session info for response
type SessionInfo struct {
	ID        string    `json:"id"`
	IPAddress *string   `json:"ip_address"`
	UserAgent *string   `json:"user_agent"`
	ExpiresAt time.Time `json:"expires_at"`
	CreatedAt time.Time `json:"created_at"`
	IsCurrent bool      `json:"is_current"`
}

// User list response for admin
type UserListResponse struct {
	Users      []User `json:"users"`
	TotalCount int    `json:"total_count"`
	Page       int    `json:"page"`
	PageSize   int    `json:"page_size"`
}

// Session list response for admin
type SessionListResponse struct {
	Sessions   []UserSessionWithUser `json:"sessions"`
	TotalCount int                   `json:"total_count"`
	Page       int                   `json:"page"`
	PageSize   int                   `json:"page_size"`
}

// User session with user info for admin
type UserSessionWithUser struct {
	UserSession
	UserEmail string `json:"user_email" db:"user_email"`
	UserName  string `json:"user_name" db:"user_name"`
}

// Error response
type ErrorResponse struct {
	Error   string `json:"error"`
	Message string `json:"message"`
	Code    string `json:"code,omitempty"`
}

// Success response
type SuccessResponse struct {
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
}

// Validation error
type ValidationError struct {
	Field   string `json:"field"`
	Message string `json:"message"`
	Value   string `json:"value,omitempty"`
}

type ValidationErrorResponse struct {
	Error  string            `json:"error"`
	Errors []ValidationError `json:"errors"`
}

// Multi-group membership models

// UserGroup model
type UserGroup struct {
	ID          string                 `json:"id" db:"id"`
	Name        string                 `json:"name" db:"name"`
	Description string                 `json:"description" db:"description"`
	Permissions map[string]interface{} `json:"permissions" db:"permissions"`
	Priority    int                    `json:"priority" db:"priority"`
	Role        string                 `json:"role" db:"role"`
	IsPrimary   bool                   `json:"is_primary" db:"is_primary"` // ← Thêm primary flag
	AssignedAt  time.Time              `json:"assigned_at" db:"assigned_at"`
	CreatedAt   time.Time              `json:"created_at" db:"created_at"`
	UpdatedAt   time.Time              `json:"updated_at" db:"updated_at"`
	GroupName   string                 `json:"group_name" db:"group_name"` // Add this field
}

// UserGroupMembership model
type UserGroupMembership struct {
	ID            string     `json:"id" db:"id"`
	UserID        string     `json:"user_id" db:"user_id"`
	GroupID       string     `json:"group_id" db:"group_id"`
	Role          string     `json:"role" db:"role"`
	IsPrimaryRole bool       `json:"is_primary_role" db:"is_primary_role"` // ← Thêm primary role flag
	AssignedBy    string     `json:"assigned_by" db:"assigned_by"`
	AssignedAt    time.Time  `json:"assigned_at" db:"assigned_at"`
	IsActive      bool       `json:"is_active" db:"is_active"`
	ExpiresAt     *time.Time `json:"expires_at" db:"expires_at"`
}

// Group assignment request
type AssignUserToGroupRequest struct {
	UserID  string `json:"user_id" binding:"required"`
	GroupID string `json:"group_id" binding:"required"`
	Role    string `json:"role" binding:"required"`
}

// Group removal request
type RemoveUserFromGroupRequest struct {
	UserID  string `json:"user_id" binding:"required"`
	GroupID string `json:"group_id" binding:"required"`
	Role    string `json:"role" binding:"required"`
}

// User groups response
type UserGroupsResponse struct {
	Groups []UserGroup `json:"groups"`
	Count  int         `json:"count"`
}

// User permissions response
type UserPermissionsResponse struct {
	Permissions map[string]interface{} `json:"permissions"`
	Groups      []UserGroup            `json:"groups"`
}

// Group CRUD request/response types

// CreateGroupRequest represents the request to create a new group
type CreateGroupRequest struct {
	Name        string                 `json:"name" binding:"required"`
	Description string                 `json:"description"`
	Permissions map[string]interface{} `json:"permissions"`
	Priority    int                    `json:"priority"`
}

// CreateGroupResponse represents the response after creating a group
type CreateGroupResponse struct {
	Message string `json:"message"`
	GroupID string `json:"group_id"`
}

// UpdateGroupRequest represents the request to update a group
type UpdateGroupRequest struct {
	Name        string                 `json:"name"`
	Description string                 `json:"description"`
	Permissions map[string]interface{} `json:"permissions"`
	Priority    int                    `json:"priority"`
}

// GroupListResponse represents the response for listing groups
type GroupListResponse struct {
	Groups     []UserGroup `json:"groups"`
	TotalCount int         `json:"total_count"`
	Page       int         `json:"page"`
	PageSize   int         `json:"page_size"`
}
