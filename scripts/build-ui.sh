#!/bin/bash

# Build UI Dashboard for Kubernetes deployment
set -e

echo "🚀 Building UI Dashboard for Kubernetes..."

# Navigate to UI directory
cd /home/vinhnx/i3m-platform/ui/master-dashboard

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Build the application
echo "🔨 Building application..."
npm run build

# Build Docker image
echo "🐳 Building Docker image..."
docker build -t i3m-platform/ui-dashboard:latest .

# Tag for registry (if using external registry)
# docker tag i3m-platform/ui-dashboard:latest your-registry.com/i3m-platform/ui-dashboard:latest

echo "✅ UI Dashboard build completed successfully!"
echo "📋 Next steps:"
echo "1. Push image to registry: docker push i3m-platform/ui-dashboard:latest"
echo "2. Deploy to Kubernetes: kubectl apply -f /home/vinhnx/i3m-platform/deployments/k8s/"
