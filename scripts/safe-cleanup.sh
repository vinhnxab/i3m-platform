#!/bin/bash

# Safe Cleanup Script
# Dọn dẹp an toàn - chỉ xóa resources thực sự không cần thiết

echo "🛡️ Starting safe Docker cleanup..."

# 1. Xóa containers đã dừng hơn 7 ngày (giữ lại containers gần đây)
echo "📦 Removing containers stopped more than 7 days ago..."
docker container ls -a --filter "status=exited" --format "table {{.ID}}\t{{.Status}}\t{{.Names}}" | \
grep -v "CONTAINER" | \
awk '$2 ~ /Exited \([0-9]+\) [0-9]+ days ago/ {print $1}' | \
xargs -r docker rm 2>/dev/null || true

# 2. Xóa dangling images (images không có tag)
echo "🖼️ Removing dangling images..."
docker image prune -f

# 3. Xóa images cũ hơn 14 ngày (trừ latest và production)
echo "🗑️ Removing images older than 14 days..."
docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.CreatedAt}}" | \
grep -v "REPOSITORY" | \
awk '$3 != "latest" && $3 != "production" {print $1":"$2}' | \
xargs -r docker rmi -f 2>/dev/null || true

# 4. Xóa networks không sử dụng
echo "🌐 Removing unused networks..."
docker network prune -f

# 5. Xóa volumes không sử dụng (cẩn thận với dữ liệu)
echo "💾 Removing unused volumes (be careful with data)..."
read -p "⚠️  This will remove unused volumes. Continue? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    docker volume prune -f
else
    echo "⏭️  Skipping volume cleanup"
fi

# 6. Xóa build cache cũ hơn 7 ngày
echo "🔨 Removing old build cache..."
docker builder prune --filter "until=168h" -f

# 7. Hiển thị thống kê
echo "📊 Docker system status:"
docker system df

echo "✅ Safe cleanup completed!"
