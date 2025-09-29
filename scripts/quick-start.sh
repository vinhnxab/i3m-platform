#!/bin/bash

# I3M Platform Quick Start Script
# Script đơn giản để khởi động lại hệ thống

set -e

echo "⚡ I3M Platform Quick Start"
echo "============================"

# Check if we're in the right directory
if [ ! -f "scripts/dev.sh" ]; then
    echo "❌ Please run this script from the i3m-platform root directory"
    exit 1
fi

echo "✅ Running from correct directory"

# Check if Kubernetes is running
if ! kubectl cluster-info &> /dev/null; then
    echo "❌ Kubernetes cluster is not running"
    echo "💡 Please start your Kubernetes cluster first"
    echo "   For Kind: kind create cluster --name i3m-platform"
    echo "   For Minikube: minikube start"
    exit 1
fi

echo "✅ Kubernetes cluster is running"

# Option 1: Start everything on Kubernetes
echo "🚀 Starting I3M Platform on Kubernetes..."
echo "📊 Starting all 36+ services..."
./scripts/start-all-services.sh

echo ""
echo "🎉 I3M Platform is now running!"
echo ""
echo "📱 Access your application:"
echo "   Frontend: http://localhost:5173"
echo "   API Gateway: http://localhost:3000"
echo ""
echo "🔧 Development commands:"
echo "   ./scripts/dev.sh ui           # Start UI development"
echo "   ./scripts/dev.sh k8s-status   # Check system status"
echo "   ./scripts/dev.sh k8s-stop    # Stop system"
echo ""
echo "📚 Documentation:"
echo "   docs/QUICK_START.md           # Quick start guide"
echo "   docs/DEVELOPMENT_AUTOMATION.md # Development automation"
echo "   SYSTEM_STATUS.md              # Current system status"
