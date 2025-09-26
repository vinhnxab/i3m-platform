#!/bin/bash

# I3M Platform - Start Core Services Script
# This script starts the core services (API Gateway, Auth Service, User Service)

set -e

echo "🚀 Starting I3M Platform Core Services..."

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

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker first."
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Navigate to project root
cd "$(dirname "$0")/.."

print_status "Checking project structure..."

# Verify core services exist
CORE_SERVICES=("api-gateway" "auth-service" "user-service")
for service in "${CORE_SERVICES[@]}"; do
    if [ ! -d "core-services/$service" ]; then
        print_error "Core service directory not found: core-services/$service"
        exit 1
    fi
done

print_success "Project structure verified"

# Create necessary directories
print_status "Creating necessary directories..."
mkdir -p logs
mkdir -p data/{postgres,mongodb,redis,timescaledb,elasticsearch}
mkdir -p monitoring/{prometheus,grafana}

# Set permissions
chmod -R 755 data/
chmod -R 755 monitoring/

print_success "Directories created"

# Start infrastructure services first
print_status "Starting infrastructure services (databases, redis, kafka)..."

docker-compose up -d postgres mongodb redis timescaledb elasticsearch zookeeper kafka

# Wait for databases to be ready
print_status "Waiting for databases to be ready..."
sleep 30

# Check database connectivity
print_status "Checking database connectivity..."

# Check PostgreSQL
if docker-compose exec -T postgres pg_isready -U i3m_user -d i3m_platform > /dev/null 2>&1; then
    print_success "PostgreSQL is ready"
else
    print_warning "PostgreSQL is not ready yet, waiting..."
    sleep 15
fi

# Check MongoDB
if docker-compose exec -T mongodb mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1; then
    print_success "MongoDB is ready"
else
    print_warning "MongoDB is not ready yet, waiting..."
    sleep 10
fi

# Check Redis
if docker-compose exec -T redis redis-cli ping > /dev/null 2>&1; then
    print_success "Redis is ready"
else
    print_warning "Redis is not ready yet, waiting..."
    sleep 5
fi

# Start monitoring services
print_status "Starting monitoring services..."
docker-compose up -d prometheus grafana

# Start core services
print_status "Starting core services..."

# Build and start API Gateway
print_status "Building and starting API Gateway..."
docker-compose up -d api-gateway

# Wait for API Gateway to be ready
sleep 10

# Build and start Auth Service
print_status "Building and starting Auth Service..."
docker-compose up -d auth-service

# Wait for Auth Service to be ready
sleep 15

# Build and start User Service
print_status "Building and starting User Service..."
docker-compose up -d user-service

# Wait for User Service to be ready
sleep 20

# Check service health
print_status "Checking service health..."

# Function to check service health
check_service_health() {
    local service_name=$1
    local port=$2
    local endpoint=${3:-"/health"}
    
    if curl -f -s "http://localhost:$port$endpoint" > /dev/null 2>&1; then
        print_success "$service_name is healthy"
        return 0
    else
        print_warning "$service_name health check failed"
        return 1
    fi
}

# Wait a bit more for services to fully start
sleep 15

# Check core services health
check_service_health "API Gateway" "3004"
check_service_health "Auth Service" "3008"
check_service_health "User Service" "3009" "/actuator/health"

# Show running services
print_status "Showing running services..."
docker-compose ps

# Show service URLs
print_success "Core services started successfully!"
echo ""
echo "🌐 Service URLs:"
echo "  - API Gateway:    http://localhost:3004"
echo "  - Auth Service:   http://localhost:3008"
echo "  - User Service:   http://localhost:3009"
echo ""
echo "📊 Monitoring URLs:"
echo "  - Prometheus:     http://localhost:9090"
echo "  - Grafana:        http://localhost:3000 (admin/admin)"
echo ""
echo "🗄️ Database URLs:"
echo "  - PostgreSQL:     localhost:5432 (i3m_user/i3m_password)"
echo "  - MongoDB:        localhost:27017 (i3m_user/i3m_password)"
echo "  - Redis:          localhost:6379 (password: i3m_password)"
echo "  - TimescaleDB:    localhost:5433 (i3m_user/i3m_password)"
echo "  - Elasticsearch:  localhost:9200"
echo ""

# Show logs command
echo "📝 To view logs:"
echo "  docker-compose logs -f [service-name]"
echo ""
echo "🛑 To stop services:"
echo "  docker-compose down"
echo ""

print_success "I3M Platform Core Services are now running! 🎉"

# Optional: Show real-time logs
read -p "Do you want to view real-time logs? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_status "Showing real-time logs (Ctrl+C to exit)..."
    docker-compose logs -f api-gateway auth-service user-service
fi
