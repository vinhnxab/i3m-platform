# 📚 I3M Platform Documentation

## 🎯 Tổng quan

I3M Platform là một hệ thống microservices hoàn chỉnh với frontend React/TypeScript và backend Go/Java, được thiết kế để chạy trên Kubernetes với khả năng tự động hóa development environment.

## 📖 Tài liệu chính

### **🚀 Development**
- [**Quick Start Guide**](./QUICK_START.md) - Bắt đầu development trong 30 giây
- [**Development Automation**](./DEVELOPMENT_AUTOMATION.md) - Hướng dẫn tự động hóa development

### **🏗️ Architecture**
- [**Backend Architecture**](./BACKEND_ARCHITECTURE.md) - Kiến trúc backend services
- [**Frontend Architecture**](./FRONTEND_ARCHITECTURE.md) - Kiến trúc frontend React
- [**Kubernetes Deployment**](./KUBERNETES_DEPLOYMENT.md) - Hướng dẫn deploy lên K8s

### **🔧 Configuration**
- [**Environment Setup**](./ENVIRONMENT_SETUP.md) - Cấu hình môi trường
- [**Database Schema**](./DATABASE_SCHEMA.md) - Schema cơ sở dữ liệu
- [**API Documentation**](./API_DOCUMENTATION.md) - Tài liệu API

## 🚀 Bắt đầu nhanh

### **1. Development trực tiếp**
```bash
# Start UI development server
./scripts/dev.sh ui

# Truy cập: http://localhost:5173
```

### **2. Development trên Kubernetes**
```bash
# Start UI trên Kubernetes
./scripts/dev.sh k8s-ui

# Port forward để truy cập
kubectl port-forward svc/ui-dashboard-dev-service 5173:5173 -n i3m-platform
```

## 🏗️ Kiến trúc hệ thống

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Gateway   │    │   Backend       │
│   (React)       │    │   (Go)          │    │   (Go/Java)     │
│   Port: 5173    │    │   Port: 8080    │    │   Port: 3004    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Kubernetes    │
                    │   (K8s)         │
                    └─────────────────┘
```

## 🔧 Scripts chính

| Script | Mô tả | Sử dụng |
|--------|-------|---------|
| `dev.sh` | Script chính quản lý development | `./scripts/dev.sh ui` |
| `dev-ui.sh` | Quản lý UI trên Kubernetes | `./scripts/dev-ui.sh start` |
| `build-ui.sh` | Build UI cho production | `./scripts/build-ui.sh` |
| `deploy-ui.sh` | Deploy UI lên Kubernetes | `./scripts/deploy-ui.sh` |

## 📱 Truy cập services

| Service | URL | Mô tả |
|---------|-----|-------|
| Frontend | http://localhost:5173 | React UI Dashboard |
| API Gateway | http://localhost:8080 | API Gateway |
| Auth Service | http://localhost:3004 | Authentication Service |
| Kubernetes UI | http://dev.i3m.local | UI trên Kubernetes |

## 🛠️ Troubleshooting

### **Vấn đề thường gặp**

#### **1. Port 5173 không accessible**
```bash
# Kill process cũ
pkill -f vite

# Start lại
./scripts/dev.sh ui
```

#### **2. Kubernetes quota exceeded**
```bash
# Check quota
kubectl describe quota -n i3m-platform

# Scale down services không cần thiết
kubectl scale deployment agriculture-service --replicas=0 -n i3m-platform
```

#### **3. Image pull failed**
```bash
# Rebuild image
./scripts/build-ui.sh
```

### **Debug commands**

```bash
# Check development status
./scripts/dev.sh k8s-status

# View logs
./scripts/dev-ui.sh logs

# Port forward for testing
./scripts/dev-ui.sh port-forward
```

## 🎯 Features chính

### **Frontend (React/TypeScript)**
- ✅ **Ant Design**: UI components chuyên nghiệp
- ✅ **Hot Reload**: Tự động reload khi code thay đổi
- ✅ **TypeScript**: Type safety
- ✅ **Redux**: State management
- ✅ **React Router**: Client-side routing

### **Backend (Go/Java)**
- ✅ **Microservices**: Kiến trúc microservices
- ✅ **JWT Authentication**: Token-based authentication
- ✅ **Redis**: Caching và session storage
- ✅ **PostgreSQL**: Database chính
- ✅ **API Gateway**: Centralized API management

### **DevOps (Kubernetes)**
- ✅ **Containerization**: Docker containers
- ✅ **Orchestration**: Kubernetes orchestration
- ✅ **Auto-scaling**: Tự động scale
- ✅ **Service Mesh**: Service discovery
- ✅ **Monitoring**: Prometheus + Grafana

## 🚀 Development Workflow

### **1. Setup môi trường**
```bash
# Clone repository
git clone <repository-url>
cd i3m-platform

# Start development
./scripts/dev.sh ui
```

### **2. Development**
```bash
# Code changes
# (Vite tự động reload)

# Test changes
# (Browser tự động refresh)
```

### **3. Deploy**
```bash
# Build production
./scripts/build-ui.sh

# Deploy to Kubernetes
./scripts/deploy-ui.sh
```

## 📞 Support

Nếu gặp vấn đề:

1. **Check logs**: `./scripts/dev-ui.sh logs`
2. **Check status**: `./scripts/dev.sh k8s-status`
3. **Restart**: `./scripts/dev.sh k8s-stop && ./scripts/dev.sh k8s-ui`
4. **Contact team** để được hỗ trợ

## 🎉 Kết luận

I3M Platform cung cấp:

- ✅ **Complete solution**: Frontend + Backend + DevOps
- ✅ **Automation**: Tự động hóa development
- ✅ **Scalability**: Có thể scale trên Kubernetes
- ✅ **Production ready**: Sẵn sàng cho production
- ✅ **Easy management**: Scripts đơn giản để quản lý

**Bắt đầu ngay**: `./scripts/dev.sh ui` 🚀
