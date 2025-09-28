#!/bin/bash

# Complete Docker Desktop Removal and Docker Engine Installation
# Loại bỏ hoàn toàn Docker Desktop và cài đặt Docker Engine thuần túy

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
print_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
print_error() { echo -e "${RED}[ERROR]${NC} $1"; }
print_header() { echo -e "${BLUE}[HEADER]${NC} $1"; }

print_header "Complete Docker Desktop Removal and Docker Engine Installation"
echo "====================================================================="

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

# Stop Docker service
print_header "Stopping Docker service..."
sudo systemctl stop docker
print_info "Docker service stopped ✓"

# Remove Docker Desktop packages
print_header "Removing Docker Desktop packages..."
sudo apt-get remove -y docker-desktop 2>/dev/null || true
sudo apt-get remove -y docker-desktop-data 2>/dev/null || true
sudo apt-get autoremove -y
print_info "Docker Desktop packages removed ✓"

# Remove Docker Desktop directories
print_header "Removing Docker Desktop directories..."
sudo rm -rf ~/.docker/desktop 2>/dev/null || true
sudo rm -rf ~/Library/Application\ Support/Docker\ Desktop 2>/dev/null || true
sudo rm -rf ~/Library/Group\ Containers/group.com.docker 2>/dev/null || true
sudo rm -rf ~/Library/HTTPStorages/com.docker.docker 2>/dev/null || true
sudo rm -rf ~/Library/Logs/Docker\ Desktop 2>/dev/null || true
sudo rm -rf ~/Library/Preferences/com.docker.docker.plist 2>/dev/null || true
sudo rm -rf ~/Library/Saved\ Application\ State/com.electron.docker-frontend.savedState 2>/dev/null || true
sudo rm -rf ~/Library/Containers/com.docker.docker 2>/dev/null || true
print_info "Docker Desktop directories removed ✓"

# Remove Docker Desktop from applications
print_header "Removing Docker Desktop from applications..."
sudo rm -rf /Applications/Docker.app 2>/dev/null || true
sudo rm -rf /usr/local/bin/docker-compose 2>/dev/null || true
print_info "Docker Desktop applications removed ✓"

# Remove Docker Desktop from PATH
print_header "Cleaning up PATH..."
sed -i '/Docker Desktop/d' ~/.bashrc 2>/dev/null || true
sed -i '/Docker Desktop/d' ~/.zshrc 2>/dev/null || true
sed -i '/Docker Desktop/d' ~/.profile 2>/dev/null || true
print_info "PATH cleaned ✓"

# Install Docker Engine
print_header "Installing Docker Engine..."
# Update package index
sudo apt-get update

# Install required packages
sudo apt-get install -y \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

# Add Docker's official GPG key
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Set up the repository
echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
    $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Add user to docker group
sudo usermod -aG docker $USER

print_info "Docker Engine installed ✓"

# Install Docker Compose standalone
print_header "Installing Docker Compose standalone..."
COMPOSE_VERSION=$(curl -s https://api.github.com/repos/docker/compose/releases/latest | grep 'tag_name' | cut -d\" -f4)
sudo curl -L "https://github.com/docker/compose/releases/download/${COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

print_info "Docker Compose standalone installed ✓"

# Configure Docker daemon
print_header "Configuring Docker daemon..."
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json > /dev/null <<EOF
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  },
  "storage-driver": "overlay2",
  "live-restore": true,
  "userland-proxy": false,
  "experimental": false,
  "metrics-addr": "127.0.0.1:9323",
  "default-address-pools": [
    {
      "base": "172.17.0.0/12",
      "size": 24
    }
  ]
}
EOF

print_info "Docker daemon configured ✓"

# Start Docker service
print_header "Starting Docker service..."
sudo systemctl enable docker
sudo systemctl start docker
sudo systemctl status docker --no-pager

print_info "Docker service started ✓"

# Verify installation
print_header "Verifying installation..."
docker --version
docker compose version
docker info | grep -E "(Server Version|Storage Driver|Docker Root Dir)"

print_info "Installation verified ✓"

# Restart I3M services
print_header "Restarting I3M services..."
docker compose up -d

print_info "I3M services restarted ✓"

# Show final status
print_header "Final Status:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep i3m

print_info "Docker Desktop completely removed and Docker Engine installed! 🎉"
print_warn "You may need to log out and log back in for group changes to take effect."
print_warn "Or run: newgrp docker"
