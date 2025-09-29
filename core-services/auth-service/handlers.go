package main

import (
	"context"
	"crypto/rand"
	"database/sql"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/sirupsen/logrus"
	"golang.org/x/crypto/bcrypt"
)

// Login handler
func (as *AuthService) login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, ErrorResponse{
			Error:   "invalid_request",
			Message: "Invalid request format",
		})
		return
	}

	tenantID := req.TenantID
	if tenantID == "" {
		tenantID = c.GetString("tenant_id")
	}
	if tenantID == "" {
		tenantID = "00000000-0000-0000-0000-000000000000" // Default tenant
	}

	// Record auth attempt
	as.metrics.authAttempts.WithLabelValues(tenantID, "attempt", "password").Inc()

	// Get user by email and tenant
	user, err := as.getUserByEmailAndTenant(req.Email, tenantID)
	if err != nil {
		as.logger.Errorf("Failed to get user: %v", err)
		as.metrics.authAttempts.WithLabelValues(tenantID, "failed", "password").Inc()
		c.JSON(http.StatusUnauthorized, ErrorResponse{
			Error:   "invalid_credentials",
			Message: "Invalid email or password",
		})
		return
	}

	// Check if user is active
	if user.Status != "active" {
		as.metrics.authAttempts.WithLabelValues(tenantID, "failed", "password").Inc()
		c.JSON(http.StatusUnauthorized, ErrorResponse{
			Error:   "account_inactive",
			Message: "Account is not active",
		})
		return
	}

	// Verify password
	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password)); err != nil {
		as.logger.Debugf("Password verification failed for user %s", user.Email)
		as.metrics.authAttempts.WithLabelValues(tenantID, "failed", "password").Inc()
		c.JSON(http.StatusUnauthorized, ErrorResponse{
			Error:   "invalid_credentials",
			Message: "Invalid email or password",
		})
		return
	}

	// Get user's primary group and role
	primaryGroup, primaryRole, err := as.getUserPrimaryGroupAndRole(user.ID)
	if err != nil {
		as.logger.Warnf("Failed to get user primary group/role: %v", err)
		// Continue without primary group/role
	}

	// Generate tokens
	accessToken, refreshToken, expiresIn, err := as.generateTokenPair(user)
	if err != nil {
		as.logger.Errorf("Failed to generate tokens: %v", err)
		c.JSON(http.StatusInternalServerError, ErrorResponse{
			Error:   "internal_error",
			Message: "Failed to generate authentication tokens",
		})
		return
	}

	// Generate tenant-specific token if user belongs to a tenant
	var tenantToken string
	if user.TenantID != "" && user.TenantID != "00000000-0000-0000-0000-000000000000" {
		tenantToken, err = as.generateTenantToken(user)
		if err != nil {
			as.logger.Warnf("Failed to generate tenant token: %v", err)
		}
	}

	// Create session
	if err := as.createUserSession(user.ID, user.TenantID, accessToken, c.ClientIP(), c.GetHeader("User-Agent")); err != nil {
		as.logger.Errorf("Failed to create session: %v", err)
	}

	// Update last login
	if err := as.updateLastLogin(user.ID); err != nil {
		as.logger.Errorf("Failed to update last login: %v", err)
	}

	// Record successful login
	as.metrics.authAttempts.WithLabelValues(tenantID, "success", "password").Inc()
	as.metrics.activeTokens.Inc()

	// Remove sensitive data from user response
	user.PasswordHash = ""

	// Prepare enhanced user data with primary group/role
	enhancedUser := *user
	enhancedUser.PrimaryRole = primaryRole

	// Create response with enhanced data
	response := LoginResponse{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		TokenType:    "Bearer",
		ExpiresIn:    expiresIn,
		User:         enhancedUser,
	}

	// Add tenant token if available
	if tenantToken != "" {
		response.TenantToken = &tenantToken
	}

	// Add primary group information if available
	if primaryGroup != nil {
		response.PrimaryGroup = primaryGroup
	}

	c.JSON(http.StatusOK, response)
}

// Register handler
func (as *AuthService) register(c *gin.Context) {
	var req RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, ErrorResponse{
			Error:   "invalid_request",
			Message: "Invalid request format",
		})
		return
	}

	tenantID := req.TenantID
	if tenantID == "" {
		tenantID = c.GetString("tenant_id")
	}
	if tenantID == "" {
		tenantID = "00000000-0000-0000-0000-000000000000" // Default tenant
	}

	// Check if user already exists
	existingUser, err := as.getUserByEmailAndTenant(req.Email, tenantID)
	if err != nil && err != sql.ErrNoRows {
		as.logger.Errorf("Failed to check existing user: %v", err)
		c.JSON(http.StatusInternalServerError, ErrorResponse{
			Error:   "internal_error",
			Message: "Failed to process registration",
		})
		return
	}

	if existingUser != nil {
		c.JSON(http.StatusConflict, ErrorResponse{
			Error:   "user_exists",
			Message: "User with this email already exists",
		})
		return
	}

	// Hash password
	passwordHash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		as.logger.Errorf("Failed to hash password: %v", err)
		c.JSON(http.StatusInternalServerError, ErrorResponse{
			Error:   "internal_error",
			Message: "Failed to process registration",
		})
		return
	}

	// Create user
	user := &User{
		TenantID:     tenantID,
		Email:        req.Email,
		PasswordHash: string(passwordHash),
		FirstName:    req.FirstName,
		LastName:     req.LastName,
		Role:         "user",
		Status:       "active",
		Preferences:  make(JSONB),
	}

	if err := as.createUser(user); err != nil {
		as.logger.Errorf("Failed to create user: %v", err)
		c.JSON(http.StatusInternalServerError, ErrorResponse{
			Error:   "internal_error",
			Message: "Failed to create user",
		})
		return
	}

	// Remove sensitive data
	user.PasswordHash = ""

	c.JSON(http.StatusCreated, RegisterResponse{
		Message: "User created successfully",
		User:    *user,
	})
}

// Refresh token handler
func (as *AuthService) refreshToken(c *gin.Context) {
	var req RefreshTokenRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, ErrorResponse{
			Error:   "invalid_request",
			Message: "Invalid request format",
		})
		return
	}

	// Parse refresh token
	token, err := jwt.ParseWithClaims(req.RefreshToken, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(as.config.JWTSecret), nil
	})

	if err != nil {
		c.JSON(http.StatusUnauthorized, ErrorResponse{
			Error:   "invalid_token",
			Message: "Invalid refresh token",
		})
		return
	}

	claims, ok := token.Claims.(*Claims)
	if !ok || !token.Valid {
		c.JSON(http.StatusUnauthorized, ErrorResponse{
			Error:   "invalid_token",
			Message: "Invalid token claims",
		})
		return
	}

	// Get user
	user, err := as.getUserByID(claims.UserID)
	if err != nil {
		c.JSON(http.StatusUnauthorized, ErrorResponse{
			Error:   "user_not_found",
			Message: "User not found",
		})
		return
	}

	// Generate new access token
	accessToken, _, expiresIn, err := as.generateTokenPair(user)
	if err != nil {
		as.logger.Errorf("Failed to generate access token: %v", err)
		c.JSON(http.StatusInternalServerError, ErrorResponse{
			Error:   "internal_error",
			Message: "Failed to generate access token",
		})
		return
	}

	c.JSON(http.StatusOK, RefreshTokenResponse{
		AccessToken: accessToken,
		TokenType:   "Bearer",
		ExpiresIn:   expiresIn,
	})
}

// Logout handler
func (as *AuthService) logout(c *gin.Context) {
	tokenString := c.GetString("token")
	userID := c.GetString("user_id")

	// Add token to blacklist
	ctx := context.Background()
	if err := as.redisClient.Set(ctx, fmt.Sprintf("blacklist:%s", tokenString), "true", 24*time.Hour).Err(); err != nil {
		as.logger.Errorf("Failed to blacklist token: %v", err)
	}

	// Remove session from database
	if err := as.removeUserSession(userID, tokenString); err != nil {
		as.logger.Errorf("Failed to remove session: %v", err)
	}

	as.metrics.activeTokens.Dec()

	c.JSON(http.StatusOK, SuccessResponse{
		Message: "Logged out successfully",
	})
}

// Get profile handler
func (as *AuthService) getProfile(c *gin.Context) {
	userID := c.GetString("user_id")

	user, err := as.getUserByID(userID)
	if err != nil {
		c.JSON(http.StatusNotFound, ErrorResponse{
			Error:   "user_not_found",
			Message: "User not found",
		})
		return
	}

	user.PasswordHash = ""
	c.JSON(http.StatusOK, user)
}

// Set primary group handler
func (as *AuthService) setPrimaryGroupHandler(c *gin.Context) {
	var req struct {
		UserID  string `json:"user_id" binding:"required"`
		GroupID string `json:"group_id" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		as.logger.WithError(err).Error("Invalid request")
		c.JSON(400, ErrorResponse{
			Error:   "Invalid request",
			Message: err.Error(),
		})
		return
	}

	// Start transaction
	tx, err := as.db.Begin()
	if err != nil {
		as.logger.WithError(err).Error("Failed to begin transaction")
		c.JSON(500, ErrorResponse{
			Error:   "Database error",
			Message: "Failed to begin transaction",
		})
		return
	}
	defer tx.Rollback()

	// First, set all groups to non-primary for this user
	query1 := `
		UPDATE core.user_group_assignments 
		SET is_primary = FALSE 
		WHERE user_id = $1
	`

	_, err = tx.Exec(query1, req.UserID)
	if err != nil {
		as.logger.WithError(err).Error("Failed to clear primary groups")
		c.JSON(500, ErrorResponse{
			Error:   "Database error",
			Message: "Failed to clear primary groups",
		})
		return
	}

	// Then, set the specified group as primary
	query2 := `
		UPDATE core.user_group_assignments 
		SET is_primary = TRUE 
		WHERE user_id = $1 AND group_id = $2
	`

	result, err := tx.Exec(query2, req.UserID, req.GroupID)
	if err != nil {
		as.logger.WithError(err).Error("Failed to set primary group")
		c.JSON(500, ErrorResponse{
			Error:   "Database error",
			Message: "Failed to set primary group",
		})
		return
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		as.logger.WithError(err).Error("Failed to get rows affected")
		c.JSON(500, ErrorResponse{
			Error:   "Database error",
			Message: "Failed to set primary group",
		})
		return
	}

	if rowsAffected == 0 {
		c.JSON(404, ErrorResponse{
			Error:   "Group not found",
			Message: "User is not assigned to this group",
		})
		return
	}

	// Commit transaction
	if err := tx.Commit(); err != nil {
		as.logger.WithError(err).Error("Failed to commit transaction")
		c.JSON(500, ErrorResponse{
			Error:   "Database error",
			Message: "Failed to commit transaction",
		})
		return
	}

	as.logger.WithFields(logrus.Fields{
		"user_id":  req.UserID,
		"group_id": req.GroupID,
	}).Info("Primary group updated successfully")

	c.JSON(200, SuccessResponse{
		Message: "Primary group updated successfully",
		Data: map[string]interface{}{
			"user_id":  req.UserID,
			"group_id": req.GroupID,
		},
	})
}

// Get primary group handler
func (as *AuthService) getPrimaryGroupHandler(c *gin.Context) {
	userID := c.Param("user_id")
	if userID == "" {
		c.JSON(400, ErrorResponse{
			Error:   "Invalid request",
			Message: "User ID is required",
		})
		return
	}

	// Get user's primary group
	query := `
		SELECT uga.group_id, g.name, g.description, uga.role, uga.is_primary, uga.assigned_at
		FROM core.user_group_assignments uga
		JOIN core.user_groups g ON uga.group_id = g.id
		WHERE uga.user_id = $1 AND uga.is_primary = TRUE
	`

	var group struct {
		GroupID     string    `json:"group_id" db:"group_id"`
		Name        string    `json:"name" db:"name"`
		Description string    `json:"description" db:"description"`
		Role        string    `json:"role" db:"role"`
		IsPrimary   bool      `json:"is_primary" db:"is_primary"`
		AssignedAt  time.Time `json:"assigned_at" db:"assigned_at"`
	}

	err := as.db.QueryRow(query, userID).Scan(
		&group.GroupID, &group.Name, &group.Description, &group.Role,
		&group.IsPrimary, &group.AssignedAt,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(404, ErrorResponse{
				Error:   "Primary group not found",
				Message: "User has no primary group assigned",
			})
			return
		}
		as.logger.WithError(err).Error("Failed to get primary group")
		c.JSON(500, ErrorResponse{
			Error:   "Database error",
			Message: "Failed to get primary group",
		})
		return
	}

	as.logger.WithField("user_id", userID).Info("Primary group retrieved successfully")

	c.JSON(200, SuccessResponse{
		Message: "Primary group retrieved successfully",
		Data: map[string]interface{}{
			"user_id": userID,
			"group":   group,
		},
	})
}

// Set primary role handler
func (as *AuthService) setPrimaryRoleHandler(c *gin.Context) {
	var req struct {
		UserID  string `json:"user_id" binding:"required"`
		GroupID string `json:"group_id" binding:"required"`
		Role    string `json:"role" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		as.logger.WithError(err).Error("Invalid request")
		c.JSON(400, ErrorResponse{
			Error:   "Invalid request",
			Message: err.Error(),
		})
		return
	}

	// Start transaction
	tx, err := as.db.Begin()
	if err != nil {
		as.logger.WithError(err).Error("Failed to begin transaction")
		c.JSON(500, ErrorResponse{
			Error:   "Database error",
			Message: "Failed to begin transaction",
		})
		return
	}
	defer tx.Rollback()

	// First, set all roles to non-primary for this user
	query1 := `
		UPDATE core.user_group_assignments 
		SET is_primary_role = FALSE 
		WHERE user_id = $1
	`

	_, err = tx.Exec(query1, req.UserID)
	if err != nil {
		as.logger.WithError(err).Error("Failed to clear primary roles")
		c.JSON(500, ErrorResponse{
			Error:   "Database error",
			Message: "Failed to clear primary roles",
		})
		return
	}

	// Then, set the specified role as primary
	query2 := `
		UPDATE core.user_group_assignments 
		SET is_primary_role = TRUE 
		WHERE user_id = $1 AND group_id = $2 AND role = $3
	`

	result, err := tx.Exec(query2, req.UserID, req.GroupID, req.Role)
	if err != nil {
		as.logger.WithError(err).Error("Failed to set primary role")
		c.JSON(500, ErrorResponse{
			Error:   "Database error",
			Message: "Failed to set primary role",
		})
		return
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		as.logger.WithError(err).Error("Failed to get rows affected")
		c.JSON(500, ErrorResponse{
			Error:   "Database error",
			Message: "Failed to set primary role",
		})
		return
	}

	if rowsAffected == 0 {
		c.JSON(404, ErrorResponse{
			Error:   "Role not found",
			Message: "User does not have this role in this group",
		})
		return
	}

	// Commit transaction
	if err := tx.Commit(); err != nil {
		as.logger.WithError(err).Error("Failed to commit transaction")
		c.JSON(500, ErrorResponse{
			Error:   "Database error",
			Message: "Failed to commit transaction",
		})
		return
	}

	as.logger.WithFields(logrus.Fields{
		"user_id":  req.UserID,
		"group_id": req.GroupID,
		"role":     req.Role,
	}).Info("Primary role updated successfully")

	c.JSON(200, SuccessResponse{
		Message: "Primary role updated successfully",
		Data: map[string]interface{}{
			"user_id":  req.UserID,
			"group_id": req.GroupID,
			"role":     req.Role,
		},
	})
}

// Get primary role handler
func (as *AuthService) getPrimaryRoleHandler(c *gin.Context) {
	userID := c.Param("user_id")
	if userID == "" {
		c.JSON(400, ErrorResponse{
			Error:   "Invalid request",
			Message: "User ID is required",
		})
		return
	}

	// Get user's primary role
	query := `
		SELECT uga.group_id, g.name, g.description, uga.role, uga.is_primary_role, uga.assigned_at
		FROM core.user_group_assignments uga
		JOIN core.user_groups g ON uga.group_id = g.id
		WHERE uga.user_id = $1 AND uga.is_primary_role = TRUE
	`

	var role struct {
		GroupID       string    `json:"group_id" db:"group_id"`
		Name          string    `json:"name" db:"name"`
		Description   string    `json:"description" db:"description"`
		Role          string    `json:"role" db:"role"`
		IsPrimaryRole bool      `json:"is_primary_role" db:"is_primary_role"`
		AssignedAt    time.Time `json:"assigned_at" db:"assigned_at"`
	}

	err := as.db.QueryRow(query, userID).Scan(
		&role.GroupID, &role.Name, &role.Description, &role.Role,
		&role.IsPrimaryRole, &role.AssignedAt,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(404, ErrorResponse{
				Error:   "Primary role not found",
				Message: "User has no primary role assigned",
			})
			return
		}
		as.logger.WithError(err).Error("Failed to get primary role")
		c.JSON(500, ErrorResponse{
			Error:   "Database error",
			Message: "Failed to get primary role",
		})
		return
	}

	as.logger.WithField("user_id", userID).Info("Primary role retrieved successfully")

	c.JSON(200, SuccessResponse{
		Message: "Primary role retrieved successfully",
		Data: map[string]interface{}{
			"user_id": userID,
			"role":    role,
		},
	})
}

// Update profile handler
func (as *AuthService) updateProfile(c *gin.Context) {
	var req UpdateProfileRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, ErrorResponse{
			Error:   "invalid_request",
			Message: "Invalid request format",
		})
		return
	}

	userID := c.GetString("user_id")

	if err := as.updateUserProfile(userID, req); err != nil {
		as.logger.Errorf("Failed to update profile: %v", err)
		c.JSON(http.StatusInternalServerError, ErrorResponse{
			Error:   "internal_error",
			Message: "Failed to update profile",
		})
		return
	}

	c.JSON(http.StatusOK, SuccessResponse{
		Message: "Profile updated successfully",
	})
}

// Change password handler
func (as *AuthService) changePassword(c *gin.Context) {
	var req ChangePasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, ErrorResponse{
			Error:   "invalid_request",
			Message: "Invalid request format",
		})
		return
	}

	userID := c.GetString("user_id")

	// Get current user
	user, err := as.getUserByID(userID)
	if err != nil {
		c.JSON(http.StatusNotFound, ErrorResponse{
			Error:   "user_not_found",
			Message: "User not found",
		})
		return
	}

	// Verify current password
	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.CurrentPassword)); err != nil {
		c.JSON(http.StatusBadRequest, ErrorResponse{
			Error:   "invalid_password",
			Message: "Current password is incorrect",
		})
		return
	}

	// Hash new password
	newPasswordHash, err := bcrypt.GenerateFromPassword([]byte(req.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		as.logger.Errorf("Failed to hash new password: %v", err)
		c.JSON(http.StatusInternalServerError, ErrorResponse{
			Error:   "internal_error",
			Message: "Failed to change password",
		})
		return
	}

	// Update password
	if err := as.updateUserPassword(userID, string(newPasswordHash)); err != nil {
		as.logger.Errorf("Failed to update password: %v", err)
		c.JSON(http.StatusInternalServerError, ErrorResponse{
			Error:   "internal_error",
			Message: "Failed to change password",
		})
		return
	}

	c.JSON(http.StatusOK, SuccessResponse{
		Message: "Password changed successfully",
	})
}

// Get user sessions handler
func (as *AuthService) getUserSessions(c *gin.Context) {
	userID := c.GetString("user_id")
	currentToken := c.GetString("token")

	sessions, err := as.getUserSessionsByUserID(userID)
	if err != nil {
		as.logger.Errorf("Failed to get user sessions: %v", err)
		c.JSON(http.StatusInternalServerError, ErrorResponse{
			Error:   "internal_error",
			Message: "Failed to get sessions",
		})
		return
	}

	// Convert to response format and mark current session
	sessionInfos := make([]SessionInfo, len(sessions))
	for i, session := range sessions {
		sessionInfos[i] = SessionInfo{
			ID:        session.ID,
			IPAddress: session.IPAddress,
			UserAgent: session.UserAgent,
			ExpiresAt: session.ExpiresAt,
			CreatedAt: session.CreatedAt,
			IsCurrent: session.TokenHash == hashToken(currentToken),
		}
	}

	c.JSON(http.StatusOK, sessionInfos)
}

// Revoke session handler
func (as *AuthService) revokeSession(c *gin.Context) {
	sessionID := c.Param("session_id")
	userID := c.GetString("user_id")

	if err := as.revokeUserSession(userID, sessionID); err != nil {
		as.logger.Errorf("Failed to revoke session: %v", err)
		c.JSON(http.StatusInternalServerError, ErrorResponse{
			Error:   "internal_error",
			Message: "Failed to revoke session",
		})
		return
	}

	c.JSON(http.StatusOK, SuccessResponse{
		Message: "Session revoked successfully",
	})
}

// Forgot password handler
func (as *AuthService) forgotPassword(c *gin.Context) {
	var req ForgotPasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, ErrorResponse{
			Error:   "invalid_request",
			Message: "Invalid request format",
		})
		return
	}

	// Always return success to prevent email enumeration
	c.JSON(http.StatusOK, SuccessResponse{
		Message: "If the email exists, a password reset link has been sent",
	})

	// TODO: Implement email sending logic
	// This would typically:
	// 1. Generate a secure reset token
	// 2. Store it in Redis with expiration
	// 3. Send email with reset link
}

// Reset password handler
func (as *AuthService) resetPassword(c *gin.Context) {
	var req ResetPasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, ErrorResponse{
			Error:   "invalid_request",
			Message: "Invalid request format",
		})
		return
	}

	// TODO: Implement password reset logic
	// This would typically:
	// 1. Validate reset token from Redis
	// 2. Hash new password
	// 3. Update user password
	// 4. Remove reset token
	// 5. Optionally revoke all existing sessions

	c.JSON(http.StatusOK, SuccessResponse{
		Message: "Password reset successfully",
	})
}

// Admin: Get all users
func (as *AuthService) getUsers(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "20"))

	if page < 1 {
		page = 1
	}
	if pageSize < 1 || pageSize > 100 {
		pageSize = 20
	}

	users, totalCount, err := as.getUsersByTenant(tenantID, page, pageSize)
	if err != nil {
		as.logger.Errorf("Failed to get users: %v", err)
		c.JSON(http.StatusInternalServerError, ErrorResponse{
			Error:   "internal_error",
			Message: "Failed to get users",
		})
		return
	}

	c.JSON(http.StatusOK, UserListResponse{
		Users:      users,
		TotalCount: totalCount,
		Page:       page,
		PageSize:   pageSize,
	})
}

// Admin: Get user by ID
func (as *AuthService) getUserByIDHandler(c *gin.Context) {
	userID := c.Param("id")

	user, err := as.getUserByID(userID)
	if err != nil {
		c.JSON(http.StatusNotFound, ErrorResponse{
			Error:   "user_not_found",
			Message: "User not found",
		})
		return
	}

	user.PasswordHash = ""
	c.JSON(http.StatusOK, user)
}

// Admin: Update user status
func (as *AuthService) updateUserStatus(c *gin.Context) {
	var req UpdateUserStatusRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, ErrorResponse{
			Error:   "invalid_request",
			Message: "Invalid request format",
		})
		return
	}

	userID := c.Param("id")

	if err := as.updateUserStatusByID(userID, req.Status); err != nil {
		as.logger.Errorf("Failed to update user status: %v", err)
		c.JSON(http.StatusInternalServerError, ErrorResponse{
			Error:   "internal_error",
			Message: "Failed to update user status",
		})
		return
	}

	c.JSON(http.StatusOK, SuccessResponse{
		Message: "User status updated successfully",
	})
}

// Admin: Get all sessions
func (as *AuthService) getAllSessions(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "20"))

	if page < 1 {
		page = 1
	}
	if pageSize < 1 || pageSize > 100 {
		pageSize = 20
	}

	sessions, totalCount, err := as.getAllSessionsByTenant(tenantID, page, pageSize)
	if err != nil {
		as.logger.Errorf("Failed to get sessions: %v", err)
		c.JSON(http.StatusInternalServerError, ErrorResponse{
			Error:   "internal_error",
			Message: "Failed to get sessions",
		})
		return
	}

	c.JSON(http.StatusOK, SessionListResponse{
		Sessions:   sessions,
		TotalCount: totalCount,
		Page:       page,
		PageSize:   pageSize,
	})
}

// Admin: Revoke session
func (as *AuthService) revokeSessionAdmin(c *gin.Context) {
	sessionID := c.Param("session_id")

	if err := as.revokeSessionByID(sessionID); err != nil {
		as.logger.Errorf("Failed to revoke session: %v", err)
		c.JSON(http.StatusInternalServerError, ErrorResponse{
			Error:   "internal_error",
			Message: "Failed to revoke session",
		})
		return
	}

	c.JSON(http.StatusOK, SuccessResponse{
		Message: "Session revoked successfully",
	})
}

// Helper function to generate a random token
func generateRandomToken(length int) (string, error) {
	bytes := make([]byte, length)
	if _, err := rand.Read(bytes); err != nil {
		return "", err
	}
	return hex.EncodeToString(bytes), nil
}

// Helper function to hash token for storage
func hashToken(token string) string {
	hash, _ := bcrypt.GenerateFromPassword([]byte(token), bcrypt.DefaultCost)
	return string(hash)
}

// Multi-group membership functions

// GetUserGroups retrieves all groups for a user
func (as *AuthService) getUserGroups(userID string) ([]UserGroup, error) {
	query := `
		SELECT ug.id, ug.name, ug.description, ug.permissions, ug.priority, uga.role, uga.assigned_at
		FROM core.user_groups ug
		JOIN core.user_group_assignments uga ON ug.id = uga.group_id
		WHERE uga.user_id = $1 AND ug.is_active = true
		ORDER BY ug.priority DESC, uga.assigned_at ASC
	`

	rows, err := as.db.Query(query, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to get user groups: %w", err)
	}
	defer rows.Close()

	var groups []UserGroup
	for rows.Next() {
		var group UserGroup
		var permissionsJSON string
		var assignedAt time.Time

		err := rows.Scan(&group.ID, &group.Name, &group.Description, &permissionsJSON, &group.Priority, &group.Role, &assignedAt)
		if err != nil {
			return nil, fmt.Errorf("failed to scan user group: %w", err)
		}

		// Parse permissions JSON
		if err := json.Unmarshal([]byte(permissionsJSON), &group.Permissions); err != nil {
			as.logger.Warnf("Failed to parse permissions for group %s: %v", group.Name, err)
			group.Permissions = make(map[string]interface{})
		}

		group.AssignedAt = assignedAt
		groups = append(groups, group)
	}

	return groups, nil
}

// GetUserPermissions aggregates permissions from all user groups
func (as *AuthService) getUserPermissions(userID string) (map[string]interface{}, error) {
	groups, err := as.getUserGroups(userID)
	if err != nil {
		return nil, err
	}

	// Aggregate permissions from all groups
	permissions := make(map[string]interface{})
	for _, group := range groups {
		for key, value := range group.Permissions {
			// Higher priority groups can override lower priority permissions
			if existing, exists := permissions[key]; !exists || group.Priority > getGroupPriority(existing) {
				permissions[key] = value
			}
		}
	}

	return permissions, nil
}

// AssignUserToGroup assigns a user to a group
func (as *AuthService) assignUserToGroup(userID, groupID, role, assignedBy string) error {
	query := `
		INSERT INTO core.user_group_assignments (user_id, group_id, role)
		VALUES ($1, $2, $3)
		ON CONFLICT (user_id, group_id) DO UPDATE SET
			role = $3,
			assigned_at = CURRENT_TIMESTAMP
	`

	_, err := as.db.Exec(query, userID, groupID, role)
	if err != nil {
		return fmt.Errorf("failed to assign user to group: %w", err)
	}

	// Clear permissions cache
	as.clearUserPermissionsCache(userID)

	return nil
}

// RemoveUserFromGroup removes a user from a group
func (as *AuthService) removeUserFromGroup(userID, groupID, role string) error {
	query := `
		UPDATE core.user_group_assignments 
		SET is_active = false
		WHERE user_id = $1 AND group_id = $2 AND role = $3
	`

	_, err := as.db.Exec(query, userID, groupID, role)
	if err != nil {
		return fmt.Errorf("failed to remove user from group: %w", err)
	}

	// Clear permissions cache
	as.clearUserPermissionsCache(userID)

	return nil
}

// GetUserPermissionsCache retrieves cached permissions for a user
func (as *AuthService) getUserPermissionsCache(userID string) (map[string]interface{}, []UserGroup, error) {
	query := `
		SELECT permissions, groups, expires_at
		FROM core.user_permissions_cache
		WHERE user_id = $1 AND expires_at > CURRENT_TIMESTAMP
	`

	var permissionsJSON, groupsJSON string
	var expiresAt time.Time

	err := as.db.QueryRow(query, userID).Scan(&permissionsJSON, &groupsJSON, &expiresAt)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil, nil // No cache found
		}
		return nil, nil, fmt.Errorf("failed to get permissions cache: %w", err)
	}

	var permissions map[string]interface{}
	var groups []UserGroup

	if err := json.Unmarshal([]byte(permissionsJSON), &permissions); err != nil {
		return nil, nil, fmt.Errorf("failed to parse cached permissions: %w", err)
	}

	if err := json.Unmarshal([]byte(groupsJSON), &groups); err != nil {
		return nil, nil, fmt.Errorf("failed to parse cached groups: %w", err)
	}

	return permissions, groups, nil
}

// SetUserPermissionsCache caches permissions for a user
func (as *AuthService) setUserPermissionsCache(userID string, permissions map[string]interface{}, groups []UserGroup) error {
	permissionsJSON, _ := json.Marshal(permissions)
	groupsJSON, _ := json.Marshal(groups)

	query := `
		INSERT INTO core.user_permissions_cache (user_id, permissions, groups, expires_at)
		VALUES ($1, $2, $3, $4)
		ON CONFLICT (user_id) DO UPDATE SET
			permissions = $2,
			groups = $3,
			last_updated = CURRENT_TIMESTAMP,
			expires_at = $4
	`

	expiresAt := time.Now().Add(time.Hour) // Cache for 1 hour
	_, err := as.db.Exec(query, userID, string(permissionsJSON), string(groupsJSON), expiresAt)
	if err != nil {
		return fmt.Errorf("failed to cache permissions: %w", err)
	}

	return nil
}

// ClearUserPermissionsCache clears cached permissions for a user
func (as *AuthService) clearUserPermissionsCache(userID string) error {
	query := `DELETE FROM core.user_permissions_cache WHERE user_id = $1`
	_, err := as.db.Exec(query, userID)
	if err != nil {
		return fmt.Errorf("failed to clear permissions cache: %w", err)
	}
	return nil
}

// Helper function to get group priority from existing permission
func getGroupPriority(permission interface{}) int {
	// This is a simplified implementation
	// In a real system, you'd want to track group priority more systematically
	return 0
}

// Group CRUD database methods

// CreateGroup creates a new group
func (as *AuthService) createGroup(tenantID, name, description string, permissions map[string]interface{}, priority int) (string, error) {
	permissionsJSON, _ := json.Marshal(permissions)

	query := `
		INSERT INTO core.user_groups (tenant_id, name, description, permissions, priority, is_active)
		VALUES ($1, $2, $3, $4, $5, true)
		RETURNING id
	`

	var groupID string
	err := as.db.QueryRow(query, tenantID, name, description, string(permissionsJSON), priority).Scan(&groupID)
	if err != nil {
		return "", fmt.Errorf("failed to create group: %w", err)
	}

	return groupID, nil
}

// GetGroupByID retrieves a group by ID
func (as *AuthService) getGroupByID(groupID string) (*UserGroup, error) {
	query := `
		SELECT id, name, description, permissions, priority, is_active, created_at, updated_at
		FROM core.user_groups
		WHERE id = $1 AND is_active = true
	`

	var group UserGroup
	var permissionsJSON string
	var isActive bool

	err := as.db.QueryRow(query, groupID).Scan(
		&group.ID, &group.Name, &group.Description, &permissionsJSON,
		&group.Priority, &isActive, &group.CreatedAt, &group.UpdatedAt,
	)
	if err != nil {
		return nil, fmt.Errorf("failed to get group: %w", err)
	}

	// Parse permissions JSON
	if err := json.Unmarshal([]byte(permissionsJSON), &group.Permissions); err != nil {
		as.logger.Warnf("Failed to parse permissions for group %s: %v", group.Name, err)
		group.Permissions = make(map[string]interface{})
	}

	return &group, nil
}

// UpdateGroup updates a group
func (as *AuthService) updateGroup(groupID, name, description string, permissions map[string]interface{}, priority int) error {
	permissionsJSON, _ := json.Marshal(permissions)

	query := `
		UPDATE core.user_groups 
		SET name = $1, description = $2, permissions = $3, priority = $4, updated_at = CURRENT_TIMESTAMP
		WHERE id = $5 AND is_active = true
	`

	result, err := as.db.Exec(query, name, description, string(permissionsJSON), priority, groupID)
	if err != nil {
		return fmt.Errorf("failed to update group: %w", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("failed to get rows affected: %w", err)
	}

	if rowsAffected == 0 {
		return fmt.Errorf("group not found or already inactive")
	}

	return nil
}

// DeleteGroup deletes a group (soft delete)
func (as *AuthService) deleteGroup(groupID string) error {
	query := `
		UPDATE core.user_groups 
		SET is_active = false, updated_at = CURRENT_TIMESTAMP
		WHERE id = $1
	`

	result, err := as.db.Exec(query, groupID)
	if err != nil {
		return fmt.Errorf("failed to delete group: %w", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("failed to get rows affected: %w", err)
	}

	if rowsAffected == 0 {
		return fmt.Errorf("group not found")
	}

	return nil
}

// GetGroupsByTenant retrieves groups for a tenant with pagination
func (as *AuthService) getGroupsByTenant(tenantID string, page, pageSize int) ([]UserGroup, int, error) {
	// Get total count
	countQuery := `
		SELECT COUNT(*) FROM core.user_groups 
		WHERE tenant_id = $1 AND is_active = true
	`
	var totalCount int
	err := as.db.QueryRow(countQuery, tenantID).Scan(&totalCount)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to get groups count: %w", err)
	}

	// Get groups with pagination
	offset := (page - 1) * pageSize
	query := `
		SELECT id, name, description, permissions, priority, created_at, updated_at
		FROM core.user_groups
		WHERE tenant_id = $1 AND is_active = true
		ORDER BY priority DESC, created_at ASC
		LIMIT $2 OFFSET $3
	`

	rows, err := as.db.Query(query, tenantID, pageSize, offset)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to get groups: %w", err)
	}
	defer rows.Close()

	var groups []UserGroup
	for rows.Next() {
		var group UserGroup
		var permissionsJSON string

		err := rows.Scan(
			&group.ID, &group.Name, &group.Description, &permissionsJSON,
			&group.Priority, &group.CreatedAt, &group.UpdatedAt,
		)
		if err != nil {
			return nil, 0, fmt.Errorf("failed to scan group: %w", err)
		}

		// Parse permissions JSON
		if err := json.Unmarshal([]byte(permissionsJSON), &group.Permissions); err != nil {
			as.logger.Warnf("Failed to parse permissions for group %s: %v", group.Name, err)
			group.Permissions = make(map[string]interface{})
		}

		groups = append(groups, group)
	}

	return groups, totalCount, nil
}

// Multi-group management handlers

// GetUserGroupsHandler retrieves all groups for a user
func (as *AuthService) getUserGroupsHandler(c *gin.Context) {
	userID := c.Param("user_id")
	if userID == "" {
		c.JSON(http.StatusBadRequest, ErrorResponse{
			Error:   "invalid_request",
			Message: "User ID is required",
		})
		return
	}

	// Check if requesting user has permission to view this user's groups
	requestingUserID := c.GetString("user_id")
	if requestingUserID != userID {
		// TODO: Add permission check here
		// For now, allow any authenticated user to view groups
	}

	groups, err := as.getUserGroups(userID)
	if err != nil {
		as.logger.Errorf("Failed to get user groups: %v", err)
		c.JSON(http.StatusInternalServerError, ErrorResponse{
			Error:   "internal_error",
			Message: "Failed to retrieve user groups",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"user_groups": groups,
		"count":       len(groups),
	})
}

// AssignUserToGroupHandler assigns a user to a group
func (as *AuthService) assignUserToGroupHandler(c *gin.Context) {
	var req AssignUserToGroupRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, ErrorResponse{
			Error:   "invalid_request",
			Message: "Invalid request format",
		})
		return
	}

	// Get the requesting user ID
	assignedBy := c.GetString("user_id")
	if assignedBy == "" {
		c.JSON(http.StatusUnauthorized, ErrorResponse{
			Error:   "unauthorized",
			Message: "User not authenticated",
		})
		return
	}

	// Assign user to group
	err := as.assignUserToGroup(req.UserID, req.GroupID, req.Role, assignedBy)
	if err != nil {
		as.logger.Errorf("Failed to assign user to group: %v", err)
		c.JSON(http.StatusInternalServerError, ErrorResponse{
			Error:   "internal_error",
			Message: "Failed to assign user to group",
		})
		return
	}

	c.JSON(http.StatusOK, SuccessResponse{
		Message: "User successfully assigned to group",
	})
}

// RemoveUserFromGroupHandler removes a user from a group
func (as *AuthService) removeUserFromGroupHandler(c *gin.Context) {
	var req RemoveUserFromGroupRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, ErrorResponse{
			Error:   "invalid_request",
			Message: "Invalid request format",
		})
		return
	}

	// Remove user from group
	err := as.removeUserFromGroup(req.UserID, req.GroupID, req.Role)
	if err != nil {
		as.logger.Errorf("Failed to remove user from group: %v", err)
		c.JSON(http.StatusInternalServerError, ErrorResponse{
			Error:   "internal_error",
			Message: "Failed to remove user from group",
		})
		return
	}

	c.JSON(http.StatusOK, SuccessResponse{
		Message: "User successfully removed from group",
	})
}

// Group CRUD handlers

// CreateGroupHandler creates a new group
func (as *AuthService) createGroupHandler(c *gin.Context) {
	var req CreateGroupRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, ErrorResponse{
			Error:   "invalid_request",
			Message: "Invalid request format",
		})
		return
	}

	// Get tenant ID from context
	tenantID := c.GetString("tenant_id")
	if tenantID == "" {
		tenantID = "00000000-0000-0000-0000-000000000000" // Default tenant
	}

	// Create group
	groupID, err := as.createGroup(tenantID, req.Name, req.Description, req.Permissions, req.Priority)
	if err != nil {
		as.logger.Errorf("Failed to create group: %v", err)
		c.JSON(http.StatusInternalServerError, ErrorResponse{
			Error:   "internal_error",
			Message: "Failed to create group",
		})
		return
	}

	c.JSON(http.StatusCreated, CreateGroupResponse{
		Message: "Group created successfully",
		GroupID: groupID,
	})
}

// GetGroupHandler retrieves a group by ID
func (as *AuthService) getGroupHandler(c *gin.Context) {
	groupID := c.Param("group_id")
	if groupID == "" {
		c.JSON(http.StatusBadRequest, ErrorResponse{
			Error:   "invalid_request",
			Message: "Group ID is required",
		})
		return
	}

	group, err := as.getGroupByID(groupID)
	if err != nil {
		as.logger.Errorf("Failed to get group: %v", err)
		c.JSON(http.StatusNotFound, ErrorResponse{
			Error:   "group_not_found",
			Message: "Group not found",
		})
		return
	}

	c.JSON(http.StatusOK, group)
}

// UpdateGroupHandler updates a group
func (as *AuthService) updateGroupHandler(c *gin.Context) {
	groupID := c.Param("group_id")
	if groupID == "" {
		c.JSON(http.StatusBadRequest, ErrorResponse{
			Error:   "invalid_request",
			Message: "Group ID is required",
		})
		return
	}

	var req UpdateGroupRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, ErrorResponse{
			Error:   "invalid_request",
			Message: "Invalid request format",
		})
		return
	}

	err := as.updateGroup(groupID, req.Name, req.Description, req.Permissions, req.Priority)
	if err != nil {
		as.logger.Errorf("Failed to update group: %v", err)
		c.JSON(http.StatusInternalServerError, ErrorResponse{
			Error:   "internal_error",
			Message: "Failed to update group",
		})
		return
	}

	c.JSON(http.StatusOK, SuccessResponse{
		Message: "Group updated successfully",
	})
}

// DeleteGroupHandler deletes a group
func (as *AuthService) deleteGroupHandler(c *gin.Context) {
	groupID := c.Param("group_id")
	if groupID == "" {
		c.JSON(http.StatusBadRequest, ErrorResponse{
			Error:   "invalid_request",
			Message: "Group ID is required",
		})
		return
	}

	err := as.deleteGroup(groupID)
	if err != nil {
		as.logger.Errorf("Failed to delete group: %v", err)
		c.JSON(http.StatusInternalServerError, ErrorResponse{
			Error:   "internal_error",
			Message: "Failed to delete group",
		})
		return
	}

	c.JSON(http.StatusOK, SuccessResponse{
		Message: "Group deleted successfully",
	})
}

// ListGroupsHandler lists all groups for a tenant
func (as *AuthService) listGroupsHandler(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	if tenantID == "" {
		tenantID = "00000000-0000-0000-0000-000000000000" // Default tenant
	}

	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "20"))

	if page < 1 {
		page = 1
	}
	if pageSize < 1 || pageSize > 100 {
		pageSize = 20
	}

	groups, totalCount, err := as.getGroupsByTenant(tenantID, page, pageSize)
	if err != nil {
		as.logger.Errorf("Failed to get groups: %v", err)
		c.JSON(http.StatusInternalServerError, ErrorResponse{
			Error:   "internal_error",
			Message: "Failed to get groups",
		})
		return
	}

	c.JSON(http.StatusOK, GroupListResponse{
		Groups:     groups,
		TotalCount: totalCount,
		Page:       page,
		PageSize:   pageSize,
	})
}
