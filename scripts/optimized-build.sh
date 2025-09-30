#!/bin/bash

# Optimized Build Script
# Build với multi-stage và tối ưu hóa dung lượng

SERVICE_NAME=$1
SERVICE_PATH=$2
SERVICE_TYPE=${3:-"java"}  # java, nodejs, go

if [ -z "$SERVICE_NAME" ] || [ -z "$SERVICE_PATH" ]; then
    echo "❌ Usage: $0 <service-name> <service-path> [service-type]"
    echo "Example: $0 commerce-service erp-services/commerce-service java"
    echo "Service types: java, nodejs, go"
    exit 1
fi

echo "🚀 Building $SERVICE_NAME ($SERVICE_TYPE) with optimizations..."

# 1. Pre-build cleanup (chỉ xóa images cũ)
echo "🧹 Pre-build cleanup..."
./scripts/image-cleanup.sh

# 2. Build với tùy chọn tối ưu theo loại service
cd "$SERVICE_PATH"

case $SERVICE_TYPE in
    "java")
        echo "☕ Building Java service with Maven optimizations..."
        docker build \
            --no-cache \
            --rm \
            --build-arg BUILDKIT_INLINE_CACHE=1 \
            --tag "$SERVICE_NAME:latest" \
            --tag "$SERVICE_NAME:$(date +%Y%m%d-%H%M%S)" \
            .
        ;;
    "nodejs")
        echo "📦 Building Node.js service with npm optimizations..."
        docker build \
            --no-cache \
            --rm \
            --build-arg NODE_ENV=production \
            --build-arg BUILDKIT_INLINE_CACHE=1 \
            --tag "$SERVICE_NAME:latest" \
            --tag "$SERVICE_NAME:$(date +%Y%m%d-%H%M%S)" \
            .
        ;;
    "go")
        echo "🐹 Building Go service with CGO optimizations..."
        docker build \
            --no-cache \
            --rm \
            --build-arg CGO_ENABLED=0 \
            --build-arg BUILDKIT_INLINE_CACHE=1 \
            --tag "$SERVICE_NAME:latest" \
            --tag "$SERVICE_NAME:$(date +%Y%m%d-%H%M%S)" \
            .
        ;;
    *)
        echo "❌ Unknown service type: $SERVICE_TYPE"
        exit 1
        ;;
esac

BUILD_EXIT_CODE=$?

if [ $BUILD_EXIT_CODE -eq 0 ]; then
    echo "✅ Build successful!"
    
    # 3. Post-build cleanup (chỉ xóa images cũ)
    echo "🧹 Post-build cleanup..."
    cd /home/vinhnx/i3m-platform
    ./scripts/image-cleanup.sh
    
    # 4. Load image vào Kind cluster
    echo "📦 Loading image into Kind cluster..."
    kind load docker-image "$SERVICE_NAME:latest" --name i3m-platform
    
    # 5. Hiển thị thông tin image
    echo "📊 Image information:"
    docker images "$SERVICE_NAME" --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}\t{{.CreatedAt}}"
    
    echo "🎉 Optimized build completed successfully!"
else
    echo "❌ Build failed with exit code $BUILD_EXIT_CODE"
    exit $BUILD_EXIT_CODE
fi
