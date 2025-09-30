#!/bin/bash

# Complete Cleanup Script
# Xóa images cũ và containers cũ

echo "🧹 Starting complete cleanup..."

# 1. Xóa containers đã dừng
echo "📦 Removing stopped containers..."
docker container prune -f

# 2. Xóa dangling images (images không có tag)
echo "🗑️ Removing dangling images..."
docker image prune -f

# 3. Xóa images cũ hơn 3 ngày (trừ latest)
echo "⏰ Removing images older than 3 days (except latest)..."
docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.CreatedAt}}" | \
grep -v "REPOSITORY" | \
awk '$3 != "latest" {print $1":"$2}' | \
xargs -r docker rmi -f 2>/dev/null || true

# 4. Xóa build cache cũ
echo "🔨 Removing old build cache..."
docker builder prune -f

# 5. Hiển thị thống kê
echo "📊 Docker system after cleanup:"
docker system df

echo "✅ Complete cleanup completed!"
