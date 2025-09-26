#!/bin/bash

# I3M Platform Kubernetes Deployment Script
echo "🚀 Deploying I3M Platform to Kubernetes..."

# Check if kubectl is available
if ! command -v kubectl &> /dev/null; then
    echo "❌ kubectl is not installed. Please install kubectl first."
    exit 1
fi

# Check if cluster is accessible
if ! kubectl cluster-info &> /dev/null; then
    echo "❌ Cannot connect to Kubernetes cluster. Please check your kubeconfig."
    exit 1
fi

echo "✅ Kubernetes cluster is accessible"

# Create namespace
echo "📦 Creating namespace..."
kubectl apply -f namespace.yml

# Apply configmaps
echo "⚙️ Applying configuration..."
kubectl apply -f configmaps/app-config.yml

# Deploy databases first
echo "🗄️ Deploying databases..."
kubectl apply -f services/postgres-service.yml
kubectl apply -f services/redis-service.yml
kubectl apply -f services/mongodb-service.yml

# Wait for databases to be ready
echo "⏳ Waiting for databases to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment/postgres -n i3m-platform
kubectl wait --for=condition=available --timeout=300s deployment/redis -n i3m-platform
kubectl wait --for=condition=available --timeout=300s deployment/mongodb -n i3m-platform

# Deploy core services
echo "🔧 Deploying core services..."
kubectl apply -f deployments/api-gateway-deployment.yml
kubectl apply -f deployments/auth-service-deployment.yml
kubectl apply -f deployments/user-service-deployment.yml

# Wait for core services
echo "⏳ Waiting for core services to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment/api-gateway -n i3m-platform
kubectl wait --for=condition=available --timeout=300s deployment/auth-service -n i3m-platform
kubectl wait --for=condition=available --timeout=300s deployment/user-service -n i3m-platform

# Apply ingress
echo "🌐 Applying ingress..."
kubectl apply -f ingress/i3m-platform-ingress.yml

echo "✅ I3M Platform deployed successfully!"
echo ""
echo "📊 Deployment Status:"
kubectl get pods -n i3m-platform
echo ""
echo "🌐 Services:"
kubectl get services -n i3m-platform
echo ""
echo "🔗 Ingress:"
kubectl get ingress -n i3m-platform
echo ""
echo "💡 To access the platform:"
echo "   Add '127.0.0.1 i3m-platform.local' to your /etc/hosts file"
echo "   Then visit: http://i3m-platform.local"
echo ""
echo "📝 Useful commands:"
echo "   kubectl get pods -n i3m-platform"
echo "   kubectl logs -f deployment/api-gateway -n i3m-platform"
echo "   kubectl port-forward service/api-gateway-service 3004:3004 -n i3m-platform"
