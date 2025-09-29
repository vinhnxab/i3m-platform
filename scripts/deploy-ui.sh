#!/bin/bash

# Deploy UI Dashboard to Kubernetes
set -e

echo "🚀 Deploying UI Dashboard to Kubernetes..."

# Check if kubectl is available
if ! command -v kubectl &> /dev/null; then
    echo "❌ kubectl is not installed or not in PATH"
    exit 1
fi

# Check if cluster is accessible
if ! kubectl cluster-info &> /dev/null; then
    echo "❌ Cannot connect to Kubernetes cluster"
    exit 1
fi

# Create namespace if it doesn't exist
echo "📁 Creating namespace..."
kubectl apply -f /home/vinhnx/i3m-platform/deployments/k8s/namespace.yaml

# Apply ConfigMap
echo "⚙️  Applying ConfigMap..."
kubectl apply -f /home/vinhnx/i3m-platform/deployments/k8s/configmaps/ui-dashboard-config.yaml

# Apply Deployment
echo "🚀 Applying Deployment..."
kubectl apply -f /home/vinhnx/i3m-platform/deployments/k8s/deployments/ui-dashboard-deployment.yaml

# Apply Service
echo "🌐 Applying Service..."
kubectl apply -f /home/vinhnx/i3m-platform/deployments/k8s/services/ui-dashboard-service.yaml

# Wait for deployment to be ready
echo "⏳ Waiting for deployment to be ready..."
kubectl rollout status deployment/ui-dashboard -n i3m-platform --timeout=300s

# Get service information
echo "📊 Deployment Status:"
kubectl get pods -n i3m-platform -l app=ui-dashboard
kubectl get svc -n i3m-platform -l app=ui-dashboard

echo "✅ UI Dashboard deployed successfully!"
echo "🔗 To access the UI:"
echo "   kubectl port-forward svc/ui-dashboard-service 3000:80 -n i3m-platform"
echo "   Then open: http://localhost:3000"
