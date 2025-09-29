#!/bin/bash

# Development UI management script
set -e

COMMAND=$1

case $COMMAND in
    "start"|"up")
        echo "🚀 Starting UI development environment..."
        /home/vinhnx/i3m-platform/scripts/setup-dev-ui.sh
        ;;
    "stop"|"down")
        echo "🛑 Stopping UI development environment..."
        kubectl delete deployment ui-dashboard-dev -n i3m-platform --ignore-not-found=true
        kubectl delete service ui-dashboard-dev-service -n i3m-platform --ignore-not-found=true
        kubectl delete ingress ui-dashboard-dev-ingress -n i3m-platform --ignore-not-found=true
        echo "✅ UI development environment stopped"
        ;;
    "restart"|"reboot")
        echo "🔄 Restarting UI development environment..."
        /home/vinhnx/i3m-platform/scripts/dev-ui.sh stop
        sleep 5
        /home/vinhnx/i3m-platform/scripts/dev-ui.sh start
        ;;
    "status"|"ps")
        echo "📊 UI development environment status:"
        kubectl get pods -n i3m-platform -l app=ui-dashboard-dev
        kubectl get svc -n i3m-platform -l app=ui-dashboard-dev
        kubectl get ingress -n i3m-platform -l app=ui-dashboard-dev
        ;;
    "logs")
        echo "📋 UI development logs:"
        kubectl logs -f deployment/ui-dashboard-dev -n i3m-platform
        ;;
    "port-forward")
        echo "🔗 Starting port forward to localhost:5173..."
        kubectl port-forward svc/ui-dashboard-dev-service 5173:5173 -n i3m-platform
        ;;
    "shell"|"exec")
        echo "🐚 Opening shell in development container..."
        POD_NAME=$(kubectl get pods -n i3m-platform -l app=ui-dashboard-dev -o jsonpath='{.items[0].metadata.name}')
        kubectl exec -it $POD_NAME -n i3m-platform -- /bin/sh
        ;;
    "help"|*)
        echo "🔧 UI Development Environment Management"
        echo ""
        echo "Usage: $0 <command>"
        echo ""
        echo "Commands:"
        echo "  start, up      - Start development environment"
        echo "  stop, down     - Stop development environment"
        echo "  restart, reboot - Restart development environment"
        echo "  status, ps     - Show environment status"
        echo "  logs           - Show development logs"
        echo "  port-forward   - Port forward to localhost:5173"
        echo "  shell, exec    - Open shell in container"
        echo "  help           - Show this help"
        echo ""
        echo "Examples:"
        echo "  $0 start       # Start development environment"
        echo "  $0 logs        # View logs"
        echo "  $0 port-forward # Access via localhost:5173"
        ;;
esac
