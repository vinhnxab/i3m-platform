#!/bin/bash

# I3M Platform System Restart Script
# Sử dụng script này để khởi động lại toàn bộ hệ thống

set -e

echo "🚀 I3M Platform System Restart"
echo "================================"

# Check if kubectl is available
if ! command -v kubectl &> /dev/null; then
    echo "❌ kubectl is not installed or not in PATH"
    exit 1
fi

# Check if cluster is accessible
if ! kubectl cluster-info &> /dev/null; then
    echo "❌ Cannot connect to Kubernetes cluster"
    echo "💡 Please start your Kubernetes cluster first"
    exit 1
fi

echo "✅ Kubernetes cluster is accessible"

# Check if namespace exists
if ! kubectl get namespace i3m-platform &> /dev/null; then
    echo "📁 Creating namespace..."
    kubectl apply -f /home/vinhnx/i3m-platform/deployments/k8s/namespace.yaml
else
    echo "✅ Namespace i3m-platform exists"
fi

# Start core services first
echo "🔧 Starting core services..."

# Start databases
echo "📊 Starting databases..."
kubectl apply -f /home/vinhnx/i3m-platform/deployments/k8s/services/databases.yaml

# Start API Gateway
echo "🌐 Starting API Gateway..."
kubectl apply -f /home/vinhnx/i3m-platform/deployments/k8s/services/api-gateway.yaml
kubectl apply -f /home/vinhnx/i3m-platform/deployments/k8s/deployments/api-gateway-deployment.yml

# Start Auth Service
echo "🔐 Starting Auth Service..."
kubectl apply -f /home/vinhnx/i3m-platform/deployments/k8s/services/auth-service.yaml
kubectl apply -f /home/vinhnx/i3m-platform/deployments/k8s/deployments/auth-service-deployment.yml

# Start User Service
echo "👤 Starting User Service..."
kubectl apply -f /home/vinhnx/i3m-platform/deployments/k8s/services/user-service.yaml
kubectl apply -f /home/vinhnx/i3m-platform/deployments/k8s/deployments/user-service-deployment.yml

# Wait for core services to be ready
echo "⏳ Waiting for core services to be ready..."
kubectl wait --for=condition=ready pod -l app=api-gateway -n i3m-platform --timeout=300s
kubectl wait --for=condition=ready pod -l app=auth-service -n i3m-platform --timeout=300s
kubectl wait --for=condition=ready pod -l app=user-service -n i3m-platform --timeout=300s

echo "✅ Core services are ready"

# Start UI development environment
echo "🎨 Starting UI development environment..."
kubectl apply -f /home/vinhnx/i3m-platform/deployments/k8s/configmaps/ui-dashboard-config.yaml
kubectl apply -f /home/vinhnx/i3m-platform/deployments/k8s/deployments/ui-dashboard-dev-deployment.yaml
kubectl apply -f /home/vinhnx/i3m-platform/deployments/k8s/services/ui-dashboard-dev-service.yaml
kubectl apply -f /home/vinhnx/i3m-platform/deployments/k8s/ingress/ui-dashboard-dev-ingress.yaml

# Wait for UI to be ready
echo "⏳ Waiting for UI development environment..."
kubectl wait --for=condition=ready pod -l app=ui-dashboard-dev -n i3m-platform --timeout=300s

echo "✅ UI development environment is ready"

# Start additional services
echo "🔧 Starting additional services..."

# Start all business services
echo "📊 Starting business services..."
kubectl apply -f /home/vinhnx/i3m-platform/devops/kubernetes/deployments/ 2>/dev/null || echo "⚠️  Some business services may not be available"

# Start all infrastructure services
echo "🏗️ Starting infrastructure services..."
kubectl apply -f /home/vinhnx/i3m-platform/devops/kubernetes/services/ 2>/dev/null || echo "⚠️  Some infrastructure services may not be available"

# Start all content services
echo "📝 Starting content services..."
kubectl apply -f /home/vinhnx/i3m-platform/devops/kubernetes/deployments/ 2>/dev/null || echo "⚠️  Some content services may not be available"

# Start all analytics services
echo "📈 Starting analytics services..."
kubectl apply -f /home/vinhnx/i3m-platform/devops/kubernetes/deployments/ 2>/dev/null || echo "⚠️  Some analytics services may not be available"

# Start all integration services
echo "🔗 Starting integration services..."
kubectl apply -f /home/vinhnx/i3m-platform/devops/kubernetes/deployments/ 2>/dev/null || echo "⚠️  Some integration services may not be available"

# Wait for all services to be ready
echo "⏳ Waiting for all services to be ready..."
kubectl wait --for=condition=ready pod -l app=ai-service -n i3m-platform --timeout=300s || echo "⚠️  AI service not ready"
kubectl wait --for=condition=ready pod -l app=analytics-service -n i3m-platform --timeout=300s || echo "⚠️  Analytics service not ready"
kubectl wait --for=condition=ready pod -l app=billing-service -n i3m-platform --timeout=300s || echo "⚠️  Billing service not ready"
kubectl wait --for=condition=ready pod -l app=crm-service -n i3m-platform --timeout=300s || echo "⚠️  CRM service not ready"
kubectl wait --for=condition=ready pod -l app=ecommerce-service -n i3m-platform --timeout=300s || echo "⚠️  Ecommerce service not ready"
kubectl wait --for=condition=ready pod -l app=finance-service -n i3m-platform --timeout=300s || echo "⚠️  Finance service not ready"
kubectl wait --for=condition=ready pod -l app=hrm-service -n i3m-platform --timeout=300s || echo "⚠️  HRM service not ready"
kubectl wait --for=condition=ready pod -l app=notification-service -n i3m-platform --timeout=300s || echo "⚠️  Notification service not ready"
kubectl wait --for=condition=ready pod -l app=workflow-service -n i3m-platform --timeout=300s || echo "⚠️  Workflow service not ready"
kubectl wait --for=condition=ready pod -l app=load-balancer-service -n i3m-platform --timeout=300s || echo "⚠️  Load balancer service not ready"
kubectl wait --for=condition=ready pod -l app=security-service -n i3m-platform --timeout=300s || echo "⚠️  Security service not ready"
kubectl wait --for=condition=ready pod -l app=observability-service -n i3m-platform --timeout=300s || echo "⚠️  Observability service not ready"
kubectl wait --for=condition=ready pod -l app=secrets-management-service -n i3m-platform --timeout=300s || echo "⚠️  Secrets management service not ready"
kubectl wait --for=condition=ready pod -l app=cost-optimization-service -n i3m-platform --timeout=300s || echo "⚠️  Cost optimization service not ready"
kubectl wait --for=condition=ready pod -l app=content-service -n i3m-platform --timeout=300s || echo "⚠️  Content service not ready"
kubectl wait --for=condition=ready pod -l app=media-service -n i3m-platform --timeout=300s || echo "⚠️  Media service not ready"
kubectl wait --for=condition=ready pod -l app=metadata-service -n i3m-platform --timeout=300s || echo "⚠️  Metadata service not ready"
kubectl wait --for=condition=ready pod -l app=ml-pipeline-service -n i3m-platform --timeout=300s || echo "⚠️  ML pipeline service not ready"
kubectl wait --for=condition=ready pod -l app=user-analytics-service -n i3m-platform --timeout=300s || echo "⚠️  User analytics service not ready"
kubectl wait --for=condition=ready pod -l app=api-documentation-service -n i3m-platform --timeout=300s || echo "⚠️  API documentation service not ready"
kubectl wait --for=condition=ready pod -l app=currency-exchange-service -n i3m-platform --timeout=300s || echo "⚠️  Currency exchange service not ready"
kubectl wait --for=condition=ready pod -l app=preview-service -n i3m-platform --timeout=300s || echo "⚠️  Preview service not ready"
kubectl wait --for=condition=ready pod -l app=installation-service -n i3m-platform --timeout=300s || echo "⚠️  Installation service not ready"

# Check system status
echo "📊 System Status:"
echo "=================="

echo "🔍 Core Services:"
kubectl get pods -n i3m-platform -l app=api-gateway
kubectl get pods -n i3m-platform -l app=auth-service
kubectl get pods -n i3m-platform -l app=user-service

echo "🎨 UI Services:"
kubectl get pods -n i3m-platform -l app=ui-dashboard-dev

echo "🌐 Services:"
kubectl get svc -n i3m-platform | grep -E "(api-gateway|auth-service|ui-dashboard)"

echo "🔗 Ingress:"
kubectl get ingress -n i3m-platform

echo ""
echo "✅ I3M Platform System Restart Completed!"
echo ""
echo "🔗 Access Points:"
echo "   Frontend Dev: http://localhost:5173"
echo "   API Gateway: http://localhost:3000"
echo "   Port Forward: kubectl port-forward svc/ui-dashboard-dev-service 5173:5173 -n i3m-platform"
echo ""
echo "💡 To start local development:"
echo "   ./scripts/dev.sh ui"
echo ""
echo "💡 To check system status:"
echo "   ./scripts/dev.sh k8s-status"
