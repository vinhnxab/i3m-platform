#!/bin/bash

# I3M Platform - Check and Build All Services Script
# This script checks all services and builds them, reporting failures

set -e

echo "🔍 Starting I3M Platform Services Check and Build Process..."
echo "=========================================================="

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

# Function to build a service
build_service() {
    local service_path=$1
    local service_name=$(basename "$service_path")
    
    if [ ! -f "$service_path/Dockerfile" ]; then
        print_warning "No Dockerfile found for service: $service_name. Skipping."
        return 1
    fi

    print_status "Building $service_name..."
    
    # Use a temporary tag for building, then retag and load if successful
    local temp_image_name="i3m-platform-$service_name-temp:latest"
    local final_image_name="i3m-platform-$service_name:latest"

    if docker build -t "$temp_image_name" "$service_path" 2>/dev/null; then
        print_success "Successfully built $service_name"
        
        # Tag the image with the final name
        docker tag "$temp_image_name" "$final_image_name"
        docker rmi "$temp_image_name" # Remove temporary tag

        # Load image into Kind cluster
        print_status "Loading $final_image_name into kind cluster..."
        if kind load docker-image "$final_image_name" --name i3m-platform 2>/dev/null; then
            print_success "Successfully loaded $service_name into kind cluster"
            return 0
        else
            print_error "Failed to load $service_name into kind cluster"
            return 1
        fi
    else
        print_error "Failed to build $service_name"
        return 1
    fi
}

# Initialize counters
TOTAL_SERVICES=0
SUCCESS_BUILDS=0
FAILED_BUILDS=0
FAILED_SERVICE_NAMES=()
SUCCESS_SERVICE_NAMES=()

# Find all Dockerfiles and build services
# Exclude shared/ and scripts/ directories
find . -type f -name "Dockerfile" | sort | while read -r dockerfile_path; do
    # Extract service_path (parent directory of Dockerfile)
    service_path=$(dirname "$dockerfile_path")
    
    # Skip if it's a shared library or script directory
    if [[ "$service_path" == "./shared"* ]] || [[ "$service_path" == "./scripts"* ]]; then
        print_status "Skipping $service_path (shared library or script directory)"
        continue
    fi

    TOTAL_SERVICES=$((TOTAL_SERVICES + 1))
    if build_service "$service_path"; then
        SUCCESS_BUILDS=$((SUCCESS_BUILDS + 1))
        SUCCESS_SERVICE_NAMES+=("$(basename "$service_path")")
    else
        FAILED_BUILDS=$((FAILED_BUILDS + 1))
        FAILED_SERVICE_NAMES+=("$(basename "$service_path")")
    fi
done

echo "=========================================================="
print_status "Build Summary:"
print_status "  Total services processed: $TOTAL_SERVICES"
print_success "  Successfully built: $SUCCESS_BUILDS"
if [ "$FAILED_BUILDS" -gt 0 ]; then
    print_error "  Failed builds: $FAILED_BUILDS"
    print_error "  Failed services: ${FAILED_SERVICE_NAMES[*]}"
    echo ""
    print_status "Services that need to be fixed:"
    for service in "${FAILED_SERVICE_NAMES[@]}"; do
        echo "  - $service"
    done
else
    print_success "  All services built successfully!"
fi
echo "=========================================================="

if [ "$FAILED_BUILDS" -gt 0 ]; then
    exit 1
fi
