#!/bin/bash

# Script to rebuild and redeploy a service with clean build
# Usage: ./rebuild-service.sh <service-name> [namespace]

SERVICE_NAME=$1
NAMESPACE=${2:-i3m-platform}
IMAGE_NAME="i3m-platform-${SERVICE_NAME}:latest"

if [ -z "$SERVICE_NAME" ]; then
    echo "Usage: $0 <service-name> [namespace]"
    echo "Example: $0 auth-service i3m-platform"
    exit 1
fi

SERVICE_PATH="/home/vinhnx/i3m-platform/core-services/${SERVICE_NAME}"

if [ ! -d "$SERVICE_PATH" ]; then
    echo "Error: Service directory not found: $SERVICE_PATH"
    exit 1
fi

echo "🔄 Starting clean rebuild for service: $SERVICE_NAME"

# Step 1: Stop port forwarding
echo "📡 Stopping existing port forwarding..."
pkill -f "kubectl port-forward.*${SERVICE_NAME}" || true

# Step 2: Remove old Docker image
echo "🗑️  Removing old Docker image..."
docker rmi "$IMAGE_NAME" 2>/dev/null || true

# Step 3: Clean Docker build cache (optional)
echo "🧹 Cleaning Docker build cache..."
docker builder prune -f

# Step 4: Build new image with no cache
echo "🏗️  Building new Docker image..."
cd "$SERVICE_PATH" || exit 1
docker build --no-cache -t "$IMAGE_NAME" .

if [ $? -ne 0 ]; then
    echo "❌ Docker build failed!"
    exit 1
fi

# Step 5: Restart Kubernetes deployment
echo "🚀 Restarting Kubernetes deployment..."
kubectl rollout restart "deployment/${SERVICE_NAME}" -n "$NAMESPACE"

if [ $? -ne 0 ]; then
    echo "❌ Kubernetes rollout failed!"
    exit 1
fi

# Step 6: Wait for deployment to be ready
echo "⏳ Waiting for deployment to be ready..."
kubectl rollout status "deployment/${SERVICE_NAME}" -n "$NAMESPACE" --timeout=300s

if [ $? -ne 0 ]; then
    echo "❌ Deployment rollout timeout!"
    exit 1
fi

# Step 7: Get service port
SERVICE_PORT=$(kubectl get svc "${SERVICE_NAME}" -n "$NAMESPACE" -o jsonpath='{.spec.ports[0].port}' 2>/dev/null)

if [ -n "$SERVICE_PORT" ]; then
    echo "🌐 Starting port forwarding on port $SERVICE_PORT..."
    kubectl port-forward -n "$NAMESPACE" "svc/${SERVICE_NAME}" "${SERVICE_PORT}:${SERVICE_PORT}" &
    
    # Wait a moment for port forwarding to establish
    sleep 3
    
    # Test health endpoint if available
    if curl -s "http://localhost:${SERVICE_PORT}/health" >/dev/null 2>&1; then
        echo "✅ Service is healthy and accessible at http://localhost:${SERVICE_PORT}"
    else
        echo "⚠️  Service deployed but health check failed"
    fi
else
    echo "⚠️  Could not determine service port"
fi

echo "✅ Clean rebuild completed for $SERVICE_NAME"
echo "📊 Deployment info:"
kubectl get pods -n "$NAMESPACE" | grep "$SERVICE_NAME"
