#!/bin/bash

# Setup UI Dashboard development environment on Kubernetes
set -e

echo "🚀 Setting up UI Dashboard development environment on Kubernetes..."

# Navigate to UI directory
cd /home/vinhnx/i3m-platform/ui/master-dashboard

# Build development Docker image
echo "🐳 Building development Docker image..."
docker build -f Dockerfile.dev -t i3m-platform/ui-dashboard-dev:latest .

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

# Apply development deployment
echo "🚀 Applying development deployment..."
kubectl apply -f /home/vinhnx/i3m-platform/deployments/k8s/deployments/ui-dashboard-dev-deployment.yaml

# Apply development service
echo "🌐 Applying development service..."
kubectl apply -f /home/vinhnx/i3m-platform/deployments/k8s/services/ui-dashboard-dev-service.yaml

# Apply development ingress
echo "🔗 Applying development ingress..."
kubectl apply -f /home/vinhnx/i3m-platform/deployments/k8s/ingress/ui-dashboard-dev-ingress.yaml

# Wait for deployment to be ready
echo "⏳ Waiting for development deployment to be ready..."
kubectl rollout status deployment/ui-dashboard-dev -n i3m-platform --timeout=300s

# Get service information
echo "📊 Development Environment Status:"
kubectl get pods -n i3m-platform -l app=ui-dashboard-dev
kubectl get svc -n i3m-platform -l app=ui-dashboard-dev
kubectl get ingress -n i3m-platform -l app=ui-dashboard-dev

echo "✅ UI Dashboard development environment setup completed!"
echo ""
echo "🔗 Access your development environment:"
echo "   Option 1: Port forward - kubectl port-forward svc/ui-dashboard-dev-service 5173:5173 -n i3m-platform"
echo "   Option 2: Ingress - Add '127.0.0.1 dev.i3m.local' to /etc/hosts and visit http://dev.i3m.local"
echo "   Option 3: Localhost - Visit http://localhost/dev"
echo ""
echo "💡 Development features:"
echo "   - Hot reload enabled"
echo "   - File watching enabled"
echo "   - Source code mounted from host"
echo "   - No need to run 'npm run dev' manually!"
