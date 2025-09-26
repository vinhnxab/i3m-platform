# 🚀 I3M Platform - Getting Started

Chào mừng bạn đến với I3M Platform! Đây là hướng dẫn nhanh để bắt đầu với hệ thống microservices của chúng ta.

## 📋 Yêu Cầu Hệ Thống

### Phát triển (Development)
- **Docker** 20.10+ và **Docker Compose** 2.0+
- **Node.js** 20+ (cho API Gateway và một số services)
- **Go** 1.21+ (cho API Gateway và Auth Service)
- **Java** 17+ và **Maven** 3.8+ (cho User Service và ERP services)
- **Python** 3.11+ (cho AI/ML services)
- **Git** 2.30+

### Production
- **Kubernetes** 1.25+
- **Helm** 3.10+
- **kubectl** configured
- **Ingress Controller** (nginx recommended)
- **Cert Manager** (for SSL certificates)

## 🏗️ Kiến Trúc Tổng Quan

```
┌─────────────────────────────────────────────────────────────┐
│                    API Gateway (Port 3004)                  │
│                 Go + Gin + Redis + JWT                      │
└─────────────────────┬───────────────────────────────────────┘
                      │
      ┌───────────────┼───────────────┐
      │               │               │
┌─────▼─────┐  ┌─────▼─────┐  ┌─────▼─────┐
│Auth Service│  │User Service│  │ERP Services│
│Go + Gin    │  │Java Spring │  │Java Spring │
│Port 3008   │  │Port 3009   │  │Port 3028+ │
└───────────┘  └───────────┘  └───────────┘
      │               │               │
      └───────────────┼───────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│              Databases & Infrastructure                      │
│  PostgreSQL + MongoDB + Redis + TimescaleDB + Kafka        │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/i3m-platform/core.git
cd i3m-platform
```

### 2. Start Core Services
```bash
# Khởi động core services (API Gateway, Auth, User)
./scripts/start-core-services.sh
```

### 3. Test Services
```bash
# Kiểm tra health của tất cả services
./scripts/test-services.sh
```

### 4. Access Services
- **API Gateway**: http://localhost:3004
- **Auth Service**: http://localhost:3008
- **User Service**: http://localhost:3009
- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3000 (admin/admin)

## 🔧 Development Workflow

### Thêm Service Mới
1. Tạo thư mục service trong nhóm tương ứng:
   ```bash
   mkdir -p erp-services/new-service
   cd erp-services/new-service
   ```

2. Tạo Dockerfile và cấu hình service

3. Thêm service vào `docker-compose.yml`:
   ```yaml
   new-service:
     build:
       context: ./erp-services/new-service
     ports:
       - "3034:3034"
     environment:
       - PORT=3034
       - DATABASE_URL=postgres://...
     depends_on:
       - postgres
   ```

4. Cập nhật API Gateway routing trong `core-services/api-gateway/main.go`

5. Thêm monitoring trong `shared/monitoring/prometheus.yml`

### Testing
```bash
# Unit tests
./scripts/test-unit.sh

# Integration tests
./scripts/test-integration.sh

# Load tests
./scripts/test-load.sh
```

### Logging & Monitoring
```bash
# Xem logs của tất cả services
docker-compose logs -f

# Xem logs của service cụ thể
docker-compose logs -f api-gateway

# Xem metrics
curl http://localhost:3004/metrics
curl http://localhost:3008/metrics
curl http://localhost:3009/actuator/prometheus
```

## 🌐 API Usage Examples

### Authentication
```bash
# Register new user
curl -X POST http://localhost:3004/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -H "X-Tenant-ID: 550e8400-e29b-41d4-a716-446655440000" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword123",
    "first_name": "John",
    "last_name": "Doe"
  }'

# Login
curl -X POST http://localhost:3004/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -H "X-Tenant-ID: 550e8400-e29b-41d4-a716-446655440000" \
  -d '{
    "email": "admin@demo.com",
    "password": "admin123"
  }'

# Get profile (requires token)
curl -X GET http://localhost:3004/api/v1/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "X-Tenant-ID: 550e8400-e29b-41d4-a716-446655440000"
```

### User Management
```bash
# Get users list (requires auth)
curl -X GET "http://localhost:3004/api/v1/users?page=0&size=20" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "X-Tenant-ID: 550e8400-e29b-41d4-a716-446655440000"

# Get user by ID
curl -X GET http://localhost:3004/api/v1/users/USER_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "X-Tenant-ID: 550e8400-e29b-41d4-a716-446655440000"

# Update user
curl -X PUT http://localhost:3004/api/v1/users/USER_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "X-Tenant-ID: 550e8400-e29b-41d4-a716-446655440000" \
  -d '{
    "first_name": "Updated Name",
    "preferences": {"theme": "dark"}
  }'
```

## 🐳 Docker Commands

```bash
# Build tất cả services
docker-compose build

# Start specific services
docker-compose up -d postgres redis mongodb
docker-compose up -d api-gateway auth-service

# Scale services
docker-compose up -d --scale api-gateway=3

# View resource usage
docker stats

# Clean up
docker-compose down
docker-compose down -v  # Remove volumes
docker system prune -f  # Clean unused resources
```

## ☸️ Kubernetes Deployment

### Prerequisites
```bash
# Install kubectl, helm, etc.
# Configure kubectl to connect to your cluster
kubectl cluster-info
```

### Deploy to Kubernetes
```bash
# Create namespace
kubectl apply -f deployments/k8s/namespace.yaml

# Apply configurations
kubectl apply -f deployments/k8s/configmaps/
kubectl apply -f deployments/k8s/secrets/

# Deploy databases (or use managed services)
helm repo add bitnami https://charts.bitnami.com/bitnami
helm install postgres bitnami/postgresql -n i3m-platform
helm install redis bitnami/redis -n i3m-platform
helm install mongodb bitnami/mongodb -n i3m-platform

# Deploy services
kubectl apply -f deployments/k8s/services/

# Check deployment
kubectl get pods -n i3m-platform
kubectl get services -n i3m-platform
kubectl get ingress -n i3m-platform
```

### Monitoring in Kubernetes
```bash
# Deploy monitoring stack
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install prometheus prometheus-community/kube-prometheus-stack -n i3m-platform

# Port forward to access Grafana
kubectl port-forward svc/prometheus-grafana 3000:80 -n i3m-platform
```

## 🔒 Security

### JWT Tokens
- Access tokens expire in 15 minutes
- Refresh tokens expire in 7 days
- Tokens are automatically blacklisted on logout

### Multi-tenant Isolation
- Row-level security với `tenant_id`
- Headers: `X-Tenant-ID` required for all requests
- Database queries automatically filtered by tenant

### Rate Limiting
- API Gateway: 60 requests/minute per IP
- Auth Service: 5 failed login attempts = 15 minute block
- Tenant-specific limits based on plan

## 📊 Monitoring & Observability

### Metrics
- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3000
- **Service metrics**: `/metrics` or `/actuator/prometheus`

### Key Metrics to Monitor
- Request rate và latency
- Error rate (4xx, 5xx)
- Database connection pool
- Memory và CPU usage
- Active user sessions
- Authentication success/failure rates

### Logs
- Structured JSON logging
- Centralized với ELK stack
- Log levels: DEBUG, INFO, WARN, ERROR
- Request tracing với correlation IDs

## 🚨 Troubleshooting

### Common Issues

**Services không start được:**
```bash
# Check logs
docker-compose logs service-name

# Check ports
netstat -tulpn | grep :3004

# Restart services
docker-compose restart service-name
```

**Database connection errors:**
```bash
# Check database status
docker-compose exec postgres pg_isready -U i3m_user
docker-compose exec mongodb mongosh --eval "db.adminCommand('ping')"
docker-compose exec redis redis-cli ping

# Reset database
docker-compose down -v
docker-compose up -d postgres mongodb redis
```

**Authentication issues:**
```bash
# Check JWT secret consistency
grep JWT_SECRET docker-compose.yml

# Verify tenant exists
curl http://localhost:3008/health
```

### Performance Issues
```bash
# Check resource usage
docker stats

# Database performance
docker-compose exec postgres psql -U i3m_user -d i3m_platform -c "SELECT * FROM pg_stat_activity;"

# Cache hit rates
docker-compose exec redis redis-cli info stats
```

## 📚 Next Steps

1. **Phát triển ERP Services**: Finance, HRM, Inventory, etc.
2. **Analytics Services**: AI/ML pipeline, user analytics
3. **Content Management**: CMS, media handling
4. **Template Marketplace**: Template engine và marketplace
5. **Mobile Apps**: Flutter-based iOS/Android apps

## 🤝 Contributing

1. Fork repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📞 Support

- **Documentation**: [docs/](docs/)
- **Issues**: [GitHub Issues](https://github.com/i3m-platform/core/issues)
- **Email**: support@i3m.com
- **Slack**: #i3m-platform

---

**🚀 Happy coding with I3M Platform!** 🎉
