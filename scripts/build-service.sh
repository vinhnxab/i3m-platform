#!/bin/bash

# I3M Platform - Build Single Service Script
# Build một service cụ thể với auto cleanup

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

# Check if service name is provided
if [ -z "$1" ]; then
    print_error "Service name is required!"
    echo "Usage: $0 <service-name> [--no-cache] [--pull]"
    echo ""
    echo "Available services:"
    echo "  - api-gateway"
    echo "  - auth-service"
    echo "  - user-service"
    echo "  - content-service"
    echo "  - media-service"
    echo "  - metadata-service"
    echo "  - analytics-service"
    echo "  - ai-service"
    echo "  - ml-pipeline-service"
    echo "  - user-analytics-service"
    echo "  - crm-service"
    echo "  - ecommerce-service"
    echo "  - finance-service"
    echo "  - hrm-service"
    echo "  - inventory-service"
    echo "  - procurement-service"
    echo "  - agriculture-service"
    echo "  - healthcare-service"
    echo "  - cost-optimization-service"
    echo "  - load-balancer-service"
    echo "  - observability-service"
    echo "  - secrets-management-service"
    echo "  - security-service"
    echo "  - api-documentation-service"
    echo "  - currency-exchange-service"
    echo "  - integration-service"
    echo "  - installation-service"
    echo "  - preview-service"
    echo "  - template-marketplace-service"
    echo "  - billing-service"
    echo "  - notification-service"
    echo "  - workflow-service"
    exit 1
fi

SERVICE_NAME="$1"
NO_CACHE=""
PULL=""

# Parse additional arguments
shift
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
        *)
            print_error "Unknown option: $1"
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

print_status "Building service: $SERVICE_NAME"
print_status "Using Docker Compose command: $DOCKER_COMPOSE_CMD"

# Function to clean up old images for this service
cleanup_service_images() {
    print_status "Cleaning up old images for $SERVICE_NAME..."
    
    # Get the image name for this service
    local image_name="i3m-platform-${SERVICE_NAME}"
    
    # Remove old images for this service
    docker images --filter "reference=${image_name}" --format "table {{.Repository}}:{{.Tag}}\t{{.ID}}" | tail -n +2 | while read line; do
        if [ ! -z "$line" ]; then
            local image_id=$(echo "$line" | awk '{print $2}')
            print_status "Removing old image: $image_id"
            docker rmi "$image_id" 2>/dev/null || true
        fi
    done
    
    print_success "Old images cleaned up!"
}

# Function to build the service
build_service() {
    print_status "Building $SERVICE_NAME with options: $NO_CACHE $PULL"
    
    # Build the service
    $DOCKER_COMPOSE_CMD build $NO_CACHE $PULL $SERVICE_NAME
    
    print_success "Build completed for $SERVICE_NAME!"
}

# Function to start the service
start_service() {
    print_status "Starting $SERVICE_NAME..."
    
    # Start the service
    $DOCKER_COMPOSE_CMD up -d $SERVICE_NAME
    
    print_success "$SERVICE_NAME started!"
}

# Function to show service status
show_status() {
    print_status "Service status:"
    $DOCKER_COMPOSE_CMD ps $SERVICE_NAME
}

# Main execution
main() {
    print_status "Starting build process for $SERVICE_NAME..."
    
    # Clean up old images
    cleanup_service_images
    
    # Build the service
    build_service
    
    # Start the service
    start_service
    
    # Show status
    show_status
    
    print_success "Build and start completed for $SERVICE_NAME!"
}

# Run main function
main
