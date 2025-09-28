# I3M Platform - Docker CLI Management
# Sử dụng hoàn toàn Docker CLI thay vì Docker Desktop

.PHONY: help start stop restart status logs build clean health core erp analytics

# Default target
help:
	@echo "I3M Platform - Docker CLI Management"
	@echo "==================================="
	@echo ""
	@echo "Available commands:"
	@echo "  make start       - Start all services"
	@echo "  make stop        - Stop all services"
	@echo "  make restart     - Restart all services"
	@echo "  make status      - Show service status"
	@echo "  make logs        - Show logs for all services"
	@echo "  make build       - Build all services"
	@echo "  make clean       - Clean up Docker resources"
	@echo "  make health      - Check service health"
	@echo "  make core        - Start only core services"
	@echo "  make erp         - Start ERP services"
	@echo "  make analytics   - Start analytics services"
	@echo ""

# Start all services
start:
	@echo "🚀 Starting all I3M services..."
	docker compose up -d
	@echo "✅ All services started"

# Stop all services
stop:
	@echo "🛑 Stopping all I3M services..."
	docker compose down
	@echo "✅ All services stopped"

# Restart all services
restart:
	@echo "🔄 Restarting all I3M services..."
	docker compose restart
	@echo "✅ All services restarted"

# Show service status
status:
	@echo "📊 I3M Platform Service Status:"
	@echo ""
	docker compose ps
	@echo ""
	@echo "Running containers:"
	docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep i3m

# Show logs
logs:
	@echo "📋 Showing logs for all services..."
	docker compose logs -f

# Build all services
build:
	@echo "🔨 Building all I3M services..."
	docker compose build --parallel
	@echo "✅ All services built"

# Clean up Docker resources
clean:
	@echo "🧹 Cleaning up Docker resources..."
	docker compose down
	docker container prune -f
	docker image prune -f
	docker volume prune -f
	docker network prune -f
	@echo "✅ Docker cleanup completed"

# Check service health
health:
	@echo "🏥 Checking service health..."
	@./manage-services.sh health

# Start core services only
core:
	@echo "🔧 Starting core services..."
	docker compose up -d postgres redis mongodb
	sleep 5
	docker compose up -d api-gateway auth-service user-service
	@echo "✅ Core services started"

# Start ERP services
erp:
	@echo "💼 Starting ERP services..."
	docker compose up -d finance-service crm-service
	@echo "✅ ERP services started"

# Start analytics services
analytics:
	@echo "📈 Starting analytics services..."
	docker compose up -d analytics-service ai-service
	@echo "✅ Analytics services started"

# Quick setup (build + start)
setup: build start
	@echo "🎉 I3M Platform setup completed!"

# Full reset (clean + build + start)
reset: clean build start
	@echo "🔄 I3M Platform reset completed!"