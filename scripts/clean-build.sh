#!/bin/bash

# I3M Platform - Clean Build Script
# Tự động dọn dẹp build cũ và build mới

set -e

echo "🧹 I3M Platform - Clean Build Script"
echo "======================================"

# Colors for output
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

# Function to clean up Docker resources
cleanup_docker() {
    print_status "Cleaning up Docker resources..."
    
    # Stop all running containers
    print_status "Stopping all running containers..."
    $DOCKER_COMPOSE_CMD down --remove-orphans 2>/dev/null || true
    
    # Remove unused images (dangling images)
    print_status "Removing dangling images..."
    docker image prune -f 2>/dev/null || true
    
    # Remove unused containers
    print_status "Removing unused containers..."
    docker container prune -f 2>/dev/null || true
    
    # Remove unused networks
    print_status "Removing unused networks..."
    docker network prune -f 2>/dev/null || true
    
    # Remove unused volumes (be careful with this!)
    print_status "Removing unused volumes..."
    docker volume prune -f 2>/dev/null || true
    
    print_success "Docker cleanup completed!"
}

# Function to clean up build cache
cleanup_build_cache() {
    print_status "Cleaning up build cache..."
    
    # Remove build cache
    docker builder prune -f 2>/dev/null || true
    
    # Remove all unused images (not just dangling)
    print_warning "Removing all unused images (this may take a while)..."
    docker image prune -a -f 2>/dev/null || true
    
    print_success "Build cache cleanup completed!"
}

# Function to show disk usage
show_disk_usage() {
    print_status "Current Docker disk usage:"
    docker system df 2>/dev/null || true
    
    print_status "Current system disk usage:"
    df -h / 2>/dev/null || true
}

# Function to build services
build_services() {
    local services="$1"
    
    if [ -z "$services" ]; then
        print_status "Building all services..."
        $DOCKER_COMPOSE_CMD build --no-cache --pull
    else
        print_status "Building services: $services"
        $DOCKER_COMPOSE_CMD build --no-cache --pull $services
    fi
    
    print_success "Build completed!"
}

# Function to start services
start_services() {
    local services="$1"
    
    if [ -z "$services" ]; then
        print_status "Starting all services..."
        $DOCKER_COMPOSE_CMD up -d
    else
        print_status "Starting services: $services"
        $DOCKER_COMPOSE_CMD up -d $services
    fi
    
    print_success "Services started!"
}

# Main function
main() {
    local action="$1"
    local services="$2"
    
    case "$action" in
        "clean")
            cleanup_docker
            show_disk_usage
            ;;
        "clean-all")
            cleanup_docker
            cleanup_build_cache
            show_disk_usage
            ;;
        "build")
            cleanup_docker
            build_services "$services"
            start_services "$services"
            show_disk_usage
            ;;
        "build-all")
            cleanup_docker
            cleanup_build_cache
            build_services
            start_services
            show_disk_usage
            ;;
        "status")
            show_disk_usage
            ;;
        *)
            echo "Usage: $0 {clean|clean-all|build|build-all|status} [services]"
            echo ""
            echo "Commands:"
            echo "  clean      - Clean up Docker resources (containers, networks, volumes)"
            echo "  clean-all  - Clean up everything including build cache and unused images"
            echo "  build      - Clean + Build + Start services"
            echo "  build-all  - Clean everything + Build all + Start all"
            echo "  status     - Show current disk usage"
            echo ""
            echo "Examples:"
            echo "  $0 clean"
            echo "  $0 clean-all"
            echo "  $0 build auth-service"
            echo "  $0 build-all"
            echo "  $0 status"
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"
