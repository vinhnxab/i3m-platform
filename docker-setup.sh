#!/bin/bash

# I3M Platform - Docker CLI Setup Script
# Thống nhất sử dụng Docker CLI thay vì Docker Desktop

set -e

echo "🚀 I3M Platform - Docker CLI Setup"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}[HEADER]${NC} $1"
}

# Check if Docker is running
check_docker() {
    print_header "Checking Docker status..."
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker daemon."
        exit 1
    fi
    print_status "Docker is running ✓"
}

# Check Docker Compose
check_compose() {
    print_header "Checking Docker Compose..."
    if ! docker compose version > /dev/null 2>&1; then
        print_error "Docker Compose is not available."
        exit 1
    fi
    print_status "Docker Compose is available ✓"
}

# Stop all I3M services
stop_services() {
    print_header "Stopping all I3M services..."
    docker compose down --remove-orphans
    print_status "All services stopped ✓"
}

# Clean up Docker Desktop containers
cleanup_desktop() {
    print_header "Cleaning up Docker Desktop containers..."
    
    # Stop and remove Docker Desktop containers
    docker stop $(docker ps -q --filter "name=desktop-") 2>/dev/null || true
    docker rm $(docker ps -aq --filter "name=desktop-") 2>/dev/null || true
    docker stop $(docker ps -q --filter "name=kind-") 2>/dev/null || true
    docker rm $(docker ps -aq --filter "name=kind-") 2>/dev/null || true
    
    print_status "Docker Desktop containers cleaned up ✓"
}

# Build all services
build_services() {
    print_header "Building all I3M services..."
    docker compose build --parallel
    print_status "All services built ✓"
}

# Start core services first
start_core() {
    print_header "Starting core services..."
    docker compose up -d postgres redis mongodb
    sleep 10
    docker compose up -d api-gateway auth-service user-service
    print_status "Core services started ✓"
}

# Start ERP services
start_erp() {
    print_header "Starting ERP services..."
    docker compose up -d finance-service crm-service
    print_status "ERP services started ✓"
}

# Start analytics services
start_analytics() {
    print_header "Starting analytics services..."
    docker compose up -d analytics-service ai-service
    print_status "Analytics services started ✓"
}

# Start remaining services
start_remaining() {
    print_header "Starting remaining services..."
    docker compose up -d
    print_status "All services started ✓"
}

# Check service health
check_health() {
    print_header "Checking service health..."
    
    # Wait for services to be ready
    sleep 30
    
    # Check each service
    services=("api-gateway:3004" "auth-service:3008" "user-service:3009" "finance-service:3028" "crm-service:3015")
    
    for service in "${services[@]}"; do
        name=$(echo $service | cut -d: -f1)
        port=$(echo $service | cut -d: -f2)
        
        if curl -s http://localhost:$port/health > /dev/null 2>&1; then
            print_status "$name is healthy ✓"
        else
            print_warning "$name is not responding"
        fi
    done
}

# Show service status
show_status() {
    print_header "Service Status:"
    docker compose ps
}

# Main execution
main() {
    print_header "Starting I3M Platform Docker CLI Setup"
    
    check_docker
    check_compose
    stop_services
    cleanup_desktop
    build_services
    start_core
    start_erp
    start_analytics
    start_remaining
    check_health
    show_status
    
    print_status "Setup completed! 🎉"
    print_status "Access your services at:"
    print_status "- API Gateway: http://localhost:3004"
    print_status "- Auth Service: http://localhost:3008"
    print_status "- User Service: http://localhost:3009"
    print_status "- Finance Service: http://localhost:3028"
    print_status "- CRM Service: http://localhost:3015"
}

# Run main function
main "$@"
