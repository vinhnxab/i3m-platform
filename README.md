# 🚀 I3M Platform - Microservices Architecture

I3M Platform là một nền tảng microservices hiện đại, cung cấp giải pháp ERP, multi-tenant architecture, template marketplace, public websites, và analytics.

## 📁 Cấu Trúc Dự Án

```
i3m-platform/
├── core-services/          # Core Services (API Gateway, Auth, User)
├── erp-services/           # ERP Services (Commerce, CMS, Analytics, HR, Finance, CRM, Inventory, Procurement)
├── industry-services/      # Industry Services (Ecommerce, Agriculture, Healthcare, Retail, Restaurant, Manufacturing)
├── infrastructure-services/ # Infrastructure Services (Security, Monitoring, Load Balancer, Cost Optimization)
├── integration-services/   # Integration Services (API Docs, Currency, Integration)
├── marketplace-services/   # Marketplace Services (Templates, Installation, Preview)
├── shared-services/        # Shared Services (Notification, Billing, Workflow)
├── shared/                 # Shared libraries, configs, schemas
├── deployments/           # Kubernetes manifests, Docker configs
├── terraform/             # Infrastructure as Code
├── scripts/               # Development và deployment scripts
└── docs/                  # Documentation
```

## 🏗️ Kiến Trúc Tổng Thể

### **🎯 Business Operating System (BOS) Philosophy**
I3M Platform hoạt động như một hệ điều hành kinh doanh:
- **ERP Services**: Kernel (Core Business Logic)
- **Industry Services**: Applications (Industry-specific)
- **Core Services**: System Services (Infrastructure)
- **Integration Layer**: API Gateway, Service Mesh, Event Bus

### **📊 Architecture Layers**
- **50+ Microservices** được phân chia thành 6 nhóm chính
- **Multi-tenant Architecture** với row-based isolation
- **Event-driven Communication** sử dụng Kafka
- **Container Orchestration** với Kubernetes
- **Multi-database Strategy** (PostgreSQL, MongoDB, Redis, TimescaleDB)
- **Headless Multi-channel Commerce** cho Industry Services

## 🛠️ Công Nghệ Sử Dụng

- **Backend**: Go 1.21, Java 17 (Spring Boot 3.1), Python 3.11 (FastAPI), Node.js 20
- **Databases**: PostgreSQL 15, MongoDB 7.0, Redis 7.0, TimescaleDB 2.11, Elasticsearch 8.0
- **Message Queue**: Apache Kafka
- **Container**: Docker, Kubernetes
- **Cloud**: AWS EKS, S3, RDS
- **Monitoring**: Prometheus, Grafana, ELK Stack
- **Security**: JWT, OAuth2, Keycloak, HashiCorp Vault

## 🚀 Quick Start

### Development Environment

```bash
# Clone repository
git clone https://github.com/i3m-platform/core.git
cd i3m-platform

# Start all services với Docker Compose
docker-compose up -d

# Hoặc start từng service group
./scripts/start-core-services.sh
./scripts/start-erp-services.sh
```

### Production Deployment

```bash
# Deploy với Kubernetes
kubectl apply -f deployments/k8s/

# Hoặc sử dụng Terraform
cd terraform/
terraform init
terraform apply
```

## 📊 Service Overview

| Group | Services | Ports | Technology |
|-------|----------|-------|------------|
| Core | 3 services | 3004-3009 | Go, Java |
| ERP | 6 services | 3028-3033 | Java, Go |
| Analytics | 4 services | 3017-3020 | Python, Java |
| Content | 3 services | 3021-3023 | Node.js |
| Industry | 2 services | 3034-3035 | Java |
| Infrastructure | 5 services | 3040-3044 | Go, Node.js |
| Integration | 3 services | 3050-3052 | Node.js, Java |
| Marketplace | 3 services | 3060-3062 | Node.js, Go |
| Shared | 3 services | 3070-3072 | Node.js, Java |

## 🔐 Security

- **Authentication**: JWT với Keycloak
- **Authorization**: RBAC với fine-grained permissions
- **Encryption**: TLS 1.3, data encryption at rest
- **Compliance**: GDPR, HIPAA ready
- **Secrets Management**: HashiCorp Vault

## 📈 Monitoring & Observability

- **Metrics**: Prometheus + Grafana
- **Logging**: ELK Stack (Elasticsearch, Logstash, Kibana)
- **Tracing**: Jaeger
- **Health Checks**: Kubernetes probes
- **Alerting**: PagerDuty integration

## 🧪 Testing

```bash
# Run unit tests
./scripts/test-all.sh

# Run integration tests
./scripts/test-integration.sh

# Run load tests
./scripts/test-load.sh
```

## 📚 Documentation

- [Architecture Guide](docs/architecture.md)
- [API Documentation](docs/api.md)
- [Deployment Guide](docs/deployment.md)
- [Developer Guide](docs/developer.md)
- [Security Guide](docs/security.md)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**🚀 I3M Platform - Sẵn sàng cho tương lai kinh doanh!**
