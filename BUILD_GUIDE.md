# I3M Platform - Build Guide

## 🚀 **Tự động dọn dẹp build cũ khi build mới**

### 📋 **Tổng quan**

Hệ thống đã được cấu hình để tự động dọn dẹp build cũ khi build mới, tránh đầy ổ cứng. Có 3 cách chính để build:

1. **Build tất cả services** với auto cleanup
2. **Build service cụ thể** với auto cleanup  
3. **Build thủ công** với các tùy chọn cleanup

---

## 🛠️ **Cách sử dụng**

### **1. Build tất cả services**

```bash
# Build tất cả với auto cleanup
make build

# Build tất cả với full cleanup (xóa cả build cache)
make build-all

# Build chỉ core services
make build-core
```

### **2. Build service cụ thể**

```bash
# Build auth-service với auto cleanup
make build-service SERVICE=auth-service

# Build api-gateway với auto cleanup
make build-service SERVICE=api-gateway

# Build user-service với auto cleanup
make build-service SERVICE=user-service
```

### **3. Scripts trực tiếp**

```bash
# Build service cụ thể
./scripts/build-service.sh auth-service --no-cache --pull

# Build tất cả services
./scripts/build-all.sh --no-cache --pull

# Cleanup toàn bộ
./scripts/clean-build.sh clean-all
```

---

## 🧹 **Cleanup Commands**

### **Cleanup cơ bản**
```bash
# Dọn dẹp containers, networks, volumes
make clean

# Dọn dẹp toàn bộ (cả build cache)
make clean-all

# Dọn dẹp service cụ thể
make clean-service SERVICE=auth-service
```

### **Scripts cleanup**
```bash
# Cleanup cơ bản
./scripts/clean-build.sh clean

# Cleanup toàn bộ
./scripts/clean-build.sh clean-all

# Xem disk usage
./scripts/clean-build.sh status
```

---

## 📊 **Monitoring Commands**

### **Xem trạng thái services**
```bash
# Trạng thái tất cả services
make status

# Logs tất cả services
make logs

# Logs service cụ thể
make logs-service SERVICE=auth-service

# Disk usage
make disk-usage
```

### **Health check**
```bash
# Kiểm tra health của services
make health
```

---

## 🔧 **Service Management**

### **Start/Stop services**
```bash
# Start tất cả services
make start

# Start chỉ core services
make start-core

# Stop tất cả services
make stop

# Restart tất cả services
make restart
```

### **Development**
```bash
# Start development environment (chỉ databases)
make dev

# Start frontend development
make frontend-dev

# Build frontend
make frontend-build
```

---

## 🗂️ **Available Services**

### **Core Services**
- `auth-service` - Authentication service
- `api-gateway` - API Gateway
- `user-service` - User management service

### **Content Services**
- `content-service` - Content management
- `media-service` - Media handling
- `metadata-service` - Metadata management

### **Analytics Services**
- `analytics-service` - Analytics processing
- `ai-service` - AI/ML services
- `ml-pipeline-service` - ML pipeline
- `user-analytics-service` - User analytics

### **ERP Services**
- `crm-service` - Customer relationship management
- `ecommerce-service` - E-commerce
- `finance-service` - Financial management
- `hrm-service` - Human resource management
- `inventory-service` - Inventory management
- `procurement-service` - Procurement

### **Industry Services**
- `agriculture-service` - Agriculture
- `healthcare-service` - Healthcare

### **Infrastructure Services**
- `cost-optimization-service` - Cost optimization
- `load-balancer-service` - Load balancing
- `observability-service` - Monitoring
- `secrets-management-service` - Secrets management
- `security-service` - Security

### **Integration Services**
- `api-documentation-service` - API documentation
- `currency-exchange-service` - Currency exchange
- `integration-service` - Integration

### **Marketplace Services**
- `installation-service` - Installation
- `preview-service` - Preview
- `template-marketplace-service` - Template marketplace

### **Shared Services**
- `billing-service` - Billing
- `notification-service` - Notifications
- `workflow-service` - Workflow

---

## ⚡ **Quick Commands**

### **Quick build (core services only)**
```bash
make quick-build
```

### **Quick start (core services only)**
```bash
make quick-start
```

### **Database reset**
```bash
make db-reset
```

---

## 🔍 **Troubleshooting**

### **Xem disk usage**
```bash
make disk-usage
```

### **Xem logs của service cụ thể**
```bash
make logs-service SERVICE=auth-service
```

### **Health check**
```bash
make health
```

### **Restart service cụ thể**
```bash
make clean-service SERVICE=auth-service
make build-service SERVICE=auth-service
```

---

## 📝 **Best Practices**

### **1. Build thường xuyên**
- Sử dụng `make build` thay vì `docker-compose build`
- Scripts tự động dọn dẹp build cũ

### **2. Cleanup định kỳ**
- Chạy `make clean-all` hàng tuần
- Monitor disk usage với `make disk-usage`

### **3. Development**
- Sử dụng `make dev` để start databases
- Build service cụ thể khi cần: `make build-service SERVICE=auth-service`

### **4. Production**
- Sử dụng `make build-all` cho production builds
- Test với `make health` trước khi deploy

---

## 🎯 **Examples**

### **Development workflow**
```bash
# 1. Start development environment
make dev

# 2. Build service bạn đang làm việc
make build-service SERVICE=auth-service

# 3. Check logs
make logs-service SERVICE=auth-service

# 4. Test
make health
```

### **Production deployment**
```bash
# 1. Clean up everything
make clean-all

# 2. Build all services
make build-all

# 3. Start all services
make start

# 4. Health check
make health
```

### **Troubleshooting**
```bash
# 1. Check disk usage
make disk-usage

# 2. Check service status
make status

# 3. Check logs
make logs

# 4. Restart problematic service
make clean-service SERVICE=auth-service
make build-service SERVICE=auth-service
```

---

## ✅ **Kết luận**

Hệ thống build đã được cấu hình để:
- ✅ **Tự động dọn dẹp** build cũ khi build mới
- ✅ **Tiết kiệm disk space** với auto cleanup
- ✅ **Dễ sử dụng** với Makefile commands
- ✅ **Linh hoạt** với scripts tùy chỉnh
- ✅ **Monitoring** disk usage và service status

**Bây giờ bạn có thể build mà không lo đầy ổ cứng!** 🎉
