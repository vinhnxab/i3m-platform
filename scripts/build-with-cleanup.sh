#!/bin/bash

# Build Script with Auto Cleanup
# Tự động dọn dẹp trước khi build và sau khi build

SERVICE_NAME=$1
SERVICE_PATH=$2

if [ -z "$SERVICE_NAME" ] || [ -z "$SERVICE_PATH" ]; then
    echo "❌ Usage: $0 <service-name> <service-path>"
    echo "Example: $0 commerce-service erp-services/commerce-service"
    exit 1
fi

echo "🚀 Building $SERVICE_NAME with auto cleanup..."

# 1. Pre-build cleanup (chỉ xóa images cũ)
echo "🧹 Pre-build cleanup..."
./scripts/image-cleanup.sh

# 2. Build với no-cache và remove intermediate containers
echo "🔨 Building $SERVICE_NAME..."
cd "$SERVICE_PATH"

# Build với các tùy chọn tối ưu
docker build \
    --no-cache \
    --rm \
    --tag "$SERVICE_NAME:latest" \
    --tag "$SERVICE_NAME:$(date +%Y%m%d-%H%M%S)" \
    .

BUILD_EXIT_CODE=$?

if [ $BUILD_EXIT_CODE -eq 0 ]; then
    echo "✅ Build successful!"
    
    # 3. Post-build cleanup (chỉ xóa images cũ)
    echo "🧹 Post-build cleanup..."
    cd /home/vinhnx/i3m-platform
    ./scripts/image-cleanup.sh
    
    # 4. Load image vào Kind cluster nếu cần
    echo "📦 Loading image into Kind cluster..."
    kind load docker-image "$SERVICE_NAME:latest" --name i3m-platform
    
    echo "🎉 Build and cleanup completed successfully!"
else
    echo "❌ Build failed with exit code $BUILD_EXIT_CODE"
    exit $BUILD_EXIT_CODE
fi
