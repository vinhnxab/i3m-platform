# ⚡ Quick Start Guide

## 🚀 Bắt đầu development trong 30 giây

### **Cách 1: Development trực tiếp (Khuyến nghị)**

```bash
# 1. Start UI development server
./scripts/dev.sh ui

# 2. Mở browser: http://localhost:5173
# 3. Code thay đổi → Browser tự động refresh
```

### **Cách 2: Development trên Kubernetes**

```bash
# 1. Start UI trên Kubernetes
./scripts/dev.sh k8s-ui

# 2. Port forward để truy cập
kubectl port-forward svc/ui-dashboard-dev-service 5173:5173 -n i3m-platform

# 3. Mở browser: http://localhost:5173
```

## 🎯 Các lệnh cần nhớ

```bash
# Development
./scripts/dev.sh ui           # Start UI
./scripts/dev.sh backend      # Start backend
./scripts/dev.sh all          # Start everything

# Kubernetes
./scripts/dev.sh k8s-ui       # Start UI on K8s
./scripts/dev.sh k8s-stop     # Stop K8s UI
./scripts/dev.sh k8s-status   # Check status

# Help
./scripts/dev.sh help         # Show all commands
```

## 🔧 Troubleshooting nhanh

### **Port 5173 không accessible**
```bash
pkill -f vite
./scripts/dev.sh ui
```

### **Kubernetes quota exceeded**
```bash
kubectl scale deployment agriculture-service --replicas=0 -n i3m-platform
./scripts/dev.sh k8s-ui
```

### **Check logs**
```bash
./scripts/dev-ui.sh logs
```

## 📱 Truy cập

- **Frontend**: http://localhost:5173
- **API Gateway**: http://localhost:8080
- **Auth Service**: http://localhost:3004

## 💡 Tips

- ✅ **Hot reload**: Code thay đổi → Browser tự động refresh
- ✅ **No manual commands**: Không cần chạy `npm run dev`
- ✅ **Easy management**: Scripts quản lý mọi thứ
- ✅ **Production ready**: Có thể deploy lên K8s

**Tóm lại**: Chỉ cần `./scripts/dev.sh ui` là xong! 🎉
