#!/bin/bash

# Install Docker Compose Standalone
# Cài đặt Docker Compose standalone

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
print_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
print_header() { echo -e "${BLUE}[HEADER]${NC} $1"; }

print_header "Installing Docker Compose Standalone"
echo "============================================="

# Get latest version
print_header "Getting latest Docker Compose version..."
COMPOSE_VERSION=$(curl -s https://api.github.com/repos/docker/compose/releases/latest | grep 'tag_name' | cut -d\" -f4)
print_info "Latest version: $COMPOSE_VERSION"

# Download Docker Compose
print_header "Downloading Docker Compose..."
curl -L "https://github.com/docker/compose/releases/download/${COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o ~/docker-compose
chmod +x ~/docker-compose

print_info "Docker Compose downloaded ✓"

# Add to PATH
print_header "Adding to PATH..."
echo 'export PATH="$HOME:$PATH"' >> ~/.bashrc
echo 'export PATH="$HOME:$PATH"' >> ~/.profile

print_info "Added to PATH ✓"

# Test installation
print_header "Testing installation..."
~/docker-compose --version

print_info "Docker Compose standalone installed successfully! ✓"
print_warn "Please run: source ~/.bashrc or restart your terminal"
