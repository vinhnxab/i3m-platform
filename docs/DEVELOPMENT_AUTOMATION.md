# 🚀 Development Automation Guide

## Tổng quan

Tài liệu này mô tả hệ thống tự động hóa development environment cho I3M Platform, giúp developers không cần chạy `npm run dev` thủ công và có thể development trên cả local và Kubernetes.

## 🎯 Mục tiêu

- ✅ **Tự động hóa hoàn toàn**: Không cần chạy lệnh thủ công
- ✅ **Hot reload**: Tự động reload khi code thay đổi
- ✅ **Multi-environment**: Hỗ trợ cả local và Kubernetes
- ✅ **Easy management**: Scripts đơn giản để quản lý
- ✅ **Production-ready**: Có thể deploy lên K8s

## 📁 Cấu trúc Scripts

```
scripts/
├── dev.sh                    # Script chính quản lý development
├── dev-ui.sh                 # Quản lý UI trên Kubernetes
├── start-dev-ui.sh           # Chạy UI development server trực tiếp
├── setup-dev-ui.sh           # Setup Kubernetes environment
├── build-ui.sh               # Build UI cho production
└── deploy-ui.sh              # Deploy UI lên Kubernetes
```

## 🚀 Cách sử dụng

### **1. Development trực tiếp (Đơn giản nhất)**

```bash
# Start UI development server
./scripts/dev.sh ui

# Start backend services
./scripts/dev.sh backend

# Start cả frontend và backend
./scripts/dev.sh all
```

**Truy cập:**
- Frontend: http://localhost:5173
- API Gateway: http://localhost:8080
- Auth Service: http://localhost:3004

### **2. Development trên Kubernetes**

```bash
# Start UI trên Kubernetes
./scripts/dev.sh k8s-ui

# Check status
./scripts/dev.sh k8s-status

# Stop khi cần
./scripts/dev.sh k8s-stop
```

**Truy cập:**
- Port forward: `kubectl port-forward svc/ui-dashboard-dev-service 5173:5173 -n i3m-platform`
- Ingress: http://dev.i3m.local (cần thêm vào /etc/hosts)

## 🔧 Scripts chi tiết

### **`dev.sh` - Script chính**

```bash
# Các lệnh có sẵn
./scripts/dev.sh ui           # Start UI development
./scripts/dev.sh backend      # Start backend services
./scripts/dev.sh all          # Start everything
./scripts/dev.sh k8s-ui       # Start UI on Kubernetes
./scripts/dev.sh k8s-stop     # Stop Kubernetes UI
./scripts/dev.sh k8s-status   # Check Kubernetes status
./scripts/dev.sh help         # Show help
```

### **`dev-ui.sh` - Quản lý UI trên Kubernetes**

```bash
# Các lệnh có sẵn
./scripts/dev-ui.sh start     # Start development environment
./scripts/dev-ui.sh stop      # Stop development environment
./scripts/dev-ui.sh restart   # Restart development environment
./scripts/dev-ui.sh status    # Show environment status
./scripts/dev-ui.sh logs      # Show development logs
./scripts/dev-ui.sh port-forward # Port forward to localhost:5173
./scripts/dev-ui.sh shell     # Open shell in container
```

## 🏗️ Kiến trúc

### **Local Development**
```
┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │
│   (Vite)        │    │   (Go/Java)     │
│   Port: 5173    │    │   Port: 8080    │
└─────────────────┘    └─────────────────┘
         │                       │
         └───────────────────────┘
                API Calls
```

### **Kubernetes Development**
```
┌─────────────────┐    ┌─────────────────┐
│   UI Pod        │    │   Backend Pods  │
│   (Container)   │    │   (Containers)  │
│   Port: 5173    │    │   Port: 8080    │
└─────────────────┘    └─────────────────┘
         │                       │
         └───────────────────────┘
            Service Mesh
```

## 🔄 Workflow tự động

### **Khi bạn code:**

1. **Save file** → Vite tự động detect changes
2. **Hot reload** → Browser tự động refresh
3. **No manual intervention** → Không cần chạy lệnh gì

### **Khi muốn start development:**

```bash
# Chỉ cần 1 lệnh
./scripts/dev.sh ui
```

### **Khi muốn stop:**

```bash
# Stop direct development
Ctrl+C

# Stop Kubernetes development
./scripts/dev.sh k8s-stop
```

## 🐳 Docker & Kubernetes

### **Docker Images**

```dockerfile
# Development Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
```

### **Kubernetes Resources**

```yaml
# Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ui-dashboard-dev
spec:
  replicas: 1
  template:
    spec:
      containers:
      - name: ui-dashboard-dev
        image: i3m-platform/ui-dashboard-dev:latest
        ports:
        - containerPort: 5173
        env:
        - name: NODE_ENV
          value: "development"
        - name: VITE_API_BASE_URL
          value: "http://api-gateway-service:8080"
```

## 🛠️ Troubleshooting

### **Vấn đề thường gặp**

#### **1. Port 5173 không accessible**
```bash
# Kiểm tra process
ps aux | grep vite

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
# Check image
docker images | grep ui-dashboard

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

## 📋 Best Practices

### **1. Development Workflow**

```bash
# 1. Start development
./scripts/dev.sh ui

# 2. Code changes
# (Vite tự động reload)

# 3. Test changes
# (Browser tự động refresh)

# 4. Stop when done
Ctrl+C
```

### **2. Kubernetes Development**

```bash
# 1. Start Kubernetes environment
./scripts/dev.sh k8s-ui

# 2. Check status
./scripts/dev.sh k8s-status

# 3. Access via port forward
./scripts/dev-ui.sh port-forward

# 4. Stop when done
./scripts/dev.sh k8s-stop
```

### **3. Production Deployment**

```bash
# 1. Build production image
./scripts/build-ui.sh

# 2. Deploy to Kubernetes
./scripts/deploy-ui.sh
```

## 🎉 Kết luận

Hệ thống tự động hóa này giúp:

- ✅ **Tăng productivity**: Không cần nhớ lệnh phức tạp
- ✅ **Giảm errors**: Scripts đã test sẵn
- ✅ **Consistent environment**: Mọi người dùng cùng setup
- ✅ **Easy onboarding**: New developers chỉ cần chạy 1 lệnh
- ✅ **Production ready**: Có thể deploy lên K8s

**Tóm lại**: Chỉ cần chạy `./scripts/dev.sh ui` là có development environment hoàn chỉnh! 🚀

## 📞 Support

Nếu gặp vấn đề, hãy:

1. Check logs: `./scripts/dev-ui.sh logs`
2. Check status: `./scripts/dev.sh k8s-status`
3. Restart: `./scripts/dev.sh k8s-stop && ./scripts/dev.sh k8s-ui`
4. Contact team để được hỗ trợ
