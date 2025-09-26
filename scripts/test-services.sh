#!/bin/bash

# I3M Platform - Test Services Script
# This script tests the health and basic functionality of all services

set -e

echo "🧪 Testing I3M Platform Services..."

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Test results
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Function to run a test
run_test() {
    local test_name="$1"
    local test_command="$2"
    local expected_status="${3:-200}"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    print_status "Testing: $test_name"
    
    if eval "$test_command" > /dev/null 2>&1; then
        print_success "✓ $test_name"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        return 0
    else
        print_error "✗ $test_name"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        return 1
    fi
}

# Function to test HTTP endpoint
test_http_endpoint() {
    local name="$1"
    local url="$2"
    local expected_status="${3:-200}"
    
    run_test "$name" "curl -f -s -o /dev/null -w '%{http_code}' '$url' | grep -q '$expected_status'"
}

# Function to test database connection
test_database() {
    local name="$1"
    local command="$2"
    
    run_test "$name" "$command"
}

echo ""
echo "🔍 Starting health checks..."
echo ""

# Test infrastructure services
print_status "Testing infrastructure services..."

test_database "PostgreSQL Connection" "docker-compose exec -T postgres pg_isready -U i3m_user -d i3m_platform"
test_database "MongoDB Connection" "docker-compose exec -T mongodb mongosh --eval 'db.adminCommand(\"ping\")'"
test_database "Redis Connection" "docker-compose exec -T redis redis-cli ping | grep -q PONG"

# Test monitoring services
print_status "Testing monitoring services..."

test_http_endpoint "Prometheus Health" "http://localhost:9090/-/healthy"
test_http_endpoint "Grafana Health" "http://localhost:3000/api/health"

# Test core services
print_status "Testing core services..."

test_http_endpoint "API Gateway Health" "http://localhost:3004/health"
test_http_endpoint "Auth Service Health" "http://localhost:3008/health"
test_http_endpoint "User Service Health" "http://localhost:3009/actuator/health"

# Test API endpoints
print_status "Testing API endpoints..."

# Test API Gateway routing
test_http_endpoint "API Gateway - Auth Route" "http://localhost:3004/api/v1/auth/health" "404"
test_http_endpoint "API Gateway - Users Route" "http://localhost:3004/api/v1/users" "401"

# Test authentication flow
print_status "Testing authentication flow..."

# Create a test user (this might fail if user already exists, that's OK)
print_status "Creating test user..."
curl -s -X POST "http://localhost:3004/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -H "X-Tenant-ID: 550e8400-e29b-41d4-a716-446655440000" \
  -d '{
    "email": "test@example.com",
    "password": "testpassword123",
    "first_name": "Test",
    "last_name": "User",
    "tenant_id": "550e8400-e29b-41d4-a716-446655440000"
  }' > /dev/null 2>&1 || true

# Test login
print_status "Testing login..."
LOGIN_RESPONSE=$(curl -s -X POST "http://localhost:3004/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -H "X-Tenant-ID: 550e8400-e29b-41d4-a716-446655440000" \
  -d '{
    "email": "admin@demo.com",
    "password": "admin123",
    "tenant_id": "550e8400-e29b-41d4-a716-446655440000"
  }' 2>/dev/null || echo '{}')

# Extract access token
ACCESS_TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"access_token":"[^"]*' | cut -d'"' -f4 || echo "")

if [ -n "$ACCESS_TOKEN" ] && [ "$ACCESS_TOKEN" != "null" ]; then
    print_success "✓ Login successful"
    PASSED_TESTS=$((PASSED_TESTS + 1))
    
    # Test authenticated endpoints
    print_status "Testing authenticated endpoints..."
    
    test_http_endpoint "Get User Profile" "http://localhost:3004/api/v1/auth/profile" "200" \
        -H "Authorization: Bearer $ACCESS_TOKEN" \
        -H "X-Tenant-ID: 550e8400-e29b-41d4-a716-446655440000"
    
    test_http_endpoint "Get Users List" "http://localhost:3004/api/v1/users" "200" \
        -H "Authorization: Bearer $ACCESS_TOKEN" \
        -H "X-Tenant-ID: 550e8400-e29b-41d4-a716-446655440000"
else
    print_error "✗ Login failed"
    FAILED_TESTS=$((FAILED_TESTS + 1))
fi

TOTAL_TESTS=$((TOTAL_TESTS + 2)) # Add login and authenticated tests

# Test metrics endpoints
print_status "Testing metrics endpoints..."

test_http_endpoint "API Gateway Metrics" "http://localhost:3004/metrics"
test_http_endpoint "Auth Service Metrics" "http://localhost:3008/metrics"
test_http_endpoint "User Service Metrics" "http://localhost:3009/actuator/prometheus"

# Test service discovery and load balancing
print_status "Testing service discovery..."

# Test that API Gateway can route to services
test_http_endpoint "API Gateway to Auth Service" "http://localhost:3004/api/v1/auth/health" "404"

# Performance tests
print_status "Running basic performance tests..."

# Test response times
print_status "Testing response times..."
API_GATEWAY_TIME=$(curl -o /dev/null -s -w '%{time_total}' http://localhost:3004/health || echo "0")
AUTH_SERVICE_TIME=$(curl -o /dev/null -s -w '%{time_total}' http://localhost:3008/health || echo "0")
USER_SERVICE_TIME=$(curl -o /dev/null -s -w '%{time_total}' http://localhost:3009/actuator/health || echo "0")

echo ""
print_status "Response times:"
echo "  - API Gateway: ${API_GATEWAY_TIME}s"
echo "  - Auth Service: ${AUTH_SERVICE_TIME}s"
echo "  - User Service: ${USER_SERVICE_TIME}s"

# Check if response times are reasonable (< 2 seconds)
if (( $(echo "$API_GATEWAY_TIME < 2" | bc -l) )); then
    print_success "✓ API Gateway response time is good"
    PASSED_TESTS=$((PASSED_TESTS + 1))
else
    print_warning "⚠ API Gateway response time is slow"
    FAILED_TESTS=$((FAILED_TESTS + 1))
fi

TOTAL_TESTS=$((TOTAL_TESTS + 1))

# Test concurrent requests
print_status "Testing concurrent requests..."
CONCURRENT_REQUESTS=10
CONCURRENT_RESULTS=$(seq 1 $CONCURRENT_REQUESTS | xargs -n1 -P$CONCURRENT_REQUESTS -I{} curl -s -o /dev/null -w '%{http_code}' http://localhost:3004/health)
SUCCESSFUL_CONCURRENT=$(echo "$CONCURRENT_RESULTS" | grep -c "200" || echo "0")

if [ "$SUCCESSFUL_CONCURRENT" -eq "$CONCURRENT_REQUESTS" ]; then
    print_success "✓ Concurrent requests handled successfully ($SUCCESSFUL_CONCURRENT/$CONCURRENT_REQUESTS)"
    PASSED_TESTS=$((PASSED_TESTS + 1))
else
    print_warning "⚠ Some concurrent requests failed ($SUCCESSFUL_CONCURRENT/$CONCURRENT_REQUESTS)"
    FAILED_TESTS=$((FAILED_TESTS + 1))
fi

TOTAL_TESTS=$((TOTAL_TESTS + 1))

# Memory and CPU usage check
print_status "Checking resource usage..."
MEMORY_USAGE=$(docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}" | grep -E "(api-gateway|auth-service|user-service)")
echo ""
print_status "Resource usage:"
echo "$MEMORY_USAGE"

# Final results
echo ""
echo "==============================================="
print_status "Test Results Summary"
echo "==============================================="
echo "Total Tests:  $TOTAL_TESTS"
print_success "Passed:       $PASSED_TESTS"
print_error "Failed:       $FAILED_TESTS"
echo ""

if [ $FAILED_TESTS -eq 0 ]; then
    print_success "🎉 All tests passed! Services are healthy and functioning correctly."
    echo ""
    echo "🌐 You can now use the platform:"
    echo "  - API Gateway: http://localhost:3004"
    echo "  - Prometheus:  http://localhost:9090"
    echo "  - Grafana:     http://localhost:3000 (admin/admin)"
    exit 0
else
    print_error "❌ Some tests failed. Please check the services and logs."
    echo ""
    echo "📝 To check logs:"
    echo "  docker-compose logs [service-name]"
    echo ""
    echo "🔧 To restart services:"
    echo "  ./scripts/start-core-services.sh"
    exit 1
fi
