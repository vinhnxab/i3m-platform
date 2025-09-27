# I3M Platform - Makefile
# Commands for building and managing the platform

.PHONY: help clean build build-all build-service start stop restart status logs

# Default target
help:
	@echo "I3M Platform - Available Commands"
	@echo "================================="
	@echo ""
	@echo "Build Commands:"
	@echo "  make build          - Build all services with auto cleanup"
	@echo "  make build-all        - Build all services with full cleanup"
	@echo "  make build-service    - Build a specific service"
	@echo "  make build-core       - Build only core services"
	@echo ""
	@echo "Service Management:"
	@echo "  make start            - Start all services"
	@echo "  make stop             - Stop all services"
	@echo "  make restart          - Restart all services"
	@echo "  make start-core       - Start only core services"
	@echo ""
	@echo "Cleanup Commands:"
	@echo "  make clean            - Clean up Docker resources"
	@echo "  make clean-all        - Clean up everything including build cache"
	@echo "  make clean-service    - Clean up specific service"
	@echo ""
	@echo "Monitoring:"
	@echo "  make status           - Show service status"
	@echo "  make logs             - Show logs for all services"
	@echo "  make logs-service     - Show logs for specific service"
	@echo "  make disk-usage       - Show disk usage"
	@echo ""
	@echo "Examples:"
	@echo "  make build-service SERVICE=auth-service"
	@echo "  make logs-service SERVICE=auth-service"
	@echo "  make clean-service SERVICE=auth-service"

# Build commands
build:
	@echo "Building all services with auto cleanup..."
	@./scripts/clean-build.sh build

build-all:
	@echo "Building all services with full cleanup..."
	@./scripts/clean-build.sh build-all

build-service:
	@if [ -z "$(SERVICE)" ]; then \
		echo "Error: SERVICE is required. Usage: make build-service SERVICE=auth-service"; \
		exit 1; \
	fi
	@echo "Building service: $(SERVICE)"
	@./scripts/build-service.sh $(SERVICE) --no-cache --pull

build-core:
	@echo "Building core services..."
	@./scripts/clean-build.sh build postgres redis auth-service api-gateway

# Service management
start:
	@echo "Starting all services..."
	@docker-compose up -d

stop:
	@echo "Stopping all services..."
	@docker-compose down

restart:
	@echo "Restarting all services..."
	@docker-compose restart

start-core:
	@echo "Starting core services..."
	@docker-compose up -d postgres redis auth-service api-gateway

# Cleanup commands
clean:
	@echo "Cleaning up Docker resources..."
	@./scripts/clean-build.sh clean

clean-all:
	@echo "Cleaning up everything..."
	@./scripts/clean-build.sh clean-all

clean-service:
	@if [ -z "$(SERVICE)" ]; then \
		echo "Error: SERVICE is required. Usage: make clean-service SERVICE=auth-service"; \
		exit 1; \
	fi
	@echo "Cleaning up service: $(SERVICE)"
	@docker-compose stop $(SERVICE) 2>/dev/null || true
	@docker-compose rm -f $(SERVICE) 2>/dev/null || true
	@docker images --filter "reference=i3m-platform-$(SERVICE)" --format "table {{.Repository}}:{{.Tag}}\t{{.ID}}" | tail -n +2 | while read line; do \
		if [ ! -z "$$line" ]; then \
			image_id=$$(echo "$$line" | awk '{print $$2}'); \
			docker rmi "$$image_id" 2>/dev/null || true; \
		fi; \
	done

# Monitoring commands
status:
	@echo "Service status:"
	@docker-compose ps

logs:
	@echo "Showing logs for all services..."
	@docker-compose logs -f

logs-service:
	@if [ -z "$(SERVICE)" ]; then \
		echo "Error: SERVICE is required. Usage: make logs-service SERVICE=auth-service"; \
		exit 1; \
	fi
	@echo "Showing logs for service: $(SERVICE)"
	@docker-compose logs -f $(SERVICE)

disk-usage:
	@echo "Docker disk usage:"
	@docker system df
	@echo ""
	@echo "System disk usage:"
	@df -h /

# Development commands
dev:
	@echo "Starting development environment..."
	@docker-compose up -d postgres redis
	@echo "Databases started. You can now run individual services locally."

# Quick commands for common tasks
quick-build:
	@echo "Quick build (core services only)..."
	@make clean
	@make build-core

quick-start:
	@echo "Quick start (core services only)..."
	@make start-core

# Database commands
db-reset:
	@echo "Resetting databases..."
	@docker-compose down -v
	@docker-compose up -d postgres redis
	@echo "Databases reset and started."

# Frontend commands
frontend-dev:
	@echo "Starting frontend development server..."
	@cd ui/master-dashboard && npm run dev

frontend-build:
	@echo "Building frontend..."
	@cd ui/master-dashboard && npm run build

# Test commands
test:
	@echo "Running tests..."
	@./scripts/test-services.sh

# Health check
health:
	@echo "Checking service health..."
	@curl -f http://localhost:3008/health || echo "Auth service not responding"
	@curl -f http://localhost:3004/health || echo "API Gateway not responding"
	@curl -f http://localhost:3009/health || echo "User service not responding"
