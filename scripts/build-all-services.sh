#!/bin/bash

# I3M Platform - Build All Services Script
# This script builds all available services in the platform

set -e

echo "🚀 Starting I3M Platform Services Build Process..."
echo "=================================================="

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
        print_warning "No Dockerfile found for $service_name, skipping..."
        return 0
    fi
    
    print_status "Building $service_name..."
    
    cd "$service_path"
    
    # Build the Docker image
    if docker build -t "i3m-platform-$service_name:latest" .; then
        print_success "Successfully built $service_name"
        
        # Load image into kind cluster
        if kind load docker-image "i3m-platform-$service_name:latest" --name i3m-platform; then
            print_success "Successfully loaded $service_name into kind cluster"
        else
            print_error "Failed to load $service_name into kind cluster"
            return 1
        fi
    else
        print_error "Failed to build $service_name"
        return 1
    fi
    
    cd - > /dev/null
}

# Function to build Go services
build_go_service() {
    local service_path=$1
    local service_name=$(basename "$service_path")
    
    print_status "Building Go service: $service_name"
    
    cd "$service_path"
    
    # Build Go binary
    if go build -o main .; then
        print_success "Go binary built for $service_name"
    else
        print_error "Failed to build Go binary for $service_name"
        return 1
    fi
    
    cd - > /dev/null
}

# Function to build Java services
build_java_service() {
    local service_path=$1
    local service_name=$(basename "$service_path")
    
    print_status "Building Java service: $service_name"
    
    cd "$service_path"
    
    # Build Java service with Maven
    if [ -f "pom.xml" ]; then
        if mvn clean package -DskipTests; then
            print_success "Java service built for $service_name"
        else
            print_error "Failed to build Java service $service_name"
            return 1
        fi
    else
        print_warning "No pom.xml found for $service_name"
    fi
    
    cd - > /dev/null
}

# Function to build Node.js services
build_node_service() {
    local service_path=$1
    local service_name=$(basename "$service_path")
    
    print_status "Building Node.js service: $service_name"
    
    cd "$service_path"
    
    # Install dependencies and build
    if [ -f "package.json" ]; then
        if npm install; then
            print_success "Dependencies installed for $service_name"
        else
            print_error "Failed to install dependencies for $service_name"
            return 1
        fi
    else
        print_warning "No package.json found for $service_name"
    fi
    
    cd - > /dev/null
}

# Function to build Python services
build_python_service() {
    local service_path=$1
    local service_name=$(basename "$service_path")
    
    print_status "Building Python service: $service_name"
    
    cd "$service_path"
    
    # Install Python dependencies
    if [ -f "requirements.txt" ]; then
        if pip install -r requirements.txt; then
            print_success "Dependencies installed for $service_name"
        else
            print_error "Failed to install dependencies for $service_name"
            return 1
        fi
    else
        print_warning "No requirements.txt found for $service_name"
    fi
    
    cd - > /dev/null
}

# Main build process
main() {
    local build_count=0
    local success_count=0
    local error_count=0
    
    print_status "Starting build process for all services..."
    
    # Core Services
    print_status "Building Core Services..."
    for service in /home/vinhnx/i3m-platform/core-services/*/; do
        if [ -d "$service" ]; then
            build_count=$((build_count + 1))
            if build_service "$service"; then
                success_count=$((success_count + 1))
            else
                error_count=$((error_count + 1))
            fi
        fi
    done
    
    # ERP Services
    print_status "Building ERP Services..."
    for service in /home/vinhnx/i3m-platform/erp-services/*/; do
        if [ -d "$service" ]; then
            build_count=$((build_count + 1))
            if build_service "$service"; then
                success_count=$((success_count + 1))
            else
                error_count=$((error_count + 1))
            fi
        fi
    done
    
    # Analytics Services
    print_status "Building Analytics Services..."
    for service in /home/vinhnx/i3m-platform/analytics-services/*/; do
        if [ -d "$service" ]; then
            build_count=$((build_count + 1))
            if build_service "$service"; then
                success_count=$((success_count + 1))
            else
                error_count=$((error_count + 1))
            fi
        fi
    done
    
    # Content Services
    print_status "Building Content Services..."
    for service in /home/vinhnx/i3m-platform/content-services/*/; do
        if [ -d "$service" ]; then
            build_count=$((build_count + 1))
            if build_service "$service"; then
                success_count=$((success_count + 1))
            else
                error_count=$((error_count + 1))
            fi
        fi
    done
    
    # Industry Services
    print_status "Building Industry Services..."
    for service in /home/vinhnx/i3m-platform/industry-services/*/; do
        if [ -d "$service" ]; then
            build_count=$((build_count + 1))
            if build_service "$service"; then
                success_count=$((success_count + 1))
            else
                error_count=$((error_count + 1))
            fi
        fi
    done
    
    # Infrastructure Services
    print_status "Building Infrastructure Services..."
    for service in /home/vinhnx/i3m-platform/infrastructure-services/*/; do
        if [ -d "$service" ]; then
            build_count=$((build_count + 1))
            if build_service "$service"; then
                success_count=$((success_count + 1))
            else
                error_count=$((error_count + 1))
            fi
        fi
    done
    
    # Integration Services
    print_status "Building Integration Services..."
    for service in /home/vinhnx/i3m-platform/integration-services/*/; do
        if [ -d "$service" ]; then
            build_count=$((build_count + 1))
            if build_service "$service"; then
                success_count=$((success_count + 1))
            else
                error_count=$((error_count + 1))
            fi
        fi
    done
    
    # Marketplace Services
    print_status "Building Marketplace Services..."
    for service in /home/vinhnx/i3m-platform/marketplace-services/*/; do
        if [ -d "$service" ]; then
            build_count=$((build_count + 1))
            if build_service "$service"; then
                success_count=$((success_count + 1))
            else
                error_count=$((error_count + 1))
            fi
        fi
    done
    
    # Shared Services
    print_status "Building Shared Services..."
    for service in /home/vinhnx/i3m-platform/shared-services/*/; do
        if [ -d "$service" ]; then
            build_count=$((build_count + 1))
            if build_service "$service"; then
                success_count=$((success_count + 1))
            else
                error_count=$((error_count + 1))
            fi
        fi
    done
    
    # Print summary
    echo ""
    echo "=================================================="
    print_status "Build Summary:"
    echo "  Total services processed: $build_count"
    print_success "  Successfully built: $success_count"
    if [ $error_count -gt 0 ]; then
        print_error "  Failed builds: $error_count"
    fi
    echo "=================================================="
    
    if [ $error_count -eq 0 ]; then
        print_success "All services built successfully! 🎉"
        return 0
    else
        print_error "Some services failed to build. Please check the logs above."
        return 1
    fi
}

# Run main function
main "$@"
