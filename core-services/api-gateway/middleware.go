package main

import (
	"context"
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/time/rate"
)

// Tenant context key
type contextKey string

const (
	TenantIDKey contextKey = "tenant_id"
	UserIDKey   contextKey = "user_id"
)

// JWT Claims structure
type Claims struct {
	UserID   string `json:"user_id"`
	TenantID string `json:"tenant_id"`
	Role     string `json:"role"`
	jwt.RegisteredClaims
}

// Logging middleware
func (gw *APIGateway) loggingMiddleware() gin.HandlerFunc {
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
func (gw *APIGateway) metricsMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()

		// Increment active connections
		gw.metrics.activeConnections.Inc()

		// Process request
		c.Next()

		// Decrement active connections
		gw.metrics.activeConnections.Dec()

		// Record metrics
		duration := time.Since(start).Seconds()
		tenantID := c.GetString("tenant_id")
		if tenantID == "" {
			tenantID = "unknown"
		}

		gw.metrics.requestsTotal.WithLabelValues(
			c.Request.Method,
			c.FullPath(),
			strconv.Itoa(c.Writer.Status()),
			tenantID,
		).Inc()

		gw.metrics.requestDuration.WithLabelValues(
			c.Request.Method,
			c.FullPath(),
			tenantID,
		).Observe(duration)
	}
}

// Authentication middleware
func (gw *APIGateway) authMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Get token from Authorization header
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error":   "unauthorized",
				"message": "Authorization header is required",
			})
			c.Abort()
			return
		}

		// Check Bearer token format
		tokenParts := strings.Split(authHeader, " ")
		if len(tokenParts) != 2 || tokenParts[0] != "Bearer" {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error":   "unauthorized",
				"message": "Invalid authorization header format",
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
			return []byte(gw.config.JWTSecret), nil
		})

		if err != nil {
			gw.logger.Errorf("JWT validation error: %v", err)
			c.JSON(http.StatusUnauthorized, gin.H{
				"error":   "unauthorized",
				"message": "Invalid token",
			})
			c.Abort()
			return
		}

		// Extract claims
		claims, ok := token.Claims.(*Claims)
		if !ok || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error":   "unauthorized",
				"message": "Invalid token claims",
			})
			c.Abort()
			return
		}

		// Check token expiration
		if time.Now().Unix() > claims.ExpiresAt.Unix() {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error":   "unauthorized",
				"message": "Token has expired",
			})
			c.Abort()
			return
		}

		// Check if token is blacklisted (using Redis)
		ctx := context.Background()
		blacklisted, err := gw.redisClient.Get(ctx, fmt.Sprintf("blacklist:%s", tokenString)).Result()
		if err == nil && blacklisted == "true" {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error":   "unauthorized",
				"message": "Token has been revoked",
			})
			c.Abort()
			return
		}

		// Set context values
		c.Set("user_id", claims.UserID)
		c.Set("tenant_id", claims.TenantID)
		c.Set("role", claims.Role)
		c.Set("token", tokenString)

		// Add tenant_id to headers for downstream services
		c.Request.Header.Set("X-Tenant-ID", claims.TenantID)
		c.Request.Header.Set("X-User-ID", claims.UserID)
		c.Request.Header.Set("X-User-Role", claims.Role)

		c.Next()
	}
}

// Rate limiting middleware
func (gw *APIGateway) rateLimitMiddleware() gin.HandlerFunc {
	// Create rate limiter map for different clients
	limiters := make(map[string]*rate.Limiter)

	return func(c *gin.Context) {
		// Use IP address as identifier (you could also use user_id for authenticated requests)
		clientIP := c.ClientIP()

		// Get or create rate limiter for this client
		limiter, exists := limiters[clientIP]
		if !exists {
			// Allow 60 requests per minute (1 per second with burst of 60)
			limiter = rate.NewLimiter(rate.Every(time.Minute/time.Duration(gw.config.RateLimit)), gw.config.RateLimit)
			limiters[clientIP] = limiter
		}

		// Check if request is allowed
		if !limiter.Allow() {
			c.JSON(http.StatusTooManyRequests, gin.H{
				"error":   "rate_limit_exceeded",
				"message": fmt.Sprintf("Rate limit of %d requests per minute exceeded", gw.config.RateLimit),
			})
			c.Abort()
			return
		}

		c.Next()
	}
}

// Multi-tenant middleware
func (gw *APIGateway) multiTenantMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		var tenantID string

		// Try to get tenant ID from different sources
		// 1. From JWT token (if authenticated)
		if tokenTenantID := c.GetString("tenant_id"); tokenTenantID != "" {
			tenantID = tokenTenantID
		} else {
			// 2. From X-Tenant-ID header
			if headerTenantID := c.GetHeader("X-Tenant-ID"); headerTenantID != "" {
				tenantID = headerTenantID
			} else {
				// 3. From subdomain (if using subdomain-based tenancy)
				host := c.GetHeader("Host")
				if host != "" {
					parts := strings.Split(host, ".")
					if len(parts) > 2 && parts[0] != "www" && parts[0] != "api" {
						tenantID = parts[0]
					}
				}
			}
		}

		// Validate tenant ID exists and is active
		if tenantID != "" {
			ctx := context.Background()
			exists, err := gw.redisClient.Exists(ctx, fmt.Sprintf("tenant:%s", tenantID)).Result()
			if err != nil {
				gw.logger.Errorf("Error checking tenant existence: %v", err)
			} else if exists == 0 {
				// Tenant not found in cache, this could be handled by checking database
				gw.logger.Warnf("Tenant not found in cache: %s", tenantID)
			}
		}

		// Set tenant ID in context for downstream services
		if tenantID != "" {
			c.Set("tenant_id", tenantID)
			c.Request.Header.Set("X-Tenant-ID", tenantID)
		}

		c.Next()
	}
}

// CORS middleware (if not using gin-contrib/cors)
func (gw *APIGateway) corsMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With, X-Tenant-ID")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE, PATCH")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}

// Circuit breaker middleware (basic implementation)
func (gw *APIGateway) circuitBreakerMiddleware(serviceName string) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Simple circuit breaker logic
		ctx := context.Background()
		failureKey := fmt.Sprintf("circuit_breaker:%s:failures", serviceName)

		// Get current failure count
		failureCount, err := gw.redisClient.Get(ctx, failureKey).Int()
		if err != nil {
			failureCount = 0
		}

		// If failure count exceeds threshold, return error
		if failureCount > 5 {
			// Check if circuit should be reset (after cooldown period)
			lastFailureTime, err := gw.redisClient.Get(ctx, fmt.Sprintf("circuit_breaker:%s:last_failure", serviceName)).Int64()
			if err == nil {
				if time.Now().Unix()-lastFailureTime < 60 { // 1 minute cooldown
					c.JSON(http.StatusServiceUnavailable, gin.H{
						"error":   "service_unavailable",
						"message": fmt.Sprintf("Service %s is temporarily unavailable", serviceName),
					})
					c.Abort()
					return
				} else {
					// Reset circuit breaker
					gw.redisClient.Del(ctx, failureKey)
					gw.redisClient.Del(ctx, fmt.Sprintf("circuit_breaker:%s:last_failure", serviceName))
				}
			}
		}

		c.Next()

		// Check if request failed and update circuit breaker state
		if c.Writer.Status() >= 500 {
			// Increment failure count
			gw.redisClient.Incr(ctx, failureKey)
			gw.redisClient.Expire(ctx, failureKey, 5*time.Minute)

			// Set last failure time
			gw.redisClient.Set(ctx, fmt.Sprintf("circuit_breaker:%s:last_failure", serviceName), time.Now().Unix(), 5*time.Minute)
		} else if c.Writer.Status() < 400 {
			// Reset failure count on successful request
			gw.redisClient.Del(ctx, failureKey)
		}
	}
}
