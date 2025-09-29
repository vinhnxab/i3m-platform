#!/bin/bash
set -e

echo "🔄 Updating API Gateway for new architecture..."

# Build new API Gateway image
echo "🐳 Building API Gateway with new routing..."
cd core-services/api-gateway
docker build -t i3m-platform-api-gateway:latest .
cd ../..

# Deploy updated API Gateway
echo "🚀 Deploying updated API Gateway..."
kubectl apply -f deployments/k8s/services/api-gateway.yaml -n i3m-platform

# Wait for rollout
echo "⏳ Waiting for API Gateway rollout..."
kubectl rollout status deployment/api-gateway -n i3m-platform --timeout=300s

# Test new routes
echo "🧪 Testing new API routes..."

# Test ERP Services
echo "Testing ERP Services (Core Business):"
echo "  - Commerce: curl -s http://localhost:3004/api/v1/erp/commerce/health"
echo "  - CMS: curl -s http://localhost:3004/api/v1/erp/cms/health"
echo "  - Analytics: curl -s http://localhost:3004/api/v1/erp/analytics/health"

# Test Industry Services
echo "Testing Industry Services (Applications):"
echo "  - Ecommerce: curl -s http://localhost:3004/api/v1/industry/ecommerce/health"
echo "  - Agriculture: curl -s http://localhost:3004/api/v1/industry/agriculture/health"
echo "  - Healthcare: curl -s http://localhost:3004/api/v1/industry/healthcare/health"

# Test Legacy Routes (Backward Compatibility)
echo "Testing Legacy Routes (Backward Compatibility):"
echo "  - Legacy Content: curl -s http://localhost:3004/api/v1/content/health"
echo "  - Legacy Ecommerce: curl -s http://localhost:3004/api/v1/ecommerce/health"

echo "✅ API Gateway updated successfully!"

# Show API Gateway status
echo "📊 API Gateway Status:"
kubectl get pods,svc,ingress -l app=api-gateway -n i3m-platform

echo "🌐 New API Endpoints:"
echo "ERP Services (Core Business):"
echo "  - /api/v1/erp/commerce/*"
echo "  - /api/v1/erp/cms/*"
echo "  - /api/v1/erp/analytics/*"
echo "  - /api/v1/erp/hr/*"
echo "  - /api/v1/erp/finance/*"
echo "  - /api/v1/erp/crm/*"
echo "  - /api/v1/erp/inventory/*"
echo "  - /api/v1/erp/procurement/*"

echo "Industry Services (Applications):"
echo "  - /api/v1/industry/ecommerce/*"
echo "  - /api/v1/industry/agriculture/*"
echo "  - /api/v1/industry/healthcare/*"
echo "  - /api/v1/industry/retail/*"
echo "  - /api/v1/industry/restaurant/*"
echo "  - /api/v1/industry/manufacturing/*"

echo "Legacy Routes (Deprecated):"
echo "  - /api/v1/content/* (use /api/v1/erp/cms/*)"
echo "  - /api/v1/ecommerce/* (use /api/v1/erp/commerce/* or /api/v1/industry/ecommerce/*)"
