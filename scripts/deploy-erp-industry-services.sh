#!/bin/bash
set -e

echo "🚀 Deploying ERP and Industry Services to Kubernetes..."

NAMESPACE="i3m-platform"
K8S_DIR="deployments/k8s"

# ERP Services
ERP_DEPLOYMENT="$K8S_DIR/deployments/erp-services-deployment.yaml"
ERP_INGRESS="$K8S_DIR/ingress/erp-industry-ingress.yaml"

# Industry Services
INDUSTRY_DEPLOYMENT="$K8S_DIR/deployments/industry-services-deployment.yaml"

# Create namespace if it doesn't exist
echo "📁 Ensuring namespace '$NAMESPACE' exists..."
kubectl create namespace $NAMESPACE --dry-run=client -o yaml | kubectl apply -f -

# Deploy ERP Services
echo "🏢 Deploying ERP Services (Core Business Logic)..."
kubectl apply -f "$ERP_DEPLOYMENT" -n "$NAMESPACE"

# Deploy Industry Services
echo "🏭 Deploying Industry Services (Industry Applications)..."
kubectl apply -f "$INDUSTRY_DEPLOYMENT" -n "$NAMESPACE"

# Deploy Ingress
echo "🌐 Deploying ERP and Industry Ingress..."
kubectl apply -f "$ERP_INGRESS" -n "$NAMESPACE"

# Apply Storage PVC
echo "💾 Applying Storage PVC..."
kubectl apply -f "$K8S_DIR/persistent-volumes/storage-pvc.yaml" -n "$NAMESPACE"

# Wait for deployments to be ready
echo "⏳ Waiting for ERP Services to be ready..."
kubectl rollout status deployment/commerce-service -n "$NAMESPACE" --timeout=300s
kubectl rollout status deployment/cms-service -n "$NAMESPACE" --timeout=300s
kubectl rollout status deployment/analytics-service -n "$NAMESPACE" --timeout=300s
kubectl rollout status deployment/storage-service -n "$NAMESPACE" --timeout=300s

echo "⏳ Waiting for Industry Services to be ready..."
kubectl rollout status deployment/ecommerce-service -n "$NAMESPACE" --timeout=300s
kubectl rollout status deployment/agriculture-service -n "$NAMESPACE" --timeout=300s
kubectl rollout status deployment/healthcare-service -n "$NAMESPACE" --timeout=300s
kubectl rollout status deployment/retail-service -n "$NAMESPACE" --timeout=300s
kubectl rollout status deployment/restaurant-service -n "$NAMESPACE" --timeout=300s
kubectl rollout status deployment/manufacturing-service -n "$NAMESPACE" --timeout=300s

echo "✅ ERP and Industry Services deployed successfully!"

# Show status
echo "📊 Service Status:"
kubectl get pods,svc,ingress -l tier=erp -n "$NAMESPACE"
kubectl get pods,svc,ingress -l tier=industry -n "$NAMESPACE"

echo "🌐 API Endpoints:"
echo "ERP Services (Core Business):"
echo "  - Commerce: https://api.i3m.com/api/v1/erp/commerce"
echo "  - CMS: https://api.i3m.com/api/v1/erp/cms"
echo "  - Analytics: https://api.i3m.com/api/v1/erp/analytics"
echo "  - Storage: https://api.i3m.com/api/v1/erp/storage"
echo "  - HR: https://api.i3m.com/api/v1/erp/hr"
echo "  - Finance: https://api.i3m.com/api/v1/erp/finance"
echo "  - CRM: https://api.i3m.com/api/v1/erp/crm"
echo "  - Inventory: https://api.i3m.com/api/v1/erp/inventory"
echo "  - Procurement: https://api.i3m.com/api/v1/erp/procurement"

echo "Industry Services (Applications):"
echo "  - Ecommerce: https://api.i3m.com/api/v1/industry/ecommerce"
echo "  - Agriculture: https://api.i3m.com/api/v1/industry/agriculture"
echo "  - Healthcare: https://api.i3m.com/api/v1/industry/healthcare"
echo "  - Retail: https://api.i3m.com/api/v1/industry/retail"
echo "  - Restaurant: https://api.i3m.com/api/v1/industry/restaurant"
echo "  - Manufacturing: https://api.i3m.com/api/v1/industry/manufacturing"
