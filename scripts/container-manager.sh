#!/bin/bash

# Container Manager Script
# Quản lý containers một cách thông minh

ACTION=$1
SERVICE_NAME=$2

case $ACTION in
    "list")
        echo "📋 Current containers:"
        docker ps -a --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}\t{{.CreatedAt}}"
        ;;
    "stop")
        if [ -z "$SERVICE_NAME" ]; then
            echo "❌ Usage: $0 stop <service-name>"
            echo "Available services:"
            docker ps --format "{{.Names}}" | grep -v "CONTAINER"
            exit 1
        fi
        echo "⏹️  Stopping $SERVICE_NAME..."
        docker stop "$SERVICE_NAME"
        ;;
    "start")
        if [ -z "$SERVICE_NAME" ]; then
            echo "❌ Usage: $0 start <service-name>"
            echo "Available stopped containers:"
            docker ps -a --filter "status=exited" --format "{{.Names}}"
            exit 1
        fi
        echo "▶️  Starting $SERVICE_NAME..."
        docker start "$SERVICE_NAME"
        ;;
    "restart")
        if [ -z "$SERVICE_NAME" ]; then
            echo "❌ Usage: $0 restart <service-name>"
            exit 1
        fi
        echo "🔄 Restarting $SERVICE_NAME..."
        docker restart "$SERVICE_NAME"
        ;;
    "cleanup-old")
        echo "🧹 Cleaning up containers stopped more than 7 days ago..."
        docker container ls -a --filter "status=exited" --format "table {{.ID}}\t{{.Status}}\t{{.Names}}" | \
        grep -v "CONTAINER" | \
        awk '$2 ~ /Exited \([0-9]+\) [0-9]+ days ago/ {print $1}' | \
        xargs -r docker rm 2>/dev/null || true
        echo "✅ Old containers cleaned up"
        ;;
    "cleanup-all")
        echo "⚠️  This will remove ALL stopped containers. Are you sure?"
        read -p "Continue? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            docker container prune -f
            echo "✅ All stopped containers removed"
        else
            echo "❌ Cancelled"
        fi
        ;;
    "status")
        echo "📊 Container status:"
        echo "Running: $(docker ps -q | wc -l)"
        echo "Stopped: $(docker ps -a --filter "status=exited" -q | wc -l)"
        echo "Total: $(docker ps -a -q | wc -l)"
        ;;
    *)
        echo "🔧 Container Manager"
        echo ""
        echo "Usage: $0 <action> [service-name]"
        echo ""
        echo "Actions:"
        echo "  list                    - List all containers"
        echo "  stop <service>          - Stop a specific container"
        echo "  start <service>         - Start a stopped container"
        echo "  restart <service>       - Restart a container"
        echo "  cleanup-old            - Remove containers stopped > 7 days"
        echo "  cleanup-all            - Remove ALL stopped containers"
        echo "  status                 - Show container statistics"
        echo ""
        echo "Examples:"
        echo "  $0 list"
        echo "  $0 stop commerce-service"
        echo "  $0 start commerce-service"
        echo "  $0 cleanup-old"
        ;;
esac
