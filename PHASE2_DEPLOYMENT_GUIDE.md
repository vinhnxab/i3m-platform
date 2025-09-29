# 🚀 Phase 2: Kubernetes Deployment Guide

## 📋 Overview

Phase 2 focuses on deploying the new Business Operating System (BOS) architecture to Kubernetes, including:
- **ERP Services**: Core business logic services
- **Industry Services**: Industry-specific applications
- **Updated API Gateway**: New routing structure
- **Ingress Configuration**: ERP and Industry service routing

---

## 🏗️ Architecture Components

### **✅ ERP Services (Core Business Logic)**
```
erp-services/
├── commerce-service/          # Business logic for all industries
├── cms-service/              # Content management for all channels
├── analytics-services/        # Business intelligence
├── hrm-service/              # Human resources
├── finance-service/           # Accounting
├── crm-service/              # Customer management
├── inventory-service/         # Inventory management
├── procurement-service/       # Procurement
└── integration-service/       # Integration
```

### **✅ Industry Services (Industry Applications)**
```
industry-services/
├── ecommerce-service/         # Headless multi-channel commerce
├── agriculture-service/       # Farm management
├── healthcare-service/        # Clinic + Telemedicine
├── retail-service/           # POS + Online + Mobile
├── restaurant-service/        # Dine-in + Delivery + Takeaway
└── manufacturing-service/     # B2B + B2C + Distributor
```

---

## 🚀 Deployment Steps

### **Step 1: Build Docker Images**

```bash
# Build all ERP and Industry service images
./scripts/build-erp-industry-images.sh
```

**Images Built:**
- `i3m-platform-commerce-service:latest`
- `i3m-platform-cms-service:latest`
- `i3m-platform-analytics-service:latest`
- `i3m-platform-ecommerce-service:latest`
- `i3m-platform-agriculture-service:latest`
- `i3m-platform-healthcare-service:latest`
- `i3m-platform-retail-service:latest`
- `i3m-platform-restaurant-service:latest`
- `i3m-platform-manufacturing-service:latest`

### **Step 2: Deploy Services to Kubernetes**

```bash
# Deploy ERP and Industry services
./scripts/deploy-erp-industry-services.sh
```

**Services Deployed:**
- **ERP Services**: Commerce, CMS, Analytics, HR, Finance, CRM, Inventory, Procurement
- **Industry Services**: Ecommerce, Agriculture, Healthcare, Retail, Restaurant, Manufacturing

### **Step 3: Update API Gateway**

```bash
# Update API Gateway with new routing
./scripts/update-api-gateway.sh
```

**New API Routes:**
- **ERP Services**: `/api/v1/erp/*`
- **Industry Services**: `/api/v1/industry/*`
- **Legacy Routes**: `/api/v1/content/*`, `/api/v1/ecommerce/*` (deprecated)

---

## 📊 API Endpoints

### **🏢 ERP Services (Core Business)**

| Service | Endpoint | Port | Description |
|---------|----------|------|-------------|
| Commerce | `/api/v1/erp/commerce/*` | 3014 | Business logic for all industries |
| CMS | `/api/v1/erp/cms/*` | 3021 | Content management for all channels |
| Analytics | `/api/v1/erp/analytics/*` | 3019 | Business intelligence |
| HR | `/api/v1/erp/hr/*` | 3029 | Human resources |
| Finance | `/api/v1/erp/finance/*` | 3016 | Accounting |
| CRM | `/api/v1/erp/crm/*` | 3015 | Customer management |
| Inventory | `/api/v1/erp/inventory/*` | 3030 | Inventory management |
| Procurement | `/api/v1/erp/procurement/*` | 3013 | Procurement |

### **🏭 Industry Services (Applications)**

| Service | Endpoint | Port | Description |
|---------|----------|------|-------------|
| Ecommerce | `/api/v1/industry/ecommerce/*` | 3014 | Headless multi-channel commerce |
| Agriculture | `/api/v1/industry/agriculture/*` | 3025 | Farm management |
| Healthcare | `/api/v1/industry/healthcare/*` | 3026 | Clinic + Telemedicine |
| Retail | `/api/v1/industry/retail/*` | 3027 | POS + Online + Mobile |
| Restaurant | `/api/v1/industry/restaurant/*` | 3028 | Dine-in + Delivery + Takeaway |
| Manufacturing | `/api/v1/industry/manufacturing/*` | 3031 | B2B + B2C + Distributor |

---

## 🔧 Configuration Files

### **📁 Kubernetes Manifests**

```
deployments/k8s/
├── deployments/
│   ├── erp-services-deployment.yaml      # ERP Services deployment
│   └── industry-services-deployment.yaml # Industry Services deployment
├── ingress/
│   └── erp-industry-ingress.yaml        # ERP and Industry routing
└── services/
    └── api-gateway.yaml                 # Updated API Gateway
```

### **📁 Deployment Scripts**

```
scripts/
├── build-erp-industry-images.sh         # Build Docker images
├── deploy-erp-industry-services.sh     # Deploy to Kubernetes
└── update-api-gateway.sh               # Update API Gateway
```

---

## 🧪 Testing

### **Health Checks**

```bash
# Test ERP Services
curl -s http://localhost:3004/api/v1/erp/commerce/health
curl -s http://localhost:3004/api/v1/erp/cms/health
curl -s http://localhost:3004/api/v1/erp/analytics/health

# Test Industry Services
curl -s http://localhost:3004/api/v1/industry/ecommerce/health
curl -s http://localhost:3004/api/v1/industry/agriculture/health
curl -s http://localhost:3004/api/v1/industry/healthcare/health

# Test Legacy Routes (Backward Compatibility)
curl -s http://localhost:3004/api/v1/content/health
curl -s http://localhost:3004/api/v1/ecommerce/health
```

### **Service Status**

```bash
# Check ERP Services
kubectl get pods,svc,ingress -l tier=erp -n i3m-platform

# Check Industry Services
kubectl get pods,svc,ingress -l tier=industry -n i3m-platform

# Check API Gateway
kubectl get pods,svc,ingress -l app=api-gateway -n i3m-platform
```

---

## 🚨 Troubleshooting

### **Common Issues**

1. **Image Pull Errors**
   ```bash
   # Check if images exist
   docker images | grep i3m-platform
   
   # Rebuild if needed
   ./scripts/build-erp-industry-images.sh
   ```

2. **Service Not Ready**
   ```bash
   # Check pod status
   kubectl get pods -n i3m-platform
   
   # Check logs
   kubectl logs -f deployment/commerce-service -n i3m-platform
   ```

3. **API Gateway Routing Issues**
   ```bash
   # Check API Gateway logs
   kubectl logs -f deployment/api-gateway -n i3m-platform
   
   # Test routing
   curl -v http://localhost:3004/api/v1/erp/commerce/health
   ```

---

## 📈 Monitoring

### **Service Health**

```bash
# Check all services
kubectl get pods -n i3m-platform

# Check specific service
kubectl describe pod <pod-name> -n i3m-platform

# Check logs
kubectl logs -f <pod-name> -n i3m-platform
```

### **API Gateway Metrics**

```bash
# Check API Gateway metrics
curl -s http://localhost:3004/metrics

# Check Prometheus targets
curl -s http://localhost:9090/api/v1/targets
```

---

## 🎯 Success Criteria

### **✅ Deployment Success**
- [ ] All ERP services deployed and healthy
- [ ] All Industry services deployed and healthy
- [ ] API Gateway updated with new routing
- [ ] Ingress configured for ERP and Industry services
- [ ] Health checks passing for all services
- [ ] Legacy routes working for backward compatibility

### **✅ Testing Success**
- [ ] ERP service endpoints responding
- [ ] Industry service endpoints responding
- [ ] API Gateway routing working correctly
- [ ] Legacy routes working for backward compatibility
- [ ] All services accessible through ingress

---

## 🚀 Next Steps

After successful Phase 2 deployment:

1. **Phase 3**: Testing & Validation
   - End-to-end testing
   - Performance testing
   - Security testing

2. **Phase 4**: Production Deployment
   - Production environment setup
   - Monitoring and alerting
   - Backup and disaster recovery

**Phase 2: Kubernetes Deployment - Complete! 🎉**
