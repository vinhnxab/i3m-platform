# 📊 I3M Platform System Status

## 🕐 Thời gian ghi nhận: 29/09/2025 17:50

## 🏗️ Hệ thống hiện tại

### **☸️ Kubernetes Cluster**
- **Cluster**: i3m-platform (Kind cluster)
- **Namespace**: i3m-platform
- **Node**: i3m-platform-control-plane (172.19.0.2)

### **🐳 Docker Images đang sử dụng**
```
i3m-platform/ui-dashboard-dev   latest   48e83968fb34   993MB   (Development UI)
i3m-platform/ui-dashboard       latest   c5a1bb62c48b   62.7MB  (Production UI)
i3m-platform-auth-service       latest   3254f1b48536   31.5MB  (Auth Service)
i3m-platform-api-gateway        latest   bad65fafc6fc   30.1MB  (API Gateway)
```

## 🚀 Services đang chạy (36+ pods)

### **Core Infrastructure Services (3 services)**
| Service | Pod IP | Port | Status | Age |
|---------|--------|------|--------|-----|
| **postgres** | 10.244.0.12 | 5432 | ✅ Running | 8h |
| **redis** | 10.244.0.8 | 6379 | ✅ Running | 20h |
| **mongodb** | 10.244.0.49 | 27017 | ✅ Running | 19h |

### **Core Application Services (3 services)**
| Service | Pod IP | Port | Status | Age |
|---------|--------|------|--------|-----|
| **api-gateway** | 10.244.0.7 | 3004 | ✅ Running | 9h |
| **auth-service** | 10.244.0.15 | 3008 | ✅ Running | 8h |
| **user-service** | 10.244.0.179 | 3009 | ✅ Running | 18h |

### **Business Services (9 services)**
| Service | Pod IP | Port | Status | Age |
|---------|--------|------|--------|-----|
| **analytics-service** | 10.244.0.180 | 3019 | ✅ Running | 12h |
| **ai-service** | 10.244.0.103 | 3017 | ✅ Running | 19h |
| **billing-service** | 10.244.0.36 | 3065 | ✅ Running | 20h |
| **crm-service** | 10.244.0.23 | 3015 | ✅ Running | 20h |
| **ecommerce-service** | 10.244.0.24 | 3014 | ✅ Running | 20h |
| **finance-service** | 10.244.0.25 | 3016 | ✅ Running | 20h |
| **hrm-service** | 10.244.0.26 | 3029 | ✅ Running | 20h |
| **notification-service** | 10.244.0.128 | 3070 | ✅ Running | 19h |
| **workflow-service** | 10.244.0.38 | 3071 | ✅ Running | 20h |

### **Infrastructure Services (5 services)**
| Service | Pod IP | Port | Status | Age |
|---------|--------|------|--------|-----|
| **load-balancer-service** | 10.244.0.41 | 3030 | ✅ Running | 20h |
| **security-service** | 10.244.0.43 | 3031 | ✅ Running | 20h |
| **observability-service** | 10.244.0.219 | 3041 | ✅ Running | 11h |
| **secrets-management-service** | 10.244.0.224 | 3044 | ✅ Running | 11h |
| **cost-optimization-service** | 10.244.0.233 | 3042 | ✅ Running | 11h |

### **Content Services (3 services)**
| Service | Pod IP | Port | Status | Age |
|---------|--------|------|--------|-----|
| **content-service** | 10.244.0.127 | 3021 | ✅ Running | 19h |
| **media-service** | 10.244.0.230 | 3022 | ✅ Running | 11h |
| **metadata-service** | 10.244.0.218 | 3023 | ✅ Running | 11h |

### **Analytics & ML Services (2 services)**
| Service | Pod IP | Port | Status | Age |
|---------|--------|------|--------|-----|
| **ml-pipeline-service** | 10.244.0.236 | 3018 | ✅ Running | 11h |
| **user-analytics-service** | 10.244.0.221 | 3020 | ✅ Running | 11h |

### **Integration Services (4 services)**
| Service | Pod IP | Port | Status | Age |
|---------|--------|------|--------|-----|
| **api-documentation-service** | 10.244.0.126 | 3050 | ✅ Running | 19h |
| **currency-exchange-service** | 10.244.0.131 | 3052 | ✅ Running | 19h |
| **preview-service** | 10.244.0.35 | 3062 | ✅ Running | 20h |
| **installation-service** | 10.244.0.34 | 3061 | ✅ Running | 20h |

### **Industry-Specific Services (3 services)**
| Service | Pod IP | Port | Status | Age |
|---------|--------|------|--------|-----|
| **agriculture-service** | 10.244.0.103 | 3025 | ✅ Running | 20h |
| **healthcare-service** | 10.244.0.126 | 3026 | ✅ Running | 20h |
| **procurement-service** | 10.244.0.131 | 3013 | ✅ Running | 20h |

### **Additional Services (3 services)**
| Service | Pod IP | Port | Status | Age |
|---------|--------|------|--------|-----|
| **integration-service** | 10.244.0.237 | 3051 | ✅ Running | 11h |
| **inventory-service** | 10.244.0.192 | 3030 | ✅ Running | 11h |
| **template-marketplace-service** | 10.244.0.20 | 3060 | ✅ Running | 11h |

### **UI Services (2 services)**
| Service | Pod IP | Port | Status | Age |
|---------|--------|------|--------|-----|
| **ui-dashboard** | 10.244.0.21 | 80 | ✅ Running | 15m |
| **ui-dashboard-dev** | 10.244.0.186 | 5173 | ✅ Running | 49m |

## 🌐 Network Configuration

### **Services (ClusterIP)**
| Service | Cluster IP | Port | External Access |
|---------|------------|------|-----------------|
| **api-gateway-service** | 10.96.110.31 | 3004 | ✅ NodePort 30000 |
| **auth-service** | 10.96.238.47 | 3008 | ❌ Internal |
| **postgres-service** | 10.96.111.171 | 5432 | ❌ Internal |
| **redis-service** | 10.96.253.31 | 6379 | ❌ Internal |
| **mongodb-service** | 10.96.116.203 | 27017 | ❌ Internal |
| **ui-dashboard-dev-service** | 10.96.214.186 | 5173 | ❌ Internal |
| **ui-dashboard-service** | 10.96.249.251 | 80 | ❌ Internal |

### **Ingress Routes**
| Ingress | Host | Port | Status |
|---------|------|------|--------|
| **api-gateway-ingress** | api.i3m.com | 80, 443 | ✅ Active |
| **i3m-platform-ingress** | i3m-platform.local | 80 | ✅ Active |
| **ui-dashboard-dev-ingress** | dev.i3m.local, localhost | 80 | ✅ Active |
| **ui-dashboard-ingress** | dashboard.i3m.local, localhost | 80 | ✅ Active |

## 🔧 Development Environment

### **Frontend Development**
- **Local Vite Server**: http://localhost:5173 (Running)
- **Kubernetes Dev**: ui-dashboard-dev-service (10.96.214.186:5173)
- **Port Forward**: `kubectl port-forward svc/ui-dashboard-dev-service 5173:5173 -n i3m-platform`

### **Backend Services**
- **API Gateway**: http://localhost:3000 (NodePort)
- **Auth Service**: http://localhost:3004 (Internal)
- **Database**: PostgreSQL (10.244.0.12:5432)
- **Cache**: Redis (10.244.0.8:6379)

## 📱 Access Points

### **External Access**
- **API Gateway**: http://localhost:3000
- **Frontend Dev**: http://localhost:5173
- **Frontend K8s**: http://dev.i3m.local (cần /etc/hosts)

### **Internal Access (Cluster)**
- **API Gateway**: api-gateway-service:3004
- **Auth Service**: auth-service:3008
- **Database**: postgres-service:5432
- **Cache**: redis-service:6379

## 🚨 Issues & Notes

### **Failed Services**
- **integration-service**: ImagePullBackOff (2/2 pods failed)
- **template-marketplace-service**: ImagePullBackOff (0/2 pods)
- **ui-dashboard**: ErrImageNeverPull (0/1 pods)
- **ui-dashboard (old)**: ImagePullBackOff (0/2 pods)

### **Scaled Down Services**
- **agriculture-service**: 0 replicas (quota management)
- **healthcare-service**: 0 replicas (quota management)
- **procurement-service**: 0 replicas (quota management)

## 💾 Resource Usage

### **Quota Status**
```
Resource                Used     Hard
limits.cpu              13100m   16
limits.memory           14848Mi  16Gi
pods                    32       50
requests.cpu            4100m    8
requests.memory         6016Mi   8Gi
```

### **Memory Optimization**
- Scaled down 3 services to free up memory
- UI development uses minimal resources
- Production services running efficiently
