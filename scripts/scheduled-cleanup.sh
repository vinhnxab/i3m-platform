#!/bin/bash

# Scheduled Cleanup Script
# Chạy định kỳ để dọn dẹp Docker resources

echo "🕐 Scheduled Docker cleanup started at $(date)"

# 1. Xóa images cũ hơn 7 ngày (trừ latest và production tags)
echo "🗑️ Removing images older than 7 days..."
docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.CreatedAt}}" | \
grep -v "REPOSITORY" | \
awk '$3 != "latest" && $3 != "production" {print $1":"$2}' | \
xargs -r docker rmi -f 2>/dev/null || true

# 2. Xóa containers đã dừng hơn 7 ngày (giữ lại containers gần đây)
echo "📦 Removing stopped containers older than 7 days..."
docker container ls -a --filter "status=exited" --format "table {{.ID}}\t{{.Status}}\t{{.Names}}" | \
grep -v "CONTAINER" | \
awk '$2 ~ /Exited \([0-9]+\) [0-9]+ days ago/ {print $1}' | \
xargs -r docker rm 2>/dev/null || true

# 3. Xóa volumes không sử dụng
echo "💾 Removing unused volumes..."
docker volume prune -f

# 4. Xóa networks không sử dụng
echo "🌐 Removing unused networks..."
docker network prune -f

# 5. Xóa build cache cũ
echo "🔨 Removing old build cache..."
docker builder prune -f

# 6. Dọn dẹp system (chỉ xóa dangling resources)
echo "🧹 System cleanup..."
docker system prune -f

# 7. Hiển thị thống kê
echo "📊 Docker system status:"
docker system df

# 8. Ghi log
echo "$(date): Docker cleanup completed" >> /home/vinhnx/i3m-platform/logs/cleanup.log

echo "✅ Scheduled cleanup completed at $(date)"
