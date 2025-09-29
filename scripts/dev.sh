#!/bin/bash

# Development environment management script
set -e

COMMAND=$1

case $COMMAND in
    "ui"|"frontend")
        echo "🎨 Starting UI development..."
        /home/vinhnx/i3m-platform/scripts/start-dev-ui.sh
        ;;
    "backend"|"api")
        echo "🔧 Starting backend services..."
        echo "Starting API Gateway..."
        cd /home/vinhnx/i3m-platform/core-services/api-gateway && ./api-gateway &
        echo "Starting Auth Service..."
        cd /home/vinhnx/i3m-platform/core-services/auth-service && ./auth-service &
        echo "✅ Backend services started"
        echo "🔗 API Gateway: http://localhost:8080"
        echo "🔗 Auth Service: http://localhost:3004"
        ;;
    "all"|"full")
        echo "🚀 Starting full development environment..."
        echo "Starting backend services..."
        /home/vinhnx/i3m-platform/scripts/dev.sh backend
        sleep 5
        echo "Starting frontend..."
        /home/vinhnx/i3m-platform/scripts/dev.sh ui
        ;;
    "k8s-ui")
        echo "☸️  Starting UI on Kubernetes..."
        /home/vinhnx/i3m-platform/scripts/dev-ui.sh start
        ;;
    "k8s-stop")
        echo "🛑 Stopping Kubernetes UI..."
        /home/vinhnx/i3m-platform/scripts/dev-ui.sh stop
        ;;
    "k8s-status")
        echo "📊 Kubernetes status..."
        /home/vinhnx/i3m-platform/scripts/dev-ui.sh status
        ;;
    "help"|*)
        echo "🔧 Development Environment Management"
        echo ""
        echo "Usage: $0 <command>"
        echo ""
        echo "Commands:"
        echo "  ui, frontend     - Start UI development server (direct)"
        echo "  backend, api     - Start backend services"
        echo "  all, full        - Start both frontend and backend"
        echo "  k8s-ui           - Start UI on Kubernetes"
        echo "  k8s-stop         - Stop Kubernetes UI"
        echo "  k8s-status       - Check Kubernetes status"
        echo "  help             - Show this help"
        echo ""
        echo "Examples:"
        echo "  $0 ui            # Start UI development server"
        echo "  $0 backend       # Start backend services"
        echo "  $0 all           # Start everything"
        echo "  $0 k8s-ui        # Start UI on Kubernetes"
        echo ""
        echo "💡 Quick start:"
        echo "  1. Run '$0 backend' in one terminal"
        echo "  2. Run '$0 ui' in another terminal"
        echo "  3. Open http://localhost:5173"
        ;;
esac
