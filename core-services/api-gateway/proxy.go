package main

import (
	"bytes"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

// Proxy to auth service
func (gw *APIGateway) proxyToAuthService(c *gin.Context) {
	gw.proxyRequest(c, gw.config.AuthService, "")
}

// Proxy to user service
func (gw *APIGateway) proxyToUserService(c *gin.Context) {
	gw.proxyRequest(c, gw.config.UserService, "/api/v1/users")
}

// Generic proxy to any service
func (gw *APIGateway) proxyToService(envVar, defaultURL string) gin.HandlerFunc {
	serviceURL := getEnv(envVar, defaultURL)
	return func(c *gin.Context) {
		gw.proxyRequest(c, serviceURL, "")
	}
}

// Generic proxy request function
func (gw *APIGateway) proxyRequest(c *gin.Context, targetURL, pathPrefix string) {
	// Parse target URL
	target, err := url.Parse(targetURL)
	if err != nil {
		gw.logger.Errorf("Failed to parse target URL %s: %v", targetURL, err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "internal_server_error",
			"message": "Failed to process request",
		})
		return
	}

	// Prepare the target path
	targetPath := c.Request.URL.Path
	if pathPrefix != "" {
		// Remove the path prefix if it exists
		if strings.HasPrefix(targetPath, pathPrefix) {
			targetPath = strings.TrimPrefix(targetPath, pathPrefix)
		}
	}

	// Handle path parameters like /users/:id
	if strings.Contains(c.FullPath(), ":") {
		// Replace path parameters with actual values
		fullPath := c.FullPath()
		for _, param := range c.Params {
			placeholder := ":" + param.Key
			fullPath = strings.Replace(fullPath, placeholder, param.Value, 1)
		}
		targetPath = fullPath
	}

	// Construct the full target URL
	targetURL = fmt.Sprintf("%s://%s%s", target.Scheme, target.Host, targetPath)
	if c.Request.URL.RawQuery != "" {
		targetURL += "?" + c.Request.URL.RawQuery
	}

	gw.logger.Debugf("Proxying %s %s to %s", c.Request.Method, c.Request.URL.Path, targetURL)

	// Read request body
	var requestBody []byte
	if c.Request.Body != nil {
		requestBody, err = io.ReadAll(c.Request.Body)
		if err != nil {
			gw.logger.Errorf("Failed to read request body: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{
				"error":   "internal_server_error",
				"message": "Failed to read request body",
			})
			return
		}
		c.Request.Body.Close()
	}

	// Create new request
	req, err := http.NewRequest(c.Request.Method, targetURL, bytes.NewReader(requestBody))
	if err != nil {
		gw.logger.Errorf("Failed to create request: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "internal_server_error",
			"message": "Failed to create request",
		})
		return
	}

	// Copy headers from original request
	for header, values := range c.Request.Header {
		// Skip hop-by-hop headers
		if isHopByHopHeader(header) {
			continue
		}
		for _, value := range values {
			req.Header.Add(header, value)
		}
	}

	// Add/override specific headers for downstream services
	req.Header.Set("X-Forwarded-For", c.ClientIP())
	req.Header.Set("X-Forwarded-Proto", "http") // or https based on original request
	req.Header.Set("X-Gateway-Version", "1.0.0")

	// Ensure tenant context is passed
	if tenantID := c.GetString("tenant_id"); tenantID != "" {
		req.Header.Set("X-Tenant-ID", tenantID)
	}
	if userID := c.GetString("user_id"); userID != "" {
		req.Header.Set("X-User-ID", userID)
	}
	if role := c.GetString("role"); role != "" {
		req.Header.Set("X-User-Role", role)
	}

	// Create HTTP client with timeout
	client := &http.Client{
		Timeout: 30 * time.Second,
		Transport: &http.Transport{
			MaxIdleConns:        100,
			MaxIdleConnsPerHost: 10,
			IdleConnTimeout:     90 * time.Second,
		},
	}

	// Execute request
	resp, err := client.Do(req)
	if err != nil {
		gw.logger.Errorf("Failed to proxy request to %s: %v", targetURL, err)

		// Check if it's a timeout or connection error
		if strings.Contains(err.Error(), "timeout") {
			c.JSON(http.StatusGatewayTimeout, gin.H{
				"error":   "gateway_timeout",
				"message": "Service request timed out",
			})
		} else {
			c.JSON(http.StatusBadGateway, gin.H{
				"error":   "bad_gateway",
				"message": "Failed to connect to service",
			})
		}
		return
	}
	defer resp.Body.Close()

	// Read response body
	responseBody, err := io.ReadAll(resp.Body)
	if err != nil {
		gw.logger.Errorf("Failed to read response body: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "internal_server_error",
			"message": "Failed to read service response",
		})
		return
	}

	// Copy response headers
	for header, values := range resp.Header {
		// Skip hop-by-hop headers
		if isHopByHopHeader(header) {
			continue
		}
		for _, value := range values {
			c.Header(header, value)
		}
	}

	// Add custom headers
	c.Header("X-Gateway-Service", extractServiceName(targetURL))
	c.Header("X-Gateway-Response-Time", time.Now().Format(time.RFC3339))

	// Set status code and write response
	c.Status(resp.StatusCode)
	c.Writer.Write(responseBody)
}

// Check if header is hop-by-hop (should not be forwarded)
func isHopByHopHeader(header string) bool {
	hopByHopHeaders := []string{
		"Connection",
		"Keep-Alive",
		"Proxy-Authenticate",
		"Proxy-Authorization",
		"Te",
		"Trailers",
		"Transfer-Encoding",
		"Upgrade",
	}

	headerLower := strings.ToLower(header)
	for _, hopHeader := range hopByHopHeaders {
		if strings.ToLower(hopHeader) == headerLower {
			return true
		}
	}
	return false
}

// Extract service name from URL for logging/metrics
func extractServiceName(targetURL string) string {
	u, err := url.Parse(targetURL)
	if err != nil {
		return "unknown"
	}

	// Extract service name from hostname or port
	host := u.Hostname()
	if strings.Contains(host, "auth") {
		return "auth-service"
	} else if strings.Contains(host, "user") {
		return "user-service"
	} else if strings.Contains(host, "finance") {
		return "finance-service"
	}

	// Fallback to port-based detection
	port := u.Port()
	switch port {
	case "3008":
		return "auth-service"
	case "3009":
		return "user-service"
	case "3028":
		return "finance-service"
	case "3029":
		return "hrm-service"
	case "3030":
		return "inventory-service"
	case "3031":
		return "procurement-service"
	case "3032":
		return "ecommerce-service"
	case "3033":
		return "crm-service"
	default:
		return "unknown-service"
	}
}

// Health check proxy for service discovery
func (gw *APIGateway) proxyHealthCheck(serviceName, serviceURL string) gin.HandlerFunc {
	return func(c *gin.Context) {
		client := &http.Client{Timeout: 5 * time.Second}

		resp, err := client.Get(serviceURL + "/health")
		if err != nil {
			c.JSON(http.StatusServiceUnavailable, gin.H{
				"service": serviceName,
				"status":  "unhealthy",
				"error":   err.Error(),
			})
			return
		}
		defer resp.Body.Close()

		body, err := io.ReadAll(resp.Body)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"service": serviceName,
				"status":  "error",
				"error":   "Failed to read health check response",
			})
			return
		}

		c.Status(resp.StatusCode)
		c.Header("Content-Type", "application/json")
		c.Writer.Write(body)
	}
}

// Load balancer for multiple service instances
func (gw *APIGateway) loadBalanceRequest(c *gin.Context, serviceURLs []string, pathPrefix string) {
	if len(serviceURLs) == 0 {
		c.JSON(http.StatusServiceUnavailable, gin.H{
			"error":   "service_unavailable",
			"message": "No healthy service instances available",
		})
		return
	}

	// Simple round-robin load balancing
	// In production, you'd want more sophisticated load balancing
	// based on health checks, response times, etc.

	// For now, just use the first available service
	// You could implement round-robin, least connections, etc.
	selectedURL := serviceURLs[0]

	gw.proxyRequest(c, selectedURL, pathPrefix)
}

// Service discovery helper
func (gw *APIGateway) discoverServiceInstances(serviceName string) []string {
	// This would typically integrate with service discovery systems like:
	// - Kubernetes service discovery
	// - Consul
	// - etcd
	// - AWS ELB

	// For now, return configured URLs
	switch serviceName {
	case "auth-service":
		return []string{gw.config.AuthService}
	case "user-service":
		return []string{gw.config.UserService}
	default:
		return []string{}
	}
}
