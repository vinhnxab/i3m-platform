package main

import (
	"context"
	"crypto/rand"
	"database/sql"
	"encoding/hex"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
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

	c.JSON(http.StatusOK, LoginResponse{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		TokenType:    "Bearer",
		ExpiresIn:    expiresIn,
		User:         *user,
	})
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
