#!/bin/bash

# Remove Docker Desktop and Install Docker Engine
# Loại bỏ Docker Desktop và cài đặt Docker Engine thuần túy

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

print_header "Removing Docker Desktop and Installing Docker Engine"
echo "============================================================="

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   print_error "This script should not be run as root"
   exit 1
fi

# Stop all I3M services first
print_header "Stopping I3M services..."
docker compose down
print_info "I3M services stopped ✓"

# Remove Docker Desktop containers and images
print_header "Removing Docker Desktop components..."
docker stop $(docker ps -aq --filter "name=desktop-") 2>/dev/null || true
docker stop $(docker ps -aq --filter "name=kind-") 2>/dev/null || true
docker rm $(docker ps -aq --filter "name=desktop-") 2>/dev/null || true
docker rm $(docker ps -aq --filter "name=kind-") 2>/dev/null || true

# Remove Docker Desktop images
docker images | grep -E "(desktop|kind)" | awk '{print $3}' | xargs docker rmi -f 2>/dev/null || true

print_info "Docker Desktop components removed ✓"

# Clean up Docker system
print_header "Cleaning up Docker system..."
docker system prune -f
docker volume prune -f
docker network prune -f

print_info "Docker system cleaned ✓"

# Check if Docker Desktop is installed
print_header "Checking Docker Desktop installation..."
if command -v docker &> /dev/null; then
    if docker --version | grep -q "desktop"; then
        print_warn "Docker Desktop detected. Please uninstall it manually:"
        echo "1. Open Docker Desktop application"
        echo "2. Go to Settings > General"
        echo "3. Click 'Uninstall Docker Desktop'"
        echo ""
        print_warn "Or run: sudo apt remove docker-desktop"
    else
        print_info "Docker Engine detected (not Desktop) ✓"
    fi
else
    print_error "Docker not found. Please install Docker Engine first."
    exit 1
fi

# Install Docker Engine (if not already installed)
print_header "Installing Docker Engine..."
if ! command -v docker &> /dev/null; then
    print_info "Installing Docker Engine..."
    
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
else
    print_info "Docker Engine already installed ✓"
fi

# Install Docker Compose (standalone)
print_header "Installing Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    print_info "Installing Docker Compose standalone..."
    
    # Get latest version
    COMPOSE_VERSION=$(curl -s https://api.github.com/repos/docker/compose/releases/latest | grep 'tag_name' | cut -d\" -f4)
    
    # Download and install
    sudo curl -L "https://github.com/docker/compose/releases/download/${COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    
    print_info "Docker Compose installed ✓"
else
    print_info "Docker Compose already installed ✓"
fi

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

print_info "Docker Desktop removal and Docker Engine installation completed! 🎉"
print_info "You may need to log out and log back in for group changes to take effect."
print_info "Or run: newgrp docker"
