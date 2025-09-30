# 🧹 Docker Auto Cleanup Scripts

Bộ script tự động dọn dẹp Docker cache và images cũ để tránh tăng dung lượng ổ cứng.

## 📁 Các Scripts

### 1. `image-cleanup.sh` ⭐ **KHUYẾN NGHỊ**
**Mục đích:** Xóa images cũ và containers cũ
```bash
./scripts/image-cleanup.sh
```
- Xóa containers đã dừng
- Xóa dangling images
- Xóa images cũ hơn 3 ngày (trừ latest)
- Xóa build cache

### 2. `simple-build.sh` ⭐ **KHUYẾN NGHỊ**
**Mục đích:** Build đơn giản với auto cleanup
```bash
./scripts/simple-build.sh commerce-service erp-services/commerce-service
```
- Xóa containers và images cũ trước build
- Build với `--no-cache`
- Load vào Kind cluster
- Xóa containers và images cũ sau build

### 3. `docker-cleanup.sh`
**Mục đích:** Dọn dẹp toàn bộ Docker resources
```bash
./scripts/docker-cleanup.sh
```
- Xóa containers đã dừng hơn 7 ngày
- Xóa images không sử dụng
- Xóa networks không sử dụng
- Xóa volumes không sử dụng
- Xóa build cache

### 2. `build-with-cleanup.sh`
**Mục đích:** Build service với auto cleanup
```bash
./scripts/build-with-cleanup.sh commerce-service erp-services/commerce-service
```
- Dọn dẹp trước khi build
- Build với `--no-cache` và `--rm`
- Dọn dẹp sau khi build
- Tự động load vào Kind cluster

### 3. `optimized-build.sh`
**Mục đích:** Build tối ưu theo loại service
```bash
# Java service
./scripts/optimized-build.sh commerce-service erp-services/commerce-service java

# Node.js service  
./scripts/optimized-build.sh cms-service erp-services/cms-service nodejs

# Go service
./scripts/optimized-build.sh api-gateway core-services/api-gateway go
```

### 4. `scheduled-cleanup.sh`
**Mục đích:** Dọn dẹp định kỳ (chạy bởi cron)
```bash
./scripts/scheduled-cleanup.sh
```

### 5. `safe-cleanup.sh`
**Mục đích:** Dọn dẹp an toàn - chỉ xóa resources thực sự không cần thiết
```bash
./scripts/safe-cleanup.sh
```
- Xóa containers đã dừng hơn 7 ngày
- Xóa images cũ hơn 14 ngày
- Hỏi trước khi xóa volumes
- Xóa build cache cũ

### 6. `container-manager.sh`
**Mục đích:** Quản lý containers thông minh
```bash
./scripts/container-manager.sh list
./scripts/container-manager.sh stop commerce-service
./scripts/container-manager.sh start commerce-service
./scripts/container-manager.sh cleanup-old
```

### 7. `setup-cron-cleanup.sh`
**Mục đích:** Thiết lập cron job tự động
```bash
./scripts/setup-cron-cleanup.sh
```

## 🚀 Cách sử dụng

### Build với auto cleanup:
```bash
# ⭐ KHUYẾN NGHỊ: Build đơn giản (xóa containers và images cũ)
./scripts/simple-build.sh commerce-service erp-services/commerce-service

# Build với cleanup toàn bộ
./scripts/build-with-cleanup.sh commerce-service erp-services/commerce-service

# Build tối ưu theo loại service
./scripts/optimized-build.sh commerce-service erp-services/commerce-service java
```

### Thiết lập auto cleanup hàng ngày:
```bash
# Chạy 1 lần để thiết lập cron job
./scripts/setup-cron-cleanup.sh
```

### Dọn dẹp thủ công:
```bash
# ⭐ KHUYẾN NGHỊ: Dọn dẹp containers và images cũ
./scripts/image-cleanup.sh

# Dọn dẹp toàn bộ (an toàn)
./scripts/safe-cleanup.sh

# Dọn dẹp mạnh mẽ
./scripts/docker-cleanup.sh

# Dọn dẹp định kỳ
./scripts/scheduled-cleanup.sh
```

### Quản lý containers:
```bash
# Xem tất cả containers
./scripts/container-manager.sh list

# Dừng container
./scripts/container-manager.sh stop commerce-service

# Khởi động container
./scripts/container-manager.sh start commerce-service

# Dọn dẹp containers cũ
./scripts/container-manager.sh cleanup-old
```

## ⚙️ Cấu hình

### `.dockerignore`
File này đã được tạo để tránh copy file không cần thiết vào Docker images:
- `node_modules/`
- `target/`
- `logs/`
- `*.log`
- IDE files
- Test files

### Cron Job
- **Thời gian:** Mỗi ngày lúc 2:00 AM
- **Log:** `/home/vinhnx/i3m-platform/logs/cleanup.log`
- **Xóa:** Images cũ hơn 7 ngày, containers đã dừng, volumes không sử dụng

## 📊 Lợi ích

1. **Tiết kiệm dung lượng:** Tự động xóa cache và images cũ
2. **Build sạch:** Luôn build với `--no-cache`
3. **Tự động hóa:** Cron job dọn dẹp hàng ngày
4. **Tối ưu:** Build theo loại service (Java, Node.js, Go)
5. **An toàn:** Chỉ xóa resources không sử dụng

## 🔧 Troubleshooting

### Xem cron jobs:
```bash
crontab -l
```

### Xóa cron job:
```bash
crontab -e
# Xóa dòng có scheduled-cleanup.sh
```

### Xem log cleanup:
```bash
tail -f /home/vinhnx/i3m-platform/logs/cleanup.log
```

### Kiểm tra dung lượng Docker:
```bash
docker system df
```
