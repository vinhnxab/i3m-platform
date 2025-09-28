#!/bin/bash

# I3M Platform - Service Management Script
# Quản lý services bằng Docker CLI

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

print_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
print_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
print_error() { echo -e "${RED}[ERROR]${NC} $1"; }
print_header() { echo -e "${BLUE}[HEADER]${NC} $1"; }

# Function to show help
show_help() {
    echo "I3M Platform Service Management"
    echo "==============================="
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  start       - Start all services"
    echo "  stop        - Stop all services"
    echo "  restart     - Restart all services"
    echo "  status      - Show service status"
    echo "  logs        - Show logs for all services"
    echo "  build       - Build all services"
    echo "  clean       - Clean up Docker resources"
    echo "  health      - Check service health"
    echo "  core        - Start only core services"
    echo "  erp         - Start ERP services"
    echo "  analytics   - Start analytics services"
    echo ""
}

# Start all services
start_all() {
    print_header "Starting all I3M services..."
    docker compose up -d
    print_info "All services started ✓"
}

# Stop all services
stop_all() {
    print_header "Stopping all I3M services..."
    docker compose down
    print_info "All services stopped ✓"
}

# Restart all services
restart_all() {
    print_header "Restarting all I3M services..."
    docker compose restart
    print_info "All services restarted ✓"
}

# Show service status
show_status() {
    print_header "I3M Platform Service Status:"
    echo ""
    docker compose ps
    echo ""
    
    # Show running containers
    print_info "Running containers:"
    docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep i3m
}

# Show logs
show_logs() {
    print_header "Showing logs for all services..."
    docker compose logs -f
}

# Build all services
build_all() {
    print_header "Building all I3M services..."
    docker compose build --parallel
    print_info "All services built ✓"
}

# Clean up Docker resources
clean_up() {
    print_header "Cleaning up Docker resources..."
    
    # Stop all services first
    docker compose down
    
    # Remove unused containers
    docker container prune -f
    
    # Remove unused images
    docker image prune -f
    
    # Remove unused volumes
    docker volume prune -f
    
    # Remove unused networks
    docker network prune -f
    
    print_info "Docker cleanup completed ✓"
}

# Check service health
check_health() {
    print_header "Checking service health..."
    
    # Core services
    services=(
        "api-gateway:3004"
        "auth-service:3008" 
        "user-service:3009"
        "finance-service:3028"
        "crm-service:3015"
        "analytics-service:3019"
        "ai-service:3017"
        "content-service:3021"
        "workflow-service:3071"
        "notification-service:3070"
        "load-balancer-service:3043"
    )
    
    for service in "${services[@]}"; do
        name=$(echo $service | cut -d: -f1)
        port=$(echo $service | cut -d: -f2)
        
        if curl -s http://localhost:$port/health > /dev/null 2>&1; then
            print_info "$name (port $port) is healthy ✓"
        else
            print_warn "$name (port $port) is not responding"
        fi
    done
}

# Start core services only
start_core() {
    print_header "Starting core services..."
    docker compose up -d postgres redis mongodb
    sleep 5
    docker compose up -d api-gateway auth-service user-service
    print_info "Core services started ✓"
}

# Start ERP services
start_erp() {
    print_header "Starting ERP services..."
    docker compose up -d finance-service crm-service
    print_info "ERP services started ✓"
}

# Start analytics services
start_analytics() {
    print_header "Starting analytics services..."
    docker compose up -d analytics-service ai-service
    print_info "Analytics services started ✓"
}

# Main function
main() {
    case "${1:-help}" in
        start)
            start_all
            ;;
        stop)
            stop_all
            ;;
        restart)
            restart_all
            ;;
        status)
            show_status
            ;;
        logs)
            show_logs
            ;;
        build)
            build_all
            ;;
        clean)
            clean_up
            ;;
        health)
            check_health
            ;;
        core)
            start_core
            ;;
        erp)
            start_erp
            ;;
        analytics)
            start_analytics
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            print_error "Unknown command: $1"
            show_help
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"
