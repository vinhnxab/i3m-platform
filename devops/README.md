# I3M Platform DevOps

This directory contains all the DevOps configurations for the I3M Platform, including Infrastructure as Code (Terraform), Kubernetes manifests, and monitoring configurations.

## Directory Structure

```
devops/
├── terraform/           # Infrastructure as Code
│   ├── main.tf         # Main Terraform configuration
│   ├── variables.tf    # Variable definitions
│   ├── iam.tf         # IAM roles and policies
│   └── outputs.tf     # Output values
├── kubernetes/         # Kubernetes manifests
│   ├── namespace.yml   # Namespace definitions
│   ├── configmaps/    # Configuration maps
│   ├── secrets/       # Secret definitions
│   ├── deployments/   # Deployment manifests
│   ├── services/      # Service definitions
│   └── ingress/       # Ingress configurations
└── monitoring/        # Monitoring configurations
    ├── prometheus.yml # Prometheus configuration
    └── grafana-dashboards/ # Grafana dashboards
```

## Prerequisites

- AWS CLI configured
- Terraform >= 1.0
- kubectl configured
- Docker
- Helm (for monitoring stack)

## Infrastructure Setup

### 1. Terraform Infrastructure

```bash
cd devops/terraform

# Initialize Terraform
terraform init

# Plan the infrastructure
terraform plan -var="environment=staging"

# Apply the infrastructure
terraform apply -var="environment=staging"
```

### 2. Configure kubectl

```bash
aws eks update-kubeconfig --region us-west-2 --name i3m-staging-cluster
```

### 3. Deploy Applications

```bash
# Apply namespaces
kubectl apply -f kubernetes/namespace.yml

# Apply ConfigMaps
kubectl apply -f kubernetes/configmaps/

# Apply Secrets (after creating them)
kubectl apply -f kubernetes/secrets/

# Apply Deployments
kubectl apply -f kubernetes/deployments/

# Apply Services
kubectl apply -f kubernetes/services/

# Apply Ingress
kubectl apply -f kubernetes/ingress/
```

## Environment Variables

### Required Secrets

Create the following secrets before deployment:

```bash
# Database credentials
kubectl create secret generic i3m-app-secrets \
  --from-literal=DATABASE_PASSWORD=your-db-password \
  --from-literal=JWT_SECRET=your-jwt-secret \
  --from-literal=REDIS_AUTH_TOKEN=your-redis-token \
  -n i3m-staging

# For production
kubectl create secret generic i3m-app-secrets \
  --from-literal=DATABASE_PASSWORD=your-prod-db-password \
  --from-literal=JWT_SECRET=your-prod-jwt-secret \
  --from-literal=REDIS_AUTH_TOKEN=your-prod-redis-token \
  -n i3m-production
```

### Terraform Variables

Create `terraform.tfvars`:

```hcl
environment = "staging"
aws_region = "us-west-2"
vpc_cidr = "10.0.0.0/16"
db_password = "your-secure-password"
redis_auth_token = "your-redis-token"
domain_name = "i3m-platform.com"
certificate_arn = "arn:aws:acm:us-west-2:123456789:certificate/xxx"
```

## Monitoring Setup

### 1. Install Prometheus and Grafana

```bash
# Add Helm repositories
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo add grafana https://grafana.github.io/helm-charts
helm repo update

# Install Prometheus
helm install prometheus prometheus-community/kube-prometheus-stack \
  --namespace i3m-monitoring \
  --create-namespace \
  --values monitoring/prometheus-values.yml

# Install Grafana dashboards
kubectl apply -f monitoring/grafana-dashboards/
```

### 2. Access Monitoring

```bash
# Port-forward Grafana
kubectl port-forward -n i3m-monitoring svc/prometheus-grafana 3000:80

# Port-forward Prometheus
kubectl port-forward -n i3m-monitoring svc/prometheus-kube-prometheus-prometheus 9090:9090
```

Default Grafana credentials:
- Username: admin
- Password: prom-operator

## CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/ci-cd.yml`) automatically:

1. **Detects Changes**: Uses path filters to only build changed services
2. **Tests**: Runs unit tests for each service type
3. **Security Scan**: Scans for vulnerabilities using Trivy
4. **Build & Push**: Builds Docker images and pushes to GitHub Container Registry
5. **Deploy**: 
   - Staging: Deploys on push to `develop` branch
   - Production: Deploys on push to `main` branch
6. **Notify**: Sends Slack notifications

### Required GitHub Secrets

```
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
GITHUB_TOKEN (automatically provided)
SLACK_WEBHOOK_URL (optional)
```

## Service Deployment Template

Each service should follow this structure:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: i3m-{service-name}
  namespace: i3m-{environment}
  labels:
    app: i3m-{service-name}
    service-group: {group-name}
spec:
  replicas: 3
  # ... deployment spec
---
apiVersion: v1
kind: Service
metadata:
  name: i3m-{service-name}
  annotations:
    prometheus.io/scrape: "true"
    prometheus.io/port: "{port}"
# ... service spec
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
# ... HPA spec
---
apiVersion: policy/v1
kind: PodDisruptionBudget
# ... PDB spec
```

## Scaling and Performance

### Horizontal Pod Autoscaler (HPA)

All services are configured with HPA based on:
- CPU utilization (70%)
- Memory utilization (80%)
- Min replicas: 3
- Max replicas: 10

### Pod Disruption Budgets (PDB)

Ensures at least 2 pods are available during updates or node maintenance.

### Resource Limits

Default resource allocation per service:
- Requests: 250m CPU, 256Mi memory
- Limits: 500m CPU, 512Mi memory

## Security

### Pod Security

- Non-root containers
- Read-only root filesystem
- Security contexts applied
- Service accounts for each service

### Network Policies

Network policies restrict pod-to-pod communication based on labels.

### Secrets Management

- Database credentials stored as Kubernetes secrets
- JWT secrets rotated regularly
- AWS IAM roles for service authentication

## Disaster Recovery

### Backup Strategy

1. **Database**: RDS automated backups (7 days retention)
2. **Redis**: ElastiCache snapshots (5 days retention)
3. **Application Data**: Persistent volumes backed up daily

### High Availability

- Multi-AZ deployment
- Auto Scaling Groups
- Load balancer health checks
- Cross-region replication for production

## Troubleshooting

### Common Issues

1. **Pod CrashLoopBackOff**
   ```bash
   kubectl logs -f deployment/i3m-{service-name} -n i3m-{env}
   kubectl describe pod {pod-name} -n i3m-{env}
   ```

2. **Service Discovery Issues**
   ```bash
   kubectl get endpoints -n i3m-{env}
   kubectl get services -n i3m-{env}
   ```

3. **Database Connection Issues**
   ```bash
   kubectl exec -it {pod-name} -n i3m-{env} -- /bin/sh
   # Test database connectivity
   ```

### Monitoring Queries

Useful Prometheus queries:

```promql
# Service availability
up{job=~"i3m-.*-services"}

# Request rate
sum(rate(http_requests_total[5m])) by (service)

# Error rate
sum(rate(http_requests_total{status=~"5.."}[5m])) by (service) / sum(rate(http_requests_total[5m])) by (service)

# Response time
histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le, service))
```

## Maintenance

### Regular Tasks

1. **Weekly**: Review monitoring dashboards and alerts
2. **Monthly**: Update Kubernetes cluster and node AMIs
3. **Quarterly**: Review and update security policies
4. **Annually**: Disaster recovery testing

### Update Procedures

1. **Application Updates**: Handled by CI/CD pipeline
2. **Infrastructure Updates**: Use Terraform with careful planning
3. **Kubernetes Updates**: Follow AWS EKS upgrade guide

## Cost Optimization

- Use Spot instances for non-critical workloads
- Implement cluster autoscaling
- Regular review of resource utilization
- Reserved instances for predictable workloads
