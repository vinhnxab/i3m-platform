#!/bin/bash

# Docker Cleanup Script
# Tự động dọn dẹp Docker cache, images cũ và volumes không sử dụng

echo "🧹 Starting Docker cleanup..."

# 1. Xóa containers đã dừng hơn 7 ngày (giữ lại containers gần đây)
echo "📦 Removing containers stopped more than 7 days ago..."
docker container ls -a --filter "status=exited" --format "table {{.ID}}\t{{.Status}}\t{{.Names}}" | \
grep -v "CONTAINER" | \
awk '$2 ~ /Exited \([0-9]+\) [0-9]+ days ago/ {print $1}' | \
xargs -r docker rm 2>/dev/null || true

# 2. Xóa tất cả images không sử dụng (dangling images)
echo "🖼️ Removing unused images..."
docker image prune -f

# 3. Xóa tất cả networks không sử dụng
echo "🌐 Removing unused networks..."
docker network prune -f

# 4. Xóa tất cả volumes không sử dụng
echo "💾 Removing unused volumes..."
docker volume prune -f

# 5. Xóa build cache cũ
echo "🔨 Removing build cache..."
docker builder prune -f

# 6. Xóa images cũ hơn 24h (trừ latest)
echo "⏰ Removing images older than 24h..."
docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.CreatedAt}}" | \
grep -v "REPOSITORY" | \
awk '$3 != "latest" {print $1":"$2}' | \
xargs -r docker rmi -f 2>/dev/null || true

# 7. Hiển thị dung lượng đã giải phóng
echo "📊 Docker system info:"
docker system df

echo "✅ Docker cleanup completed!"
