# Docker-Kubernetes Integration Improvements

## 📋 Overview

This document outlines the improvements made to the Docker-Kubernetes integration in the I3M Platform.

## 🚀 Improvements Implemented

### 1. Local Docker Registry
- **Setup**: Local registry running on `localhost:5000`
- **Purpose**: Centralized image management and versioning
- **Benefits**: 
  - Faster image pulls
  - Version control for images
  - Better CI/CD integration

```bash
# Start local registry
docker run -d -p 5000:5000 --name local-registry --restart=always registry:2

# Connect to Kind network
docker network connect kind local-registry
```

### 2. Persistent Storage
- **Added**: PersistentVolumes and PersistentVolumeClaims
- **Services**: PostgreSQL, MongoDB, Redis
- **Storage**: 10Gi for databases, 5Gi for Redis
- **Location**: `/mnt/data/{service}` on host

```bash
# Apply persistent storage
kubectl apply -f k8s-improvements/persistent-storage.yaml
```

### 3. Automation Scripts

#### build-and-deploy.sh
Automated build and deployment script with features:
- Multi-service support
- Registry integration
- Automatic image loading to Kind
- Kubernetes deployment restart

```bash
# Build single service
./scripts/build-and-deploy.sh user-service

# Build all services
./scripts/build-and-deploy.sh --all

# Build and push to registry
./scripts/build-and-deploy.sh user-service --push-registry
```

#### docker-k8s-monitor.sh
Comprehensive monitoring script:
- Docker and Kubernetes status
- Image synchronization check
- Resource usage monitoring
- Health checks
- Recommendations

```bash
# One-time check
./scripts/docker-k8s-monitor.sh

# Continuous monitoring
./scripts/docker-k8s-monitor.sh --continuous
```

### 4. Networking Improvements
- **NodePort Services**: External access to API Gateway and Grafana
- **Ingress Controller**: Unified entry point for services
- **Network Policies**: Controlled access to registry
- **Service Discovery**: Enhanced internal communication

```bash
# Apply networking improvements
kubectl apply -f k8s-improvements/networking-improvements.yaml
```

### 5. Monitoring Integration
- **Prometheus**: Metrics collection from both Docker and K8s
- **Grafana**: Unified dashboards for monitoring
- **Resource Tracking**: CPU, Memory, Network, Storage
- **Health Checks**: Automated health monitoring

## 🔧 Usage Guide

### Quick Start
```bash
# 1. Setup local registry
docker run -d -p 5000:5000 --name local-registry registry:2
docker network connect kind local-registry

# 2. Apply storage improvements
kubectl apply -f k8s-improvements/persistent-storage.yaml

# 3. Apply networking improvements  
kubectl apply -f k8s-improvements/networking-improvements.yaml

# 4. Build and deploy services
./scripts/build-and-deploy.sh --all

# 5. Monitor system
./scripts/docker-k8s-monitor.sh
```

### Service Access
- **API Gateway**: http://localhost:30000
- **Grafana**: http://localhost:30001
- **Local Registry**: http://localhost:5000
- **Registry UI**: http://localhost:5000/v2/_catalog

### Monitoring Endpoints
- **Prometheus**: http://prometheus.monitoring.svc.cluster.local:9090
- **Grafana**: http://grafana.monitoring.svc.cluster.local:3000
- **Metrics Server**: kubectl top nodes/pods

## 📊 Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Docker Host   │    │  Local Registry │    │   Kind Cluster  │
│                 │    │                 │    │                 │
│ ┌─────────────┐ │    │ ┌─────────────┐ │    │ ┌─────────────┐ │
│ │Build Images │ │───▶│ │Store Images │ │───▶│ │Deploy Pods  │ │
│ └─────────────┘ │    │ └─────────────┘ │    │ └─────────────┘ │
│                 │    │                 │    │                 │
│ ┌─────────────┐ │    │ ┌─────────────┐ │    │ ┌─────────────┐ │
│ │   Compose   │ │    │ │  Registry   │ │    │ │ Containerd  │ │
│ │  Services   │ │    │ │     API     │ │    │ │   Runtime   │ │
│ └─────────────┘ │    │ └─────────────┘ │    │ └─────────────┘ │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🎯 Performance Improvements

### Before Improvements
- ❌ No persistent storage
- ❌ Manual image management  
- ❌ No centralized monitoring
- ❌ Limited external access
- ❌ Manual deployment process

### After Improvements
- ✅ Persistent data storage
- ✅ Automated image registry
- ✅ Comprehensive monitoring
- ✅ NodePort/Ingress access
- ✅ Automated build/deploy

## 🔍 Troubleshooting

### Common Issues

#### Registry Connection Issues
```bash
# Check registry status
docker ps | grep registry

# Test registry connectivity
curl http://localhost:5000/v2/

# Restart registry
docker restart local-registry
```

#### Storage Issues
```bash
# Check PV/PVC status
kubectl get pv,pvc -n i3m-platform

# Check node storage
kubectl describe node i3m-platform-control-plane
```

#### Build/Deploy Issues
```bash
# Check build logs
./scripts/build-and-deploy.sh user-service

# Manual image load
kind load docker-image i3m-platform-user-service:latest --name i3m-platform
```

## 📈 Monitoring and Metrics

### Key Metrics to Monitor
- **Docker**: Container CPU/Memory usage
- **Kubernetes**: Pod/Node resource utilization
- **Registry**: Image pull/push rates
- **Storage**: PV usage and performance
- **Network**: Service-to-service latency

### Alerting Rules
- High CPU usage (>80%)
- Memory pressure (>90%)
- Failed pod deployments
- Registry unavailability
- Storage capacity warnings

## 🚀 Future Enhancements

1. **Multi-Registry Support**: External registry integration
2. **Advanced Monitoring**: Custom metrics and dashboards
3. **Auto-scaling**: HPA based on custom metrics
4. **Security**: Image scanning and vulnerability assessment
5. **Backup/Recovery**: Automated data backup strategies

## 📚 References

- [Kind Documentation](https://kind.sigs.k8s.io/)
- [Docker Registry](https://docs.docker.com/registry/)
- [Kubernetes Storage](https://kubernetes.io/docs/concepts/storage/)
- [Prometheus Monitoring](https://prometheus.io/docs/)
