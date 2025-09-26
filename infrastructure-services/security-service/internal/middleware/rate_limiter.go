package middleware

import (
	"net/http"
	"sync"

	"github.com/gin-gonic/gin"
	"golang.org/x/time/rate"
)

// ClientRateLimiter holds rate limiters for each client
type ClientRateLimiter struct {
	limiters map[string]*rate.Limiter
	mu       sync.RWMutex
	r        rate.Limit
	b        int
}

// NewClientRateLimiter creates a new client rate limiter
func NewClientRateLimiter(r rate.Limit, b int) *ClientRateLimiter {
	return &ClientRateLimiter{
		limiters: make(map[string]*rate.Limiter),
		r:        r,
		b:        b,
	}
}

// GetLimiter returns the rate limiter for a specific client
func (c *ClientRateLimiter) GetLimiter(key string) *rate.Limiter {
	c.mu.Lock()
	defer c.mu.Unlock()

	limiter, exists := c.limiters[key]
	if !exists {
		limiter = rate.NewLimiter(c.r, c.b)
		c.limiters[key] = limiter
	}

	return limiter
}

// RateLimiter creates a rate limiting middleware
func RateLimiter(r rate.Limit, b int) gin.HandlerFunc {
	clientLimiter := NewClientRateLimiter(r, b)

	return func(c *gin.Context) {
		// Use client IP as key, but prefer tenant ID if available
		key := c.ClientIP()
		if tenantID := c.GetHeader("X-Tenant-ID"); tenantID != "" {
			key = tenantID
		}

		limiter := clientLimiter.GetLimiter(key)

		if !limiter.Allow() {
			c.JSON(http.StatusTooManyRequests, gin.H{
				"error":   "rate limit exceeded",
				"message": "Too many requests, please try again later",
			})
			c.Abort()
			return
		}

		c.Next()
	}
}
