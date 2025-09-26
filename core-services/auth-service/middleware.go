package main

import (
	"context"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

// Logging middleware
func (as *AuthService) loggingMiddleware() gin.HandlerFunc {
	return gin.LoggerWithFormatter(func(param gin.LogFormatterParams) string {
		return fmt.Sprintf("%s - [%s] \"%s %s %s %d %s \"%s\" %s\"\n",
			param.ClientIP,
			param.TimeStamp.Format(time.RFC1123),
			param.Method,
			param.Path,
			param.Request.Proto,
			param.StatusCode,
			param.Latency,
			param.Request.UserAgent(),
			param.ErrorMessage,
		)
	})
}

// Metrics middleware
func (as *AuthService) metricsMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()

		// Process request
		c.Next()

		// Record metrics based on the endpoint
		_ = time.Since(start).Seconds()
		tenantID := c.GetString("tenant_id")
		if tenantID == "" {
			tenantID = "unknown"
		}

		// Record specific auth metrics
		if strings.Contains(c.Request.URL.Path, "/login") {
			// Login attempts are recorded in the login handler
		} else if strings.Contains(c.Request.URL.Path, "/logout") {
			// Logout metrics
			if c.Writer.Status() == http.StatusOK {
				as.metrics.activeTokens.Dec()
			}
		}
	}
}

// Tenant middleware - extract and validate tenant context
func (as *AuthService) tenantMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		var tenantID string

		// Try to get tenant ID from different sources
		// 1. From X-Tenant-ID header (set by API Gateway)
		if headerTenantID := c.GetHeader("X-Tenant-ID"); headerTenantID != "" {
			tenantID = headerTenantID
		} else {
			// 2. From request body (for login/register requests)
			// This is handled in the individual handlers
		}

		// If tenant ID is found, validate it
		if tenantID != "" {
			// Check Redis cache first for performance
			ctx := context.Background()
			cached, err := as.redisClient.Get(ctx, fmt.Sprintf("tenant:%s", tenantID)).Result()
			if err != nil {
				// Not in cache, check database
				tenant, err := as.validateTenant(tenantID)
				if err != nil {
					as.logger.Warnf("Invalid tenant ID: %s, error: %v", tenantID, err)
					c.JSON(http.StatusBadRequest, ErrorResponse{
						Error:   "invalid_tenant",
						Message: "Invalid or inactive tenant",
					})
					c.Abort()
					return
				}

				// Cache the tenant for 1 hour
				tenantData := fmt.Sprintf("%s:%s", tenant.Status, tenant.Plan)
				as.redisClient.Set(ctx, fmt.Sprintf("tenant:%s", tenantID), tenantData, time.Hour)
			} else if !strings.HasPrefix(cached, "active:") {
				c.JSON(http.StatusBadRequest, ErrorResponse{
					Error:   "tenant_inactive",
					Message: "Tenant is not active",
				})
				c.Abort()
				return
			}

			// Set tenant context
			c.Set("tenant_id", tenantID)
		}

		c.Next()
	}
}

// Authentication middleware
func (as *AuthService) authMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Get token from Authorization header
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, ErrorResponse{
				Error:   "unauthorized",
				Message: "Authorization header is required",
			})
			c.Abort()
			return
		}

		// Check Bearer token format
		tokenParts := strings.Split(authHeader, " ")
		if len(tokenParts) != 2 || tokenParts[0] != "Bearer" {
			c.JSON(http.StatusUnauthorized, ErrorResponse{
				Error:   "unauthorized",
				Message: "Invalid authorization header format",
			})
			c.Abort()
			return
		}

		tokenString := tokenParts[1]

		// Parse and validate JWT token
		token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
			// Validate signing method
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}
			return []byte(as.config.JWTSecret), nil
		})

		if err != nil {
			as.logger.Errorf("JWT validation error: %v", err)
			c.JSON(http.StatusUnauthorized, ErrorResponse{
				Error:   "unauthorized",
				Message: "Invalid token",
			})
			c.Abort()
			return
		}

		// Extract claims
		claims, ok := token.Claims.(*Claims)
		if !ok || !token.Valid {
			c.JSON(http.StatusUnauthorized, ErrorResponse{
				Error:   "unauthorized",
				Message: "Invalid token claims",
			})
			c.Abort()
			return
		}

		// Check token expiration
		if time.Now().Unix() > claims.ExpiresAt.Unix() {
			c.JSON(http.StatusUnauthorized, ErrorResponse{
				Error:   "unauthorized",
				Message: "Token has expired",
			})
			c.Abort()
			return
		}

		// Check if token is blacklisted
		ctx := context.Background()
		blacklisted, err := as.redisClient.Get(ctx, fmt.Sprintf("blacklist:%s", tokenString)).Result()
		if err == nil && blacklisted == "true" {
			c.JSON(http.StatusUnauthorized, ErrorResponse{
				Error:   "unauthorized",
				Message: "Token has been revoked",
			})
			c.Abort()
			return
		}

		// Verify session exists in database (optional, for extra security)
		tokenHash := hashTokenForStorage(tokenString)
		sessionQuery := `SELECT COUNT(*) FROM core.user_sessions WHERE user_id = $1 AND token_hash = $2 AND expires_at > CURRENT_TIMESTAMP`
		var sessionCount int
		err = as.db.QueryRow(sessionQuery, claims.UserID, tokenHash).Scan(&sessionCount)
		if err != nil || sessionCount == 0 {
			as.logger.Warnf("Session not found for user %s", claims.UserID)
			c.JSON(http.StatusUnauthorized, ErrorResponse{
				Error:   "unauthorized",
				Message: "Session not found or expired",
			})
			c.Abort()
			return
		}

		// Set context values
		c.Set("user_id", claims.UserID)
		c.Set("tenant_id", claims.TenantID)
		c.Set("role", claims.Role)
		c.Set("token", tokenString)

		c.Next()
	}
}

// Admin middleware - requires admin role
func (as *AuthService) adminMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		role := c.GetString("role")
		if role != "admin" {
			c.JSON(http.StatusForbidden, ErrorResponse{
				Error:   "forbidden",
				Message: "Admin access required",
			})
			c.Abort()
			return
		}

		c.Next()
	}
}

// Rate limiting middleware (simple implementation)
func (as *AuthService) rateLimitMiddleware(requestsPerMinute int) gin.HandlerFunc {
	return func(c *gin.Context) {
		clientIP := c.ClientIP()
		key := fmt.Sprintf("rate_limit:%s", clientIP)

		ctx := context.Background()

		// Get current count
		current, err := as.redisClient.Get(ctx, key).Int()
		if err != nil {
			current = 0
		}

		if current >= requestsPerMinute {
			c.JSON(http.StatusTooManyRequests, ErrorResponse{
				Error:   "rate_limit_exceeded",
				Message: fmt.Sprintf("Rate limit of %d requests per minute exceeded", requestsPerMinute),
			})
			c.Abort()
			return
		}

		// Increment counter
		pipe := as.redisClient.Pipeline()
		pipe.Incr(ctx, key)
		pipe.Expire(ctx, key, time.Minute)
		_, err = pipe.Exec(ctx)
		if err != nil {
			as.logger.Errorf("Failed to update rate limit: %v", err)
		}

		c.Next()
	}
}

// Security headers middleware
func (as *AuthService) securityMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Add security headers
		c.Header("X-Content-Type-Options", "nosniff")
		c.Header("X-Frame-Options", "DENY")
		c.Header("X-XSS-Protection", "1; mode=block")
		c.Header("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
		c.Header("Referrer-Policy", "strict-origin-when-cross-origin")

		// Remove server information
		c.Header("Server", "")

		c.Next()
	}
}

// Request ID middleware for tracing
func (as *AuthService) requestIDMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		requestID := c.GetHeader("X-Request-ID")
		if requestID == "" {
			// Generate a simple request ID
			requestID = fmt.Sprintf("%d", time.Now().UnixNano())
		}

		c.Set("request_id", requestID)
		c.Header("X-Request-ID", requestID)

		c.Next()
	}
}

// CORS middleware (if needed for direct access)
func (as *AuthService) corsMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With, X-Tenant-ID")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}

// Validation middleware for specific endpoints
func (as *AuthService) validateLoginAttempt() gin.HandlerFunc {
	return func(c *gin.Context) {
		clientIP := c.ClientIP()

		// Check for too many failed attempts from this IP
		ctx := context.Background()
		failedAttemptsKey := fmt.Sprintf("failed_login:%s", clientIP)

		failedAttempts, err := as.redisClient.Get(ctx, failedAttemptsKey).Int()
		if err != nil {
			failedAttempts = 0
		}

		// Block if too many failed attempts (simple brute force protection)
		if failedAttempts >= 5 {
			c.JSON(http.StatusTooManyRequests, ErrorResponse{
				Error:   "too_many_attempts",
				Message: "Too many failed login attempts. Please try again later.",
			})
			c.Abort()
			return
		}

		c.Next()

		// If login failed, increment counter
		if c.Writer.Status() == http.StatusUnauthorized {
			pipe := as.redisClient.Pipeline()
			pipe.Incr(ctx, failedAttemptsKey)
			pipe.Expire(ctx, failedAttemptsKey, 15*time.Minute) // Block for 15 minutes
			pipe.Exec(ctx)
		} else if c.Writer.Status() == http.StatusOK {
			// Clear failed attempts on successful login
			as.redisClient.Del(ctx, failedAttemptsKey)
		}
	}
}

// Tenant-specific rate limiting
func (as *AuthService) tenantRateLimitMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		tenantID := c.GetString("tenant_id")
		if tenantID == "" {
			c.Next()
			return
		}

		// Get tenant plan from context or cache
		ctx := context.Background()
		planInfo, err := as.redisClient.Get(ctx, fmt.Sprintf("tenant:%s", tenantID)).Result()
		if err != nil {
			c.Next()
			return
		}

		// Extract plan from cached data (format: "status:plan")
		parts := strings.Split(planInfo, ":")
		if len(parts) != 2 {
			c.Next()
			return
		}

		plan := parts[1]
		var requestLimit int

		// Set different limits based on plan
		switch plan {
		case "basic":
			requestLimit = 100 // 100 requests per minute
		case "pro":
			requestLimit = 500 // 500 requests per minute
		case "enterprise":
			requestLimit = 2000 // 2000 requests per minute
		default:
			requestLimit = 60 // Default limit
		}

		// Check tenant-specific rate limit
		key := fmt.Sprintf("tenant_rate_limit:%s", tenantID)
		current, err := as.redisClient.Get(ctx, key).Int()
		if err != nil {
			current = 0
		}

		if current >= requestLimit {
			c.JSON(http.StatusTooManyRequests, ErrorResponse{
				Error:   "tenant_rate_limit_exceeded",
				Message: fmt.Sprintf("Tenant rate limit of %d requests per minute exceeded", requestLimit),
			})
			c.Abort()
			return
		}

		// Increment tenant counter
		pipe := as.redisClient.Pipeline()
		pipe.Incr(ctx, key)
		pipe.Expire(ctx, key, time.Minute)
		pipe.Exec(ctx)

		c.Next()
	}
}
