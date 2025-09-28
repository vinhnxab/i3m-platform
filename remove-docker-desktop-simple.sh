#!/bin/bash

# Simple Docker Desktop Removal
# Loại bỏ Docker Desktop đơn giản

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
print_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
print_header() { echo -e "${BLUE}[HEADER]${NC} $1"; }

print_header "Removing Docker Desktop Components"
echo "=========================================="

# Stop all containers first
print_header "Stopping all containers..."
docker stop $(docker ps -aq) 2>/dev/null || true
print_info "All containers stopped ✓"

# Remove all containers
print_header "Removing all containers..."
docker rm $(docker ps -aq) 2>/dev/null || true
print_info "All containers removed ✓"

# Remove Docker Desktop images
print_header "Removing Docker Desktop images..."
docker images | grep -E "(desktop|kind)" | awk '{print $3}' | xargs docker rmi -f 2>/dev/null || true
print_info "Docker Desktop images removed ✓"

# Clean up Docker system
print_header "Cleaning up Docker system..."
docker system prune -af
docker volume prune -f
docker network prune -f
print_info "Docker system cleaned ✓"

# Remove Docker Desktop packages
print_header "Removing Docker Desktop packages..."
sudo apt-get remove -y docker-desktop 2>/dev/null || true
sudo apt-get remove -y docker-desktop-data 2>/dev/null || true
sudo apt-get autoremove -y
print_info "Docker Desktop packages removed ✓"

# Remove Docker Desktop directories
print_header "Removing Docker Desktop directories..."
rm -rf ~/.docker/desktop 2>/dev/null || true
rm -rf ~/Library/Application\ Support/Docker\ Desktop 2>/dev/null || true
rm -rf ~/Library/Group\ Containers/group.com.docker 2>/dev/null || true
rm -rf ~/Library/HTTPStorages/com.docker.docker 2>/dev/null || true
rm -rf ~/Library/Logs/Docker\ Desktop 2>/dev/null || true
rm -rf ~/Library/Preferences/com.docker.docker.plist 2>/dev/null || true
rm -rf ~/Library/Saved\ Application\ State/com.electron.docker-frontend.savedState 2>/dev/null || true
rm -rf ~/Library/Containers/com.docker.docker 2>/dev/null || true
print_info "Docker Desktop directories removed ✓"

# Remove Docker Desktop from applications
print_header "Removing Docker Desktop from applications..."
rm -rf /Applications/Docker.app 2>/dev/null || true
rm -rf /usr/local/bin/docker-compose 2>/dev/null || true
print_info "Docker Desktop applications removed ✓"

# Clean up PATH
print_header "Cleaning up PATH..."
sed -i '/Docker Desktop/d' ~/.bashrc 2>/dev/null || true
sed -i '/Docker Desktop/d' ~/.zshrc 2>/dev/null || true
sed -i '/Docker Desktop/d' ~/.profile 2>/dev/null || true
print_info "PATH cleaned ✓"

# Show current status
print_header "Current Docker Status:"
docker --version
docker compose version
docker system df

print_info "Docker Desktop components removed! ✓"
print_info "You can now use pure Docker CLI without Desktop overhead."
