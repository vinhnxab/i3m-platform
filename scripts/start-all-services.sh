#!/bin/bash

# I3M Platform - Start All Services Script
# Khởi động tất cả 36+ services trong hệ thống

set -e

echo "🚀 I3M Platform - Starting All Services"
echo "======================================="

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
    kubectl create namespace i3m-platform
else
    echo "✅ Namespace i3m-platform exists"
fi

# Function to start services by category
start_services() {
    local category=$1
    local services=("${@:2}")
    
    echo "🔧 Starting $category services..."
    for service in "${services[@]}"; do
        echo "  📦 Starting $service..."
        kubectl apply -f /home/vinhnx/i3m-platform/devops/kubernetes/deployments/${service}-deployment.yml 2>/dev/null || echo "    ⚠️  $service deployment not found"
        kubectl apply -f /home/vinhnx/i3m-platform/devops/kubernetes/services/${service}-service.yml 2>/dev/null || echo "    ⚠️  $service service not found"
    done
}

# Function to wait for services
wait_for_services() {
    local services=("$@")
    echo "⏳ Waiting for services to be ready..."
    for service in "${services[@]}"; do
        echo "  🔍 Checking $service..."
        kubectl wait --for=condition=ready pod -l app=$service -n i3m-platform --timeout=300s 2>/dev/null || echo "    ⚠️  $service not ready (timeout)"
    done
}

# 1. Core Infrastructure Services
echo "🏗️ Starting Core Infrastructure Services..."
core_services=("postgres" "redis" "mongodb")
start_services "Core Infrastructure" "${core_services[@]}"

# 2. Core Application Services
echo "🔐 Starting Core Application Services..."
app_services=("api-gateway" "auth-service" "user-service")
start_services "Core Application" "${app_services[@]}"

# 3. Business Services
echo "📊 Starting Business Services..."
business_services=("ai-service" "analytics-service" "billing-service" "crm-service" "ecommerce-service" "finance-service" "hrm-service" "notification-service" "workflow-service")
start_services "Business" "${business_services[@]}"

# 4. Infrastructure Services
echo "🏗️ Starting Infrastructure Services..."
infra_services=("load-balancer-service" "security-service" "observability-service" "secrets-management-service" "cost-optimization-service")
start_services "Infrastructure" "${infra_services[@]}"

# 5. Content Services
echo "📝 Starting Content Services..."
content_services=("content-service" "media-service" "metadata-service")
start_services "Content" "${content_services[@]}"

# 6. Analytics & ML Services
echo "📈 Starting Analytics & ML Services..."
analytics_services=("ml-pipeline-service" "user-analytics-service")
start_services "Analytics & ML" "${analytics_services[@]}"

# 7. Integration Services
echo "🔗 Starting Integration Services..."
integration_services=("api-documentation-service" "currency-exchange-service" "preview-service" "installation-service")
start_services "Integration" "${integration_services[@]}"

# 8. Industry-Specific Services
echo "🏭 Starting Industry-Specific Services..."
industry_services=("agriculture-service" "healthcare-service" "procurement-service")
start_services "Industry-Specific" "${industry_services[@]}"

# 9. Additional Services
echo "🔧 Starting Additional Services..."
additional_services=("integration-service" "inventory-service" "template-marketplace-service")
start_services "Additional" "${additional_services[@]}"

# 10. UI Services
echo "🎨 Starting UI Services..."
ui_services=("ui-dashboard" "ui-dashboard-dev")
start_services "UI" "${ui_services[@]}"

# Wait for core services first
echo "⏳ Waiting for core services..."
wait_for_services "postgres" "redis" "mongodb" "api-gateway" "auth-service" "user-service"

# Wait for business services
echo "⏳ Waiting for business services..."
wait_for_services "ai-service" "analytics-service" "billing-service" "crm-service" "ecommerce-service" "finance-service" "hrm-service" "notification-service" "workflow-service"

# Wait for infrastructure services
echo "⏳ Waiting for infrastructure services..."
wait_for_services "load-balancer-service" "security-service" "observability-service" "secrets-management-service" "cost-optimization-service"

# Wait for content services
echo "⏳ Waiting for content services..."
wait_for_services "content-service" "media-service" "metadata-service"

# Wait for analytics services
echo "⏳ Waiting for analytics services..."
wait_for_services "ml-pipeline-service" "user-analytics-service"

# Wait for integration services
echo "⏳ Waiting for integration services..."
wait_for_services "api-documentation-service" "currency-exchange-service" "preview-service" "installation-service"

# Wait for industry services
echo "⏳ Waiting for industry services..."
wait_for_services "agriculture-service" "healthcare-service" "procurement-service"

# Wait for additional services
echo "⏳ Waiting for additional services..."
wait_for_services "integration-service" "inventory-service" "template-marketplace-service"

# Wait for UI services
echo "⏳ Waiting for UI services..."
wait_for_services "ui-dashboard" "ui-dashboard-dev"

# Final status check
echo "📊 Final System Status:"
echo "======================"

echo "🔍 All Pods Status:"
kubectl get pods -n i3m-platform

echo ""
echo "🌐 Services Status:"
kubectl get svc -n i3m-platform

echo ""
echo "🔗 Ingress Status:"
kubectl get ingress -n i3m-platform

echo ""
echo "📈 Resource Usage:"
kubectl top pods -n i3m-platform 2>/dev/null || echo "⚠️  Metrics server not available"

echo ""
echo "✅ I3M Platform All Services Started!"
echo ""
echo "🔗 Access Points:"
echo "   Frontend Dev: http://localhost:5173"
echo "   API Gateway: http://localhost:3000"
echo "   Port Forward: kubectl port-forward svc/ui-dashboard-dev-service 5173:5173 -n i3m-platform"
echo ""
echo "💡 To check specific service status:"
echo "   kubectl get pods -n i3m-platform -l app=<service-name>"
echo ""
echo "💡 To view service logs:"
echo "   kubectl logs -f deployment/<service-name> -n i3m-platform"
