#!/bin/bash

# I3M Platform - Build All Services Script
# Build tất cả services với auto cleanup

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Parse arguments
NO_CACHE=""
PULL=""
CLEAN_ALL=""
SERVICES_ONLY=""

while [[ $# -gt 0 ]]; do
    case $1 in
        --no-cache)
            NO_CACHE="--no-cache"
            shift
            ;;
        --pull)
            PULL="--pull"
            shift
            ;;
        --clean-all)
            CLEAN_ALL="true"
            shift
            ;;
        --services-only)
            SERVICES_ONLY="true"
            shift
            ;;
        *)
            print_error "Unknown option: $1"
            echo "Usage: $0 [--no-cache] [--pull] [--clean-all] [--services-only]"
            exit 1
            ;;
    esac
done

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed!"
        exit 1
    fi
    DOCKER_COMPOSE_CMD="docker compose"
else
    DOCKER_COMPOSE_CMD="docker-compose"
fi

print_status "Using Docker Compose command: $DOCKER_COMPOSE_CMD"

# Function to show disk usage
show_disk_usage() {
    print_status "Current Docker disk usage:"
    docker system df 2>/dev/null || true
    
    print_status "Current system disk usage:"
    df -h / 2>/dev/null || true
}

# Function to clean up everything
cleanup_all() {
    print_status "Cleaning up all Docker resources..."
    
    # Stop all running containers
    print_status "Stopping all running containers..."
    $DOCKER_COMPOSE_CMD down --remove-orphans 2>/dev/null || true
    
    # Remove unused images
    print_status "Removing unused images..."
    docker image prune -a -f 2>/dev/null || true
    
    # Remove unused containers
    print_status "Removing unused containers..."
    docker container prune -f 2>/dev/null || true
    
    # Remove unused networks
    print_status "Removing unused networks..."
    docker network prune -f 2>/dev/null || true
    
    # Remove unused volumes (be careful!)
    print_warning "Removing unused volumes..."
    docker volume prune -f 2>/dev/null || true
    
    # Remove build cache
    print_status "Removing build cache..."
    docker builder prune -a -f 2>/dev/null || true
    
    print_success "All cleanup completed!"
}

# Function to build all services
build_all_services() {
    print_status "Building all services with options: $NO_CACHE $PULL"
    
    # Build all services
    $DOCKER_COMPOSE_CMD build $NO_CACHE $PULL
    
    print_success "All services built successfully!"
}

# Function to start all services
start_all_services() {
    print_status "Starting all services..."
    
    # Start all services
    $DOCKER_COMPOSE_CMD up -d
    
    print_success "All services started!"
}

# Function to start only core services
start_core_services() {
    print_status "Starting core services only..."
    
    # Start core services
    $DOCKER_COMPOSE_CMD up -d postgres redis auth-service api-gateway
    
    print_success "Core services started!"
}

# Function to show service status
show_status() {
    print_status "Service status:"
    $DOCKER_COMPOSE_CMD ps
}

# Main execution
main() {
    print_status "Starting build process for all services..."
    
    # Show initial disk usage
    show_disk_usage
    
    # Clean up if requested
    if [ "$CLEAN_ALL" = "true" ]; then
        cleanup_all
    fi
    
    # Build all services
    build_all_services
    
    # Start services
    if [ "$SERVICES_ONLY" = "true" ]; then
        start_core_services
    else
        start_all_services
    fi
    
    # Show final status
    show_status
    show_disk_usage
    
    print_success "Build and start completed for all services!"
}

# Run main function
main
