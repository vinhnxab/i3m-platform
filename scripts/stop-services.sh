#!/bin/bash

# I3M Platform - Stop Services Script
# This script stops all running services

set -e

echo "🛑 Stopping I3M Platform Services..."

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

# Navigate to project root
cd "$(dirname "$0")/.."

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed."
    exit 1
fi

# Stop all services
print_status "Stopping all services..."
docker-compose down

# Optional: Remove volumes
read -p "Do you want to remove all data volumes? This will delete all data! (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_warning "Removing all volumes and data..."
    docker-compose down -v
    print_warning "All data has been removed!"
else
    print_status "Data volumes preserved"
fi

# Optional: Remove images
read -p "Do you want to remove built images? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_status "Removing built images..."
    docker-compose down --rmi local
    print_success "Images removed"
fi

# Clean up unused Docker resources
read -p "Do you want to clean up unused Docker resources? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_status "Cleaning up unused Docker resources..."
    docker system prune -f
    print_success "Docker cleanup completed"
fi

print_success "All services stopped successfully! 🎉"
