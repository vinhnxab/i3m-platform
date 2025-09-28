#!/bin/bash

# Clean Docker Desktop Components
# Loại bỏ các thành phần Docker Desktop

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
print_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
print_header() { echo -e "${BLUE}[HEADER]${NC} $1"; }

print_header "Cleaning Docker Desktop Components"
echo "=========================================="

# Stop I3M services first
print_header "Stopping I3M services..."
docker compose down
print_info "I3M services stopped ✓"

# Remove Docker Desktop containers
print_header "Removing Docker Desktop containers..."
docker stop $(docker ps -aq --filter "name=desktop-") 2>/dev/null || true
docker stop $(docker ps -aq --filter "name=kind-") 2>/dev/null || true
docker rm $(docker ps -aq --filter "name=desktop-") 2>/dev/null || true
docker rm $(docker ps -aq --filter "name=kind-") 2>/dev/null || true
print_info "Docker Desktop containers removed ✓"

# Remove Docker Desktop images
print_header "Removing Docker Desktop images..."
docker images | grep -E "(desktop|kind)" | awk '{print $3}' | xargs docker rmi -f 2>/dev/null || true
print_info "Docker Desktop images removed ✓"

# Clean up Docker system
print_header "Cleaning up Docker system..."
docker system prune -f
docker volume prune -f
docker network prune -f
print_info "Docker system cleaned ✓"

# Show current status
print_header "Current Docker Status:"
docker --version
docker compose version
docker system df

print_info "Docker Desktop components cleaned! ✓"
print_info "You can now use pure Docker CLI without Desktop overhead."
