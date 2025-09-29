# 🚀 I3M Platform Startup Guide

## 📋 Tóm tắt hệ thống hiện tại

### **🏗️ Infrastructure**
- **Kubernetes Cluster**: i3m-platform (Kind cluster)
- **Namespace**: i3m-platform
- **Node**: i3m-platform-control-plane (172.19.0.2)

### **🐳 Docker Images**
```
i3m-platform/ui-dashboard-dev   latest   993MB   (Development UI)
i3m-platform/ui-dashboard       latest   62.7MB  (Production UI)
i3m-platform-auth-service       latest   31.5MB  (Auth Service)
i3m-platform-api-gateway        latest   30.1MB  (API Gateway)
```

### **🚀 Services đang chạy (36+ pods)**
- **Core Infrastructure**: postgres, redis, mongodb
- **Core Application**: api-gateway, auth-service, user-service
- **Business Services**: ai-service, analytics-service, billing-service, crm-service, ecommerce-service, finance-service, hrm-service, notification-service, workflow-service
- **Infrastructure**: load-balancer-service, security-service, observability-service, secrets-management-service, cost-optimization-service
- **Content**: content-service, media-service, metadata-service
- **Analytics & ML**: ml-pipeline-service, user-analytics-service
- **Integration**: api-documentation-service, currency-exchange-service, preview-service, installation-service
- **Industry-Specific**: agriculture-service, healthcare-service, procurement-service
- **Additional**: integration-service, inventory-service, template-marketplace-service
- **UI**: ui-dashboard, ui-dashboard-dev

## ⚡ Khởi động nhanh

### **Cách 1: Script tự động (Khuyến nghị)**
```bash
# Khởi động toàn bộ hệ thống
./scripts/quick-start.sh
```

### **Cách 2: Script chi tiết**
```bash
# Khởi động từng bước
./scripts/restart-system.sh
```

### **Cách 3: Development trực tiếp**
```bash
# Chỉ development UI
./scripts/dev.sh ui
```

## 🔧 Scripts có sẵn

### **System Management**
```bash
./scripts/quick-start.sh        # Khởi động toàn bộ hệ thống (36+ services)
./scripts/start-all-services.sh # Khởi động tất cả services có tổ chức
./scripts/restart-system.sh    # Khởi động chi tiết từng service
./scripts/dev.sh k8s-status    # Kiểm tra trạng thái
./scripts/dev.sh k8s-stop      # Dừng hệ thống
```

### **Development**
```bash
./scripts/dev.sh ui            # Start UI development
./scripts/dev.sh backend       # Start backend services
./scripts/dev.sh all           # Start everything
```

### **Deployment**
```bash
./scripts/build-ui.sh          # Build UI image
./scripts/deploy-ui.sh         # Deploy UI to Kubernetes
```

## 📱 Truy cập hệ thống

### **External Access**
- **Frontend Development**: http://localhost:5173
- **API Gateway**: http://localhost:3000
- **Frontend K8s**: http://dev.i3m.local (cần /etc/hosts)

### **Port Forward (nếu cần)**
```bash
# UI Development
kubectl port-forward svc/ui-dashboard-dev-service 5173:5173 -n i3m-platform

# API Gateway
kubectl port-forward svc/api-gateway-service 8080:3004 -n i3m-platform
```

## 🛠️ Troubleshooting

### **Vấn đề thường gặp**

#### **1. Kubernetes cluster không chạy**
```bash
# Check cluster status
kubectl cluster-info

# Start Kind cluster
kind create cluster --name i3m-platform

# Start Minikube
minikube start
```

#### **2. Services không start**
```bash
# Check pods status
kubectl get pods -n i3m-platform

# Check logs
kubectl logs -f deployment/api-gateway -n i3m-platform
```

#### **3. Port không accessible**
```bash
# Check services
kubectl get svc -n i3m-platform

# Port forward manually
kubectl port-forward svc/ui-dashboard-dev-service 5173:5173 -n i3m-platform
```

### **Debug Commands**
```bash
# Check system status
./scripts/dev.sh k8s-status

# View logs
./scripts/dev-ui.sh logs

# Check resources
kubectl top pods -n i3m-platform
kubectl describe quota -n i3m-platform
```

## 📊 System Status

### **Current Status (29/09/2025 17:50)**
- **Total Pods**: 36+ running
- **Core Infrastructure**: ✅ All running (postgres, redis, mongodb)
- **Core Application**: ✅ All running (api-gateway, auth-service, user-service)
- **Business Services**: ✅ All running (9 services)
- **Infrastructure Services**: ✅ All running (5 services)
- **Content Services**: ✅ All running (3 services)
- **Analytics & ML**: ✅ All running (2 services)
- **Integration Services**: ✅ All running (4 services)
- **Industry-Specific**: ✅ All running (3 services)
- **Additional Services**: ✅ All running (3 services)
- **UI Services**: ✅ All running (2 services)
- **UI Development**: ✅ Running on port 5173
- **API Gateway**: ✅ Running on port 3000

### **Resource Usage**
- **CPU**: 13.1 cores used / 16 cores limit
- **Memory**: 14.8GB used / 16GB limit
- **Pods**: 36+/50 pods used

## 🎯 Workflow khuyến nghị

### **Hàng ngày**
```bash
# 1. Start system
./scripts/quick-start.sh

# 2. Start development
./scripts/dev.sh ui

# 3. Access application
# http://localhost:5173
```

### **Khi có vấn đề**
```bash
# 1. Check status
./scripts/dev.sh k8s-status

# 2. Restart if needed
./scripts/restart-system.sh

# 3. Check logs
./scripts/dev-ui.sh logs
```

### **Khi tắt máy**
```bash
# 1. Stop development
Ctrl+C (nếu đang chạy ./scripts/dev.sh ui)

# 2. Stop Kubernetes (optional)
kubectl delete namespace i3m-platform
```

## 📚 Documentation

- **[QUICK_START.md](./docs/QUICK_START.md)** - Hướng dẫn bắt đầu nhanh
- **[DEVELOPMENT_AUTOMATION.md](./docs/DEVELOPMENT_AUTOMATION.md)** - Tự động hóa development
- **[SYSTEM_STATUS.md](./SYSTEM_STATUS.md)** - Trạng thái hệ thống chi tiết

## 🎉 Kết luận

Với hệ thống này, bạn có thể:

- ✅ **Khởi động nhanh**: Chỉ cần `./scripts/quick-start.sh`
- ✅ **Development tự động**: Không cần chạy `npm run dev`
- ✅ **Production ready**: Có thể deploy lên K8s
- ✅ **Easy management**: Scripts quản lý mọi thứ
- ✅ **Complete documentation**: Tài liệu đầy đủ

**Bắt đầu ngay**: `./scripts/quick-start.sh` 🚀
