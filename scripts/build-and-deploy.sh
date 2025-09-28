#!/bin/bash

# I3M Platform - Build and Deploy Automation Script
# Usage: ./scripts/build-and-deploy.sh [service-name] [--push-registry]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
REGISTRY_URL="localhost:5000"
NAMESPACE="i3m-platform"
CLUSTER_NAME="i3m-platform"

# Helper functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed"
        exit 1
    fi
    
    if ! command -v kubectl &> /dev/null; then
        log_error "kubectl is not installed"
        exit 1
    fi
    
    if ! command -v kind &> /dev/null; then
        log_error "kind is not installed"
        exit 1
    fi
    
    # Check if local registry is running
    if ! docker ps | grep -q local-registry; then
        log_warning "Local registry is not running. Starting it..."
        docker run -d -p 5000:5000 --name local-registry --restart=always registry:2 || true
        docker network connect kind local-registry 2>/dev/null || true
        sleep 5
    fi
    
    log_success "Prerequisites check passed"
}

# Build service
build_service() {
    local service_path=$1
    local service_name=$2
    
    log_info "Building service: $service_name"
    
    if [ ! -d "$service_path" ]; then
        log_error "Service directory not found: $service_path"
        return 1
    fi
    
    cd "$service_path"
    
    # Determine build method
    if [ -f "Dockerfile" ]; then
        log_info "Building Docker image for $service_name..."
        docker build -t "i3m-platform-$service_name:latest" .
        
        # Tag for registry
        docker tag "i3m-platform-$service_name:latest" "$REGISTRY_URL/i3m-platform-$service_name:latest"
        
        log_success "Built $service_name successfully"
    elif [ -f "pom.xml" ]; then
        log_info "Building Java service $service_name..."
        mvn clean package -DskipTests
        docker build -t "i3m-platform-$service_name:latest" .
        docker tag "i3m-platform-$service_name:latest" "$REGISTRY_URL/i3m-platform-$service_name:latest"
        log_success "Built Java service $service_name successfully"
    elif [ -f "package.json" ]; then
        log_info "Building Node.js service $service_name..."
        npm install
        docker build -t "i3m-platform-$service_name:latest" .
        docker tag "i3m-platform-$service_name:latest" "$REGISTRY_URL/i3m-platform-$service_name:latest"
        log_success "Built Node.js service $service_name successfully"
    else
        log_warning "No build configuration found for $service_name, trying Dockerfile only"
        if [ -f "Dockerfile" ]; then
            docker build -t "i3m-platform-$service_name:latest" .
            docker tag "i3m-platform-$service_name:latest" "$REGISTRY_URL/i3m-platform-$service_name:latest"
        else
            log_error "No Dockerfile found for $service_name"
            return 1
        fi
    fi
    
    cd - > /dev/null
}

# Push to registry
push_to_registry() {
    local service_name=$1
    
    log_info "Pushing $service_name to local registry..."
    docker push "$REGISTRY_URL/i3m-platform-$service_name:latest"
    log_success "Pushed $service_name to registry"
}

# Load image to Kind
load_to_kind() {
    local service_name=$1
    
    log_info "Loading $service_name image to Kind cluster..."
    kind load docker-image "i3m-platform-$service_name:latest" --name "$CLUSTER_NAME"
    log_success "Loaded $service_name to Kind cluster"
}

# Deploy to Kubernetes
deploy_to_k8s() {
    local service_name=$1
    
    log_info "Deploying $service_name to Kubernetes..."
    
    # Restart deployment if exists
    if kubectl get deployment "$service_name" -n "$NAMESPACE" &> /dev/null; then
        kubectl rollout restart deployment "$service_name" -n "$NAMESPACE"
        kubectl rollout status deployment "$service_name" -n "$NAMESPACE" --timeout=300s
        log_success "Restarted $service_name deployment"
    else
        log_warning "Deployment $service_name not found in namespace $NAMESPACE"
    fi
}

# Build all services
build_all_services() {
    log_info "Building all services..."
    
    # Core services
    for service in api-gateway auth-service user-service; do
        if [ -d "core-services/$service" ]; then
            build_service "core-services/$service" "$service"
            load_to_kind "$service"
            if [ "$PUSH_REGISTRY" = "true" ]; then
                push_to_registry "$service"
            fi
            deploy_to_k8s "$service"
        fi
    done
    
    # Content services
    for service in content-service media-service; do
        if [ -d "content-services/$service" ]; then
            build_service "content-services/$service" "$service"
            load_to_kind "$service"
            if [ "$PUSH_REGISTRY" = "true" ]; then
                push_to_registry "$service"
            fi
            deploy_to_k8s "$service"
        fi
    done
    
    # Analytics services
    for service in ai-service analytics-service ml-pipeline-service; do
        if [ -d "analytics-services/$service" ]; then
            build_service "analytics-services/$service" "$service"
            load_to_kind "$service"
            if [ "$PUSH_REGISTRY" = "true" ]; then
                push_to_registry "$service"
            fi
            deploy_to_k8s "$service"
        fi
    done
    
    log_success "All services built and deployed successfully"
}

# Main execution
main() {
    local service_name=""
    local push_registry=false
    
    # Parse arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            --push-registry)
                push_registry=true
                shift
                ;;
            --all)
                service_name="all"
                shift
                ;;
            *)
                service_name="$1"
                shift
                ;;
        esac
    done
    
    export PUSH_REGISTRY=$push_registry
    
    check_prerequisites
    
    if [ "$service_name" = "all" ] || [ -z "$service_name" ]; then
        build_all_services
    else
        # Find service directory
        service_path=""
        for dir in core-services content-services analytics-services erp-services infrastructure-services; do
            if [ -d "$dir/$service_name" ]; then
                service_path="$dir/$service_name"
                break
            fi
        done
        
        if [ -z "$service_path" ]; then
            log_error "Service $service_name not found"
            exit 1
        fi
        
        build_service "$service_path" "$service_name"
        load_to_kind "$service_name"
        
        if [ "$push_registry" = "true" ]; then
            push_to_registry "$service_name"
        fi
        
        deploy_to_k8s "$service_name"
    fi
    
    log_success "Build and deploy completed successfully!"
}

# Run main function
main "$@"
