package middleware

import (
	"net/http"
	"strings"

	"inventory-service/internal/config"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

func AuthMiddleware(cfg *config.Config) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"message": "Authorization header is required",
			})
			c.Abort()
			return
		}

		if !strings.HasPrefix(authHeader, "Bearer ") {
			c.JSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"message": "Invalid authorization format",
			})
			c.Abort()
			return
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")

		// Parse and validate JWT token
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			// Validate signing method
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, jwt.ErrSignatureInvalid
			}
			return []byte(cfg.JWT.Secret), nil
		})

		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"message": "Invalid token",
			})
			c.Abort()
			return
		}

		// Extract claims
		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"message": "Invalid token claims",
			})
			c.Abort()
			return
		}

		// Extract user information
		userID, _ := claims["user_id"].(string)
		email, _ := claims["email"].(string)
		tenantIDStr, _ := claims["tenant_id"].(string)
		role, _ := claims["role"].(string)

		// Parse tenant ID
		tenantID, err := uuid.Parse(tenantIDStr)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"message": "Invalid tenant ID in token",
			})
			c.Abort()
			return
		}

		// Set user information in context
		c.Set("user_id", userID)
		c.Set("email", email)
		c.Set("tenant_id", tenantID)
		c.Set("role", role)

		// Extract permissions if available
		if permissions, ok := claims["permissions"].([]interface{}); ok {
			var permissionStrings []string
			for _, perm := range permissions {
				if permStr, ok := perm.(string); ok {
					permissionStrings = append(permissionStrings, permStr)
				}
			}
			c.Set("permissions", permissionStrings)
		}

		c.Next()
	}
}

func TenantMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		tenantHeader := c.GetHeader("X-Tenant-ID")
		if tenantHeader == "" {
			c.JSON(http.StatusBadRequest, gin.H{
				"success": false,
				"message": "X-Tenant-ID header is required",
			})
			c.Abort()
			return
		}

		// Parse tenant ID from header
		headerTenantID, err := uuid.Parse(tenantHeader)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"success": false,
				"message": "Invalid X-Tenant-ID format",
			})
			c.Abort()
			return
		}

		// Get tenant ID from token (set by AuthMiddleware)
		tokenTenantID, exists := c.Get("tenant_id")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"message": "Tenant information not found in token",
			})
			c.Abort()
			return
		}

		// Verify tenant IDs match
		if headerTenantID != tokenTenantID.(uuid.UUID) {
			c.JSON(http.StatusForbidden, gin.H{
				"success": false,
				"message": "Tenant ID mismatch",
			})
			c.Abort()
			return
		}

		c.Next()
	}
}

func RequirePermission(requiredPermissions ...string) gin.HandlerFunc {
	return func(c *gin.Context) {
		permissions, exists := c.Get("permissions")
		if !exists {
			c.JSON(http.StatusForbidden, gin.H{
				"success": false,
				"message": "No permissions found",
			})
			c.Abort()
			return
		}

		userPermissions, ok := permissions.([]string)
		if !ok {
			c.JSON(http.StatusForbidden, gin.H{
				"success": false,
				"message": "Invalid permissions format",
			})
			c.Abort()
			return
		}

		// Check if user has any of the required permissions
		hasPermission := false
		for _, required := range requiredPermissions {
			for _, userPerm := range userPermissions {
				if userPerm == required || userPerm == "admin" {
					hasPermission = true
					break
				}
			}
			if hasPermission {
				break
			}
		}

		if !hasPermission {
			c.JSON(http.StatusForbidden, gin.H{
				"success": false,
				"message": "Insufficient permissions",
			})
			c.Abort()
			return
		}

		c.Next()
	}
}
