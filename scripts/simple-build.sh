#!/bin/bash

# Simple Build Script
# Build đơn giản với auto cleanup images cũ

SERVICE_NAME=$1
SERVICE_PATH=$2

if [ -z "$SERVICE_NAME" ] || [ -z "$SERVICE_PATH" ]; then
    echo "❌ Usage: $0 <service-name> <service-path>"
    echo "Example: $0 commerce-service erp-services/commerce-service"
    exit 1
fi

echo "🚀 Building $SERVICE_NAME..."

# 1. Xóa images cũ trước khi build
echo "🧹 Cleaning old images..."
./scripts/image-cleanup.sh

# 2. Build với no-cache
echo "🔨 Building $SERVICE_NAME..."
cd "$SERVICE_PATH"

docker build \
    --no-cache \
    --rm \
    --tag "$SERVICE_NAME:latest" \
    .

BUILD_EXIT_CODE=$?

if [ $BUILD_EXIT_CODE -eq 0 ]; then
    echo "✅ Build successful!"
    
    # 3. Load vào Kind cluster
    echo "📦 Loading image into Kind cluster..."
    kind load docker-image "$SERVICE_NAME:latest" --name i3m-platform
    
    # 4. Xóa images cũ sau khi build
    echo "🧹 Cleaning up old images..."
    ./scripts/image-cleanup.sh
    
    echo "🎉 Build completed successfully!"
else
    echo "❌ Build failed with exit code $BUILD_EXIT_CODE"
    exit $BUILD_EXIT_CODE
fi
