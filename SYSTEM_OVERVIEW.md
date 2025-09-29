.
├── analytics-services
│   ├── ai-service
│   │   ├── app
│   │   ├── Dockerfile
│   │   ├── docs
│   │   ├── requirements.txt
│   │   └── tests
│   ├── analytics-service
│   │   ├── Dockerfile
│   │   ├── pom.xml
│   │   ├── src
│   │   └── target
│   ├── ml-pipeline-service
│   │   ├── app
│   │   ├── Dockerfile
│   │   ├── docs
│   │   ├── requirements.txt
│   │   └── tests
│   └── user-analytics-service
│       ├── app
│       ├── artifacts
│       ├── Dockerfile
│       ├── logs
│       ├── requirements.txt
│       ├── uploads
│       └── workspace
├── BUILD_GUIDE.md
├── cleanup-localStorage.js
├── clear-localStorage.js
├── config
│   └── environment.md
├── content-services
│   ├── content-service
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   ├── package-lock.json
│   │   ├── src
│   │   └── uploads
│   ├── media-service
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   ├── package-lock.json
│   │   ├── src
│   │   └── uploads
│   └── metadata-service
│       ├── app
│       ├── Dockerfile
│       └── requirements.txt
├── core-services
│   ├── api-gateway
│   │   ├── api-gateway
│   │   ├── Dockerfile
│   │   ├── go.mod
│   │   ├── go.sum
│   │   ├── main.go
│   │   ├── middleware.go
│   │   └── proxy.go
│   ├── auth-service
│   │   ├── auth-service
│   │   ├── database.go
│   │   ├── Dockerfile
│   │   ├── go.mod
│   │   ├── go.sum
│   │   ├── handlers.go
│   │   ├── main.go
│   │   ├── middleware.go
│   │   └── models.go
│   └── user-service
│       ├── Dockerfile
│       ├── logs
│       ├── pom.xml
│       ├── src
│       └── target
├── data
│   ├── elasticsearch
│   ├── mongodb
│   ├── postgres
│   ├── redis
│   └── timescaledb
├── deployments
│   └── k8s
│       ├── configmaps
│       ├── deployments
│       ├── ingress
│       ├── namespace.yaml
│       ├── secrets
│       └── services
├── devops
│   ├── kubernetes
│   │   ├── configmaps
│   │   ├── deployments
│   │   ├── deploy.sh
│   │   ├── ingress
│   │   ├── namespace.yml
│   │   ├── secrets
│   │   └── services
│   ├── monitoring
│   │   ├── grafana-dashboards
│   │   └── prometheus.yml
│   ├── README.md
│   └── terraform
│       ├── iam.tf
│       ├── main.tf
│       └── variables.tf
├── docker-compose
├── docker-compose.yml
├── docker-setup.sh
├── docs
│   ├── DEVELOPMENT_AUTOMATION.md
│   ├── docker-k8s-improvements.md
│   ├── go-naming-conventions.md
│   ├── multi-group-api-guide.md
│   ├── QUICK_START.md
│   ├── README.md
│   ├── redis-architecture.md
│   └── redis-quick-reference.md
├── erp-services
│   ├── crm-service
│   │   ├── Dockerfile
│   │   ├── pom.xml
│   │   ├── src
│   │   └── target
│   ├── ecommerce-service
│   │   ├── Dockerfile
│   │   ├── pom.xml
│   │   ├── src
│   │   └── target
│   ├── finance-service
│   │   ├── Dockerfile
│   │   ├── pom.xml
│   │   ├── src
│   │   └── target
│   ├── hrm-service
│   │   ├── Dockerfile
│   │   ├── pom.xml
│   │   ├── src
│   │   └── target
│   ├── hr-service
│   │   └── src
│   ├── integration-service
│   │   ├── Dockerfile
│   │   ├── pom.xml
│   │   ├── src
│   │   └── target
│   ├── inventory-service
│   │   ├── cmd
│   │   ├── Dockerfile
│   │   ├── docs
│   │   ├── go.mod
│   │   ├── go.sum
│   │   ├── internal
│   │   ├── inventory-service
│   │   ├── pkg
│   │   └── scripts
│   ├── procurement-service
│   │   ├── Dockerfile
│   │   ├── pom.xml
│   │   ├── src
│   │   └── target
│   └── report-service
│       └── src
├── GETTING_STARTED.md
├── health-check.sh
├── I3M_PLATFORM_DOCUMENTATION.markdown
├── industry-services
│   ├── agriculture-service
│   │   ├── Dockerfile
│   │   ├── pom.xml
│   │   ├── src
│   │   └── target
│   └── healthcare-service
│       ├── Dockerfile
│       ├── pom.xml
│       ├── src
│       └── target
├── infrastructure-services
│   ├── cost-optimization-service
│   │   ├── cmd
│   │   ├── cost-optimization-service
│   │   ├── Dockerfile
│   │   ├── go.mod
│   │   ├── go.sum
│   │   ├── internal
│   │   └── pkg
│   ├── load-balancer-service
│   │   ├── cmd
│   │   ├── Dockerfile
│   │   ├── go.mod
│   │   ├── go.sum
│   │   ├── internal
│   │   ├── load-balancer-service
│   │   └── pkg
│   ├── observability-service
│   │   ├── app
│   │   ├── Dockerfile
│   │   └── requirements.txt
│   ├── secrets-management-service
│   │   ├── cmd
│   │   ├── Dockerfile
│   │   ├── go.mod
│   │   ├── go.sum
│   │   ├── internal
│   │   ├── pkg
│   │   └── secrets-management-service
│   └── security-service
│       ├── cmd
│       ├── Dockerfile
│       ├── go.mod
│       ├── go.sum
│       ├── internal
│       ├── pkg
│       └── security-service
├── integration-services
│   ├── api-documentation-service
│   │   ├── Dockerfile
│   │   ├── docs
│   │   ├── package.json
│   │   ├── package-lock.json
│   │   ├── public
│   │   └── src
│   ├── currency-exchange-service
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   ├── package-lock.json
│   │   ├── src
│   │   └── tests
│   └── integration-service
│       ├── Dockerfile
│       ├── pom.xml
│       ├── src
│       └── target
├── k8s-improvements
│   ├── networking-improvements.yaml
│   ├── persistent-storage.yaml
│   └── user-service-fixed.yaml
├── LOGIN_INTEGRATION_SUMMARY.md
├── logs
├── Makefile
├── marketplace-services
│   ├── installation-service
│   │   ├── cmd
│   │   ├── Dockerfile
│   │   ├── go.mod
│   │   ├── go.sum
│   │   ├── installation-service
│   │   └── internal
│   ├── preview-service
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   ├── package-lock.json
│   │   ├── public
│   │   └── src
│   └── template-marketplace-service
│       ├── app
│       ├── Dockerfile
│       ├── package.json
│       ├── package-lock.json
│       ├── requirements.txt
│       └── src
├── monitoring
│   ├── grafana
│   └── prometheus
├── PROJECT_STRUCTURE.md
├── README.md
├── scripts
│   ├── build-all-services.sh
│   ├── build-all.sh
│   ├── build-and-deploy.sh
│   ├── build-service.sh
│   ├── build-ui.sh
│   ├── check-and-build-services.sh
│   ├── clean-build.sh
│   ├── deploy-ui.sh
│   ├── dev.sh
│   ├── dev-ui.sh
│   ├── docker-k8s-monitor.sh
│   ├── quick-start.sh
│   ├── rebuild-service.sh
│   ├── restart-system.sh
│   ├── setup-dev-ui.sh
│   ├── start-all-services.sh
│   ├── start-core-services.sh
│   ├── start-dev-ui.sh
│   ├── stop-services.sh
│   └── test-services.sh
├── security-improvements.yaml
├── setup-tenant-and-user.sql
├── setup-user-primary-group-fixed.sql
├── setup-user-primary-group.sql
├── shared
│   ├── mongodb
│   │   └── init
│   ├── monitoring
│   │   ├── grafana
│   │   └── prometheus.yml
│   └── sql
│       ├── init
│       └── migrations
├── shared-services
│   ├── billing-service
│   │   ├── Dockerfile
│   │   ├── pom.xml
│   │   ├── src
│   │   └── target
│   ├── notification-service
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   ├── package-lock.json
│   │   ├── public
│   │   └── src
│   └── workflow-service
│       ├── Dockerfile
│       ├── pom.xml
│       ├── src
│       └── target
├── STARTUP_GUIDE.md
├── SYSTEM_STATUS.md
├── terraform
├── test-backend-login.sh
├── test-connectivity.sh
├── test-login-fresh.js
├── test-migration.html
└── ui
    └── master-dashboard
        ├── AUTH_SETUP.md
        ├── Dockerfile
        ├── Dockerfile.dev
        ├── env.example
        ├── index.html
        ├── mock-data
        ├── nginx.conf
        ├── package.json
        ├── package-lock.json
        ├── public
        ├── README.md
        ├── src
        ├── src_backup_before_migration.zip
        ├── tsconfig.node.json
        └── vite.config.ts

166 directories, 174 files
--- ./core-services/api-gateway/Dockerfile ---
# API Gateway Dockerfile
FROM golang:1.21-alpine AS builder

WORKDIR /app

# Install dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy source code
COPY . .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .

# Final stage
FROM alpine:latest

RUN apk --no-cache add ca-certificates tzdata
WORKDIR /root/

# Copy the binary from builder stage
COPY --from=builder /app/main .

# Expose port
EXPOSE 3004

# Run the application
CMD ["./main"]
--- ./core-services/auth-service/Dockerfile ---
# Auth Service Dockerfile
FROM golang:1.23-alpine AS builder

WORKDIR /app

# Install dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy source code
COPY . .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .

# Final stage
FROM alpine:latest

RUN apk --no-cache add ca-certificates tzdata
WORKDIR /root/

# Copy the binary from builder stage
COPY --from=builder /app/main .

# Expose port
EXPOSE 3008

# Run the application
CMD ["./main"]
--- ./core-services/user-service/Dockerfile ---
# User Service Dockerfile
FROM maven:3.8.4-openjdk-17-slim AS builder

WORKDIR /app

# Copy pom.xml and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy source code and build
COPY src src
RUN mvn clean package -DskipTests

# Final stage
FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

# Install curl for health checks
RUN apk --no-cache add curl

# Copy the JAR file from builder stage
COPY --from=builder /app/target/*.jar app.jar

# Copy application.properties
COPY src/main/resources/application.properties application.properties

# Create a simple application.properties with Redis configuration
RUN echo "spring.redis.host=redis" > /app/application-redis.properties && \
    echo "spring.redis.port=6379" >> /app/application-redis.properties && \
    echo "spring.redis.password=i3m_password" >> /app/application-redis.properties && \
    echo "spring.redis.database=0" >> /app/application-redis.properties && \
    echo "server.port=3009" >> /app/application-redis.properties

# Create non-root user
RUN addgroup -g 1001 -S appgroup && \
    adduser -S appuser -u 1001 -G appgroup
USER appuser

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3009/actuator/health || exit 1

EXPOSE 3009
CMD ["java", "-jar", "app.jar", "--spring.redis.host=redis", "--spring.redis.port=6379", "--spring.redis.password=i3m_password", "--spring.redis.database=0", "--server.port=3009"]--- ./industry-services/healthcare-service/Dockerfile ---
# Multi-stage build for Java Spring Boot
FROM eclipse-temurin:17-jdk-alpine AS builder

WORKDIR /app

# Copy Maven files
COPY pom.xml .
COPY src src

# Install Maven
RUN apk add --no-cache maven

# Build the application
RUN mvn clean package -DskipTests

# Production stage
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Install curl for health checks
RUN apk add --no-cache curl

# Create non-root user
RUN addgroup -g 1001 -S healthcare && \
    adduser -S healthcare -u 1001 -G healthcare

# Copy the built JAR
COPY --from=builder /app/target/healthcare-service-*.jar app.jar

# Change ownership
RUN chown -R healthcare:healthcare /app

USER healthcare

EXPOSE 3034

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:3034/actuator/health || exit 1

CMD ["java", "-jar", "app.jar"]
--- ./industry-services/agriculture-service/Dockerfile ---
# Multi-stage build for Java Spring Boot
FROM eclipse-temurin:17-jdk-alpine AS builder

WORKDIR /app

# Copy Maven files
COPY pom.xml .
COPY src src

# Install Maven
RUN apk add --no-cache maven

# Build the application
RUN mvn clean package -DskipTests

# Production stage
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Install curl for health checks
RUN apk add --no-cache curl

# Create non-root user
RUN addgroup -g 1001 -S agriculture && \
    adduser -S agriculture -u 1001 -G agriculture

# Copy the built JAR
COPY --from=builder /app/target/agriculture-service-*.jar app.jar

# Change ownership
RUN chown -R agriculture:agriculture /app

USER agriculture

EXPOSE 3035

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:3035/actuator/health || exit 1

CMD ["java", "-jar", "app.jar"]
--- ./ui/master-dashboard/Dockerfile.dev ---
# Development Dockerfile with hot reload
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Expose Vite dev server port
EXPOSE 5173

# Start development server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
--- ./ui/master-dashboard/Dockerfile ---
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
--- ./marketplace-services/installation-service/Dockerfile ---
# Multi-stage build for Go
FROM golang:1.21-alpine AS builder

WORKDIR /app

# Copy go mod files
COPY go.mod go.sum ./
RUN go mod download

# Copy source code
COPY . .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main ./cmd/main.go

# Production stage
FROM alpine:latest

WORKDIR /app

# Install curl for health checks
RUN apk add --no-cache curl

# Create non-root user
RUN addgroup -g 1001 -S installation && \
    adduser -S installation -u 1001 -G installation

# Copy the binary
COPY --from=builder /app/main .

# Change ownership
RUN chown -R installation:installation /app

USER installation

EXPOSE 3061

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
    CMD curl -f http://localhost:3061/api/v1/health || exit 1

CMD ["./main"]
--- ./marketplace-services/preview-service/Dockerfile ---
# Multi-stage build for Node.js
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install curl for health checks
RUN apk add --no-cache curl

# Create non-root user
RUN addgroup -g 1001 -S preview && \
    adduser -S preview -u 1001 -G preview

# Copy dependencies from builder
COPY --from=builder /app/node_modules ./node_modules

# Copy application code
COPY . .

# Change ownership
RUN chown -R preview:preview /app

USER preview

EXPOSE 3062

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
    CMD curl -f http://localhost:3062/health || exit 1

CMD ["npm", "start"]
--- ./marketplace-services/template-marketplace-service/Dockerfile ---
FROM python:3.11-slim
WORKDIR /app
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*
RUN adduser --system --group marketplace
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
RUN chown -R marketplace:marketplace /app
USER marketplace
EXPOSE 3028
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3028/health || exit 1
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "3028"]--- ./integration-services/api-documentation-service/Dockerfile ---
# Multi-stage build for Node.js
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install curl for health checks
RUN apk add --no-cache curl

# Create non-root user
RUN addgroup -g 1001 -S apidocs && \
    adduser -S apidocs -u 1001 -G apidocs

# Copy dependencies from builder
COPY --from=builder /app/node_modules ./node_modules

# Copy application code
COPY . .

# Change ownership
RUN chown -R apidocs:apidocs /app

USER apidocs

EXPOSE 3050

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
    CMD curl -f http://localhost:3050/health || exit 1

CMD ["npm", "start"]
--- ./integration-services/currency-exchange-service/Dockerfile ---
# Multi-stage build for Node.js
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install curl for health checks
RUN apk add --no-cache curl

# Create non-root user
RUN addgroup -g 1001 -S currency && \
    adduser -S currency -u 1001 -G currency

# Copy dependencies from builder
COPY --from=builder /app/node_modules ./node_modules

# Copy application code
COPY . .

# Change ownership
RUN chown -R currency:currency /app

USER currency

EXPOSE 3052

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
    CMD curl -f http://localhost:3052/health || exit 1

CMD ["npm", "start"]
--- ./integration-services/integration-service/Dockerfile ---
# Multi-stage build for Java Spring Boot
FROM eclipse-temurin:17-jdk-alpine AS builder

WORKDIR /app

# Copy Maven files
COPY pom.xml .
COPY src src

# Install Maven
RUN apk add --no-cache maven

# Build the application
RUN mvn clean package -DskipTests

# Production stage
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Install curl for health checks
RUN apk add --no-cache curl

# Create non-root user
RUN addgroup -g 1001 -S integration && \
    adduser -S integration -u 1001 -G integration

# Copy the built JAR
COPY --from=builder /app/target/integration-service-*.jar app.jar

# Change ownership
RUN chown -R integration:integration /app

USER integration

EXPOSE 3053

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:3053/api/v1/integration/health || exit 1

CMD ["java", "-jar", "app.jar"]
--- ./analytics-services/user-analytics-service/Dockerfile ---
# User Analytics Service Dockerfile
FROM python:3.11-slim as base

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONHASHSEED=random \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    git \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN groupadd -r useranalytics && useradd -r -g useranalytics useranalytics

# Set working directory
WORKDIR /app

# Development stage
FROM base as development

# Copy requirements first for better caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY . .

# Change ownership to useranalytics user
RUN chown -R useranalytics:useranalytics /app

# Switch to non-root user
USER useranalytics

# Expose port
EXPOSE 3019

# Command for development
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "3019", "--reload"]

# Production stage
FROM base as production

# Copy requirements first for better caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY . .

# Create necessary directories and set permissions
RUN mkdir -p logs workspace artifacts uploads \
    && chown -R useranalytics:useranalytics /app

# Switch to non-root user
USER useranalytics

# Expose port
EXPOSE 3019

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3019/health || exit 1

# Command for production
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "3019", "--workers", "4"]
--- ./analytics-services/analytics-service/Dockerfile ---
# Multi-stage build for Java Spring Boot
FROM eclipse-temurin:17-jdk-alpine AS builder

WORKDIR /app

# Copy Maven files
COPY pom.xml .
COPY src src

# Install Maven
RUN apk add --no-cache maven

# Build the application
RUN mvn clean package -DskipTests

# Production stage
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Install curl for health checks
RUN apk add --no-cache curl

# Create non-root user
RUN addgroup -g 1001 -S analytics && \
    adduser -S analytics -u 1001 -G analytics

# Copy the built JAR
COPY --from=builder /app/target/analytics-service-*.jar app.jar

# Change ownership
RUN chown -R analytics:analytics /app

USER analytics

EXPOSE 3019

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:3019/api/v1/analytics/health || exit 1

CMD ["java", "-jar", "app.jar"]
--- ./analytics-services/ai-service/Dockerfile ---
# Multi-stage build for AI Service
FROM python:3.11-slim as base

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN groupadd -r ai && useradd -r -g ai ai

# Set working directory
WORKDIR /app

# Copy requirements first for better caching
COPY requirements.txt .

# Install Python dependencies
FROM base as dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Production stage
FROM dependencies as production

# Copy application code
COPY . .

# Create necessary directories and set permissions
RUN mkdir -p logs models uploads \
    && chown -R ai:ai /app

# Switch to non-root user
USER ai

# Expose port
EXPOSE 3017

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3017/health || exit 1

# Run the application
CMD ["python", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "3017"]
--- ./analytics-services/ml-pipeline-service/Dockerfile ---
# Multi-stage build for ML Pipeline Service
FROM python:3.11-slim as base

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    build-essential \
    libpq-dev \
    git \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN groupadd -r mlpipeline && useradd -r -g mlpipeline mlpipeline

# Set working directory
WORKDIR /app

# Copy requirements first for better caching
COPY requirements.txt .

# Install Python dependencies
FROM base as dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Production stage
FROM dependencies as production

# Copy application code
COPY . .

# Create necessary directories and set permissions
RUN mkdir -p logs workspace artifacts uploads \
    && chown -R mlpipeline:mlpipeline /app

# Switch to non-root user
USER mlpipeline

# Expose port
EXPOSE 3018

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3018/health || exit 1

# Run the application
CMD ["python", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "3018"]
--- ./content-services/content-service/Dockerfile ---
# Content Service Dockerfile
FROM node:18-alpine AS base

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apk add --no-cache \
    dumb-init \
    curl

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S content -u 1001

# Development stage
FROM base AS development

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Create logs directory
RUN mkdir -p logs uploads && \
    chown -R content:nodejs /app

# Switch to non-root user
USER content

# Expose port
EXPOSE 3022

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3022/health || exit 1

# Start command
CMD ["dumb-init", "node", "src/app.js"]

# Production stage
FROM base AS production

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Create necessary directories and set permissions
RUN mkdir -p logs uploads && \
    chown -R content:nodejs /app

# Switch to non-root user
USER content

# Expose port
EXPOSE 3022

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3022/health || exit 1

# Start command
CMD ["dumb-init", "node", "src/app.js"]
--- ./content-services/media-service/Dockerfile ---
# Media Service Dockerfile
FROM node:18-alpine AS base

WORKDIR /app

RUN apk add --no-cache dumb-init curl

RUN addgroup -g 1001 -S nodejs && \
    adduser -S media -u 1001

FROM base AS production

COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

COPY . .

RUN mkdir -p logs uploads && \
    chown -R media:nodejs /app

USER media

EXPOSE 3021

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3021/health || exit 1

CMD ["dumb-init", "node", "src/app.js"]
--- ./content-services/metadata-service/Dockerfile ---
FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

RUN adduser --system --group metadata

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN chown -R metadata:metadata /app

USER metadata

EXPOSE 3022

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3022/health || exit 1

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "3022"]
--- ./shared-services/notification-service/Dockerfile ---
# Multi-stage build for Node.js
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install curl for health checks
RUN apk add --no-cache curl

# Create non-root user
RUN addgroup -g 1001 -S notification && \
    adduser -S notification -u 1001 -G notification

# Copy dependencies from builder
COPY --from=builder /app/node_modules ./node_modules

# Copy application code
COPY . .

# Change ownership
RUN chown -R notification:notification /app

USER notification

EXPOSE 3070

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
    CMD curl -f http://localhost:3070/health || exit 1

CMD ["npm", "start"]
--- ./shared-services/billing-service/Dockerfile ---
# Multi-stage build for Java Spring Boot
FROM eclipse-temurin:17-jdk-alpine AS builder

WORKDIR /app

COPY pom.xml .
COPY src src

RUN apk add --no-cache maven && mvn clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
RUN apk add --no-cache curl

RUN addgroup -g 1001 -S billing && adduser -S billing -u 1001 -G billing

COPY --from=builder /app/target/billing-service-*.jar app.jar
RUN chown -R billing:billing /app
USER billing

EXPOSE 3072
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:3072/api/v1/billing/health || exit 1

CMD ["java", "-jar", "app.jar"]


--- ./shared-services/workflow-service/Dockerfile ---
# Multi-stage build for Java Spring Boot
FROM eclipse-temurin:17-jdk-alpine AS builder

WORKDIR /app

COPY pom.xml .
COPY src src

RUN apk add --no-cache maven && mvn clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
RUN apk add --no-cache curl

RUN addgroup -g 1001 -S workflow && adduser -S workflow -u 1001 -G workflow

COPY --from=builder /app/target/workflow-service-*.jar app.jar
RUN chown -R workflow:workflow /app
USER workflow

EXPOSE 3071
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:3071/api/v1/workflow/health || exit 1

CMD ["java", "-jar", "app.jar"]


--- ./infrastructure-services/cost-optimization-service/Dockerfile ---
# Multi-stage build for Go
FROM golang:1.21-alpine AS builder

WORKDIR /app

RUN apk add --no-cache git

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main ./cmd/main.go

# Production stage
FROM alpine:latest

WORKDIR /app

RUN apk --no-cache add ca-certificates curl

RUN addgroup -g 1001 -S costopt && \
    adduser -S costopt -u 1001 -G costopt

COPY --from=builder /app/main .
RUN chown -R costopt:costopt /app

USER costopt

EXPOSE 3042

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3042/health || exit 1

CMD ["./main"]
--- ./infrastructure-services/load-balancer-service/Dockerfile ---
# Multi-stage build for Go
FROM golang:1.21-alpine AS builder

WORKDIR /app

RUN apk add --no-cache git

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main ./cmd/main.go

# Production stage
FROM alpine:latest

WORKDIR /app

RUN apk --no-cache add ca-certificates curl

RUN addgroup -g 1001 -S loadbalancer && \
    adduser -S loadbalancer -u 1001 -G loadbalancer

COPY --from=builder /app/main .
RUN chown -R loadbalancer:loadbalancer /app

USER loadbalancer

EXPOSE 3043

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3043/health || exit 1

CMD ["./main"]
--- ./infrastructure-services/observability-service/Dockerfile ---
FROM python:3.11-slim
WORKDIR /app
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*
RUN adduser --system --group observability
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
RUN chown -R observability:observability /app
USER observability
EXPOSE 3024
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3024/health || exit 1
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "3024"]
--- ./infrastructure-services/secrets-management-service/Dockerfile ---
# Multi-stage build for Go
FROM golang:1.21-alpine AS builder

WORKDIR /app

RUN apk add --no-cache git

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main ./cmd/main.go

# Production stage
FROM alpine:latest

WORKDIR /app

RUN apk --no-cache add ca-certificates curl

RUN addgroup -g 1001 -S secrets && \
    adduser -S secrets -u 1001 -G secrets

COPY --from=builder /app/main .
RUN chown -R secrets:secrets /app

USER secrets

EXPOSE 3044

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3044/health || exit 1

CMD ["./main"]
--- ./infrastructure-services/security-service/Dockerfile ---
# Multi-stage build for Go
FROM golang:1.21-alpine AS builder

WORKDIR /app

# Install git for go mod download
RUN apk add --no-cache git

# Copy go mod files
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy source code
COPY . .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main ./cmd/main.go

# Production stage
FROM alpine:latest

WORKDIR /app

# Install ca-certificates and curl for health checks
RUN apk --no-cache add ca-certificates curl

# Create non-root user
RUN addgroup -g 1001 -S security && \
    adduser -S security -u 1001 -G security

# Copy the binary from builder
COPY --from=builder /app/main .

# Change ownership
RUN chown -R security:security /app

USER security

EXPOSE 3040

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3040/health || exit 1

CMD ["./main"]
--- ./erp-services/ecommerce-service/Dockerfile ---
# Multi-stage build for Java Spring Boot
FROM eclipse-temurin:17-jdk-alpine AS builder

WORKDIR /app

# Copy Maven files
COPY pom.xml .
COPY src src

# Install Maven
RUN apk add --no-cache maven

# Build the application
RUN mvn clean package -DskipTests

# Production stage
FROM eclipse-temurin:17-jre-alpine AS production

WORKDIR /app

# Install curl for health checks
RUN apk add --no-cache curl

# Create non-root user
RUN addgroup -g 1001 -S ecommerce && \
    adduser -S ecommerce -u 1001 -G ecommerce

# Copy the built JAR
COPY --from=builder /app/target/ecommerce-service-*.jar app.jar

# Change ownership
RUN chown -R ecommerce:ecommerce /app

USER ecommerce

EXPOSE 3032

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:3032/actuator/health || exit 1

CMD ["java", "-jar", "app.jar"]
--- ./erp-services/inventory-service/Dockerfile ---
# Inventory Service Dockerfile
FROM golang:1.21-alpine AS builder

# Install git and ca-certificates
RUN apk add --no-cache git ca-certificates tzdata

# Set working directory
WORKDIR /app

# Copy go mod files
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy source code
COPY . .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main ./cmd/main.go

# Final stage
FROM alpine:latest

# Install ca-certificates for HTTPS requests
RUN apk --no-cache add ca-certificates curl

# Create app directory
WORKDIR /root/

# Copy the binary from builder stage
COPY --from=builder /app/main .

# Create non-root user
RUN addgroup -g 1001 -S appgroup && \
    adduser -S appuser -u 1001 -G appgroup

# Create necessary directories
RUN mkdir -p /app/logs && \
    chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3012/health || exit 1

# Expose port
EXPOSE 3012

# Run the binary
CMD ["./main"]
--- ./erp-services/finance-service/Dockerfile ---
# Multi-stage build for Java Spring Boot
FROM eclipse-temurin:17-jdk-alpine AS builder

WORKDIR /app

# Copy Maven files
COPY pom.xml .
COPY src src

# Install Maven
RUN apk add --no-cache maven

# Build the application
RUN mvn clean package -DskipTests

# Production stage
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Install curl for health checks
RUN apk add --no-cache curl

# Create non-root user
RUN addgroup -g 1001 -S finance && \
    adduser -S finance -u 1001 -G finance

# Copy the built JAR
COPY --from=builder /app/target/finance-service-*.jar app.jar

# Change ownership
RUN chown -R finance:finance /app

USER finance

EXPOSE 3028

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:3028/actuator/health || exit 1

CMD ["java", "-jar", "app.jar"]
--- ./erp-services/procurement-service/Dockerfile ---
# Procurement Service Dockerfile
FROM maven:3.8.4-openjdk-17-slim AS builder

WORKDIR /app

# Copy pom.xml and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy source code and build
COPY src src
RUN mvn clean package -DskipTests

# Final stage
FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

# Install curl for health checks
RUN apk --no-cache add curl

# Copy the JAR file from builder stage
COPY --from=builder /app/target/*.jar app.jar

# Create non-root user
RUN addgroup -g 1001 -S appgroup && \
    adduser -S appuser -u 1001 -G appgroup

# Create logs directory
RUN mkdir -p /app/logs && \
    chown -R appuser:appgroup /app

USER appuser

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3013/actuator/health || exit 1

EXPOSE 3013
CMD ["java", "-jar", "app.jar"]
--- ./erp-services/hrm-service/Dockerfile ---
# Multi-stage build for Java Spring Boot
FROM eclipse-temurin:17-jdk-alpine AS builder

WORKDIR /app

# Copy Maven files
COPY pom.xml .
COPY src src

# Install Maven
RUN apk add --no-cache maven

# Build the application
RUN mvn clean package -DskipTests

# Production stage
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Install curl for health checks
RUN apk add --no-cache curl

# Create non-root user
RUN addgroup -g 1001 -S hrm && \
    adduser -S hrm -u 1001 -G hrm

# Copy the built JAR
COPY --from=builder /app/target/hrm-service-*.jar app.jar

# Change ownership
RUN chown -R hrm:hrm /app

USER hrm

EXPOSE 3029

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:3029/actuator/health || exit 1

CMD ["java", "-jar", "app.jar"]
--- ./erp-services/crm-service/Dockerfile ---
# Multi-stage build for Java Spring Boot
FROM eclipse-temurin:17-jdk-alpine AS builder

WORKDIR /app

# Copy Maven files
COPY pom.xml .
COPY src src

# Install Maven
RUN apk add --no-cache maven

# Build the application
RUN mvn clean package -DskipTests

# Production stage
FROM eclipse-temurin:17-jre-alpine AS production

WORKDIR /app

# Install curl for health checks
RUN apk add --no-cache curl

# Create non-root user
RUN addgroup -g 1001 -S crm && \
    adduser -S crm -u 1001 -G crm

# Copy the built JAR
COPY --from=builder /app/target/crm-service-*.jar app.jar

# Change ownership
RUN chown -R crm:crm /app

USER crm

EXPOSE 3015

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:3015/actuator/health || exit 1

CMD ["java", "-jar", "app.jar"]
--- ./erp-services/integration-service/Dockerfile ---
# Multi-stage build for Integration Service
FROM eclipse-temurin:17-jdk-alpine AS builder

# Set working directory
WORKDIR /app

# Copy Maven files
COPY pom.xml .
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

# Production stage
FROM eclipse-temurin:17-jre-alpine AS production

# Set working directory
WORKDIR /app

# Copy the built JAR from builder stage
COPY --from=builder /app/target/*.jar app.jar

# Expose port
EXPOSE 3020

# Run the application
CMD ["java", "-jar", "app.jar"]
--- ./ui/master-dashboard/node_modules/is-mobile/tea.yaml ---
# https://tea.xyz/what-is-this-file
---
version: 1.0.0
codeOwners:
  - '0xE7DEE1B8Bb97C3065850Cf582D6DED57C6009587'
quorum: 1
--- ./security-improvements.yaml ---
# Pod Security Standards
apiVersion: v1
kind: Namespace
metadata:
  name: i3m-platform-secure
  labels:
    pod-security.kubernetes.io/enforce: restricted
    pod-security.kubernetes.io/audit: restricted
    pod-security.kubernetes.io/warn: restricted
---
# Network Policy for i3m-platform
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: i3m-platform-network-policy
  namespace: i3m-platform
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: i3m-platform
    - namespaceSelector:
        matchLabels:
          name: monitoring
  egress:
  - to:
    - namespaceSelector:
        matchLabels:
          name: i3m-platform
    - namespaceSelector:
        matchLabels:
          name: monitoring
  - to: []
    ports:
    - protocol: TCP
      port: 53
    - protocol: UDP
      port: 53
---
# Resource Quotas
apiVersion: v1
kind: ResourceQuota
metadata:
  name: i3m-platform-quota
  namespace: i3m-platform
spec:
  hard:
    requests.cpu: "4"
    requests.memory: 8Gi
    limits.cpu: "8"
    limits.memory: 16Gi
    persistentvolumeclaims: "10"
    pods: "50"
    services: "20"
---
# Limit Range
apiVersion: v1
kind: LimitRange
metadata:
  name: i3m-platform-limits
  namespace: i3m-platform
spec:
  limits:
  - default:
      cpu: "500m"
      memory: "512Mi"
    defaultRequest:
      cpu: "100m"
      memory: "128Mi"
    type: Container
--- ./k8s-improvements/networking-improvements.yaml ---
# Networking Improvements for I3M Platform
apiVersion: v1
kind: Service
metadata:
  name: api-gateway-nodeport
  namespace: i3m-platform
  labels:
    app: api-gateway
    tier: core
spec:
  type: NodePort
  ports:
  - port: 3000
    targetPort: 3000
    nodePort: 30000
    protocol: TCP
    name: http
  selector:
    app: api-gateway
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: i3m-platform-ingress
  namespace: i3m-platform
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
    nginx.ingress.kubernetes.io/cors-allow-origin: "*"
    nginx.ingress.kubernetes.io/cors-allow-methods: "GET, POST, PUT, DELETE, OPTIONS"
    nginx.ingress.kubernetes.io/cors-allow-headers: "DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization"
spec:
  rules:
  - host: i3m-platform.local
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: api-gateway
            port:
              number: 3000
      - path: /api/auth
        pathType: Prefix
        backend:
          service:
            name: auth-service
            port:
              number: 3001
      - path: /api/users
        pathType: Prefix
        backend:
          service:
            name: user-service
            port:
              number: 3009
---
apiVersion: v1
kind: Service
metadata:
  name: registry-service
  namespace: i3m-platform
spec:
  type: ExternalName
  externalName: host.docker.internal
  ports:
  - port: 5000
    targetPort: 5000
    protocol: TCP
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-registry-access
  namespace: i3m-platform
spec:
  podSelector: {}
  policyTypes:
  - Egress
  egress:
  - to: []
    ports:
    - protocol: TCP
      port: 5000
---
apiVersion: v1
kind: Service
metadata:
  name: monitoring-nodeport
  namespace: monitoring
spec:
  type: NodePort
  ports:
  - port: 3000
    targetPort: 3000
    nodePort: 30001
    protocol: TCP
    name: grafana
  selector:
    app.kubernetes.io/name: grafana
--- ./k8s-improvements/user-service-fixed.yaml ---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: user-service
  namespace: i3m-platform
  labels:
    app: user-service
    tier: core
    version: 1.0.0
spec:
  replicas: 1
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: user-service
  template:
    metadata:
      labels:
        app: user-service
        tier: core
      annotations:
        prometheus.io/scrape: "true"
        prometheus.io/port: "3009"
        prometheus.io/path: "/actuator/prometheus"
    spec:
      containers:
      - name: user-service
        image: i3m-platform-user-service:latest
        imagePullPolicy: Never
        ports:
        - containerPort: 3009
          name: http
          protocol: TCP
        env:
        - name: SPRING_DATASOURCE_URL
          value: "jdbc:postgresql://postgres-service:5432/i3m_platform?sslmode=disable"
        - name: SPRING_DATASOURCE_USERNAME
          value: "i3m_user"
        - name: SPRING_DATASOURCE_PASSWORD
          value: "i3m_password"
        - name: SPRING_REDIS_HOST
          value: "redis-service"
        - name: SPRING_REDIS_PORT
          value: "6379"
        - name: DATABASE_URL
          value: "postgresql://i3m_user:i3m_password@postgres-service:5432/i3m_platform?sslmode=disable"
        - name: DB_HOST
          value: "postgres-service"
        - name: DB_PORT
          value: "5432"
        - name: DB_NAME
          value: "i3m_platform"
        - name: DB_USER
          value: "i3m_user"
        - name: DB_PASSWORD
          value: "i3m_password"
        - name: DB_SSLMODE
          value: "disable"
        resources:
          requests:
            cpu: 100m
            memory: 256Mi
          limits:
            cpu: 500m
            memory: 1Gi
        livenessProbe:
          httpGet:
            path: /actuator/health
            port: 3009
            scheme: HTTP
          initialDelaySeconds: 300
          periodSeconds: 60
          timeoutSeconds: 30
          failureThreshold: 3
          successThreshold: 1
        readinessProbe:
          httpGet:
            path: /actuator/health
            port: 3009
            scheme: HTTP
          initialDelaySeconds: 300
          periodSeconds: 30
          timeoutSeconds: 30
          failureThreshold: 3
          successThreshold: 1
        startupProbe:
          httpGet:
            path: /actuator/health
            port: 3009
            scheme: HTTP
          initialDelaySeconds: 60
          periodSeconds: 30
          timeoutSeconds: 30
          failureThreshold: 10
          successThreshold: 1
--- ./k8s-improvements/persistent-storage.yaml ---
# Persistent Storage for I3M Platform
apiVersion: v1
kind: PersistentVolume
metadata:
  name: postgres-pv
  labels:
    type: local
spec:
  storageClassName: manual
  capacity:
    storage: 10Gi
  accessModes:
    - ReadWriteOnce
  hostPath:
    path: "/mnt/data/postgres"
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: postgres-pvc
  namespace: i3m-platform
spec:
  storageClassName: manual
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
---
apiVersion: v1
kind: PersistentVolume
metadata:
  name: mongodb-pv
  labels:
    type: local
spec:
  storageClassName: manual
  capacity:
    storage: 10Gi
  accessModes:
    - ReadWriteOnce
  hostPath:
    path: "/mnt/data/mongodb"
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: mongodb-pvc
  namespace: i3m-platform
spec:
  storageClassName: manual
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
---
apiVersion: v1
kind: PersistentVolume
metadata:
  name: redis-pv
  labels:
    type: local
spec:
  storageClassName: manual
  capacity:
    storage: 5Gi
  accessModes:
    - ReadWriteOnce
  hostPath:
    path: "/mnt/data/redis"
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: redis-pvc
  namespace: i3m-platform
spec:
  storageClassName: manual
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 5Gi
--- ./deployments/k8s/secrets/app-secrets.yaml ---
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
  namespace: i3m-platform
type: Opaque
data:
  # Database Passwords (base64 encoded)
  POSTGRES_PASSWORD: aTNtX3Bhc3N3b3Jk  # i3m_password
  MONGODB_PASSWORD: aTNtX3Bhc3N3b3Jk   # i3m_password
  REDIS_PASSWORD: aTNtX3Bhc3N3b3Jk     # i3m_password
  
  # JWT Secret
  JWT_SECRET: eW91ci1zdXBlci1zZWNyZXQtand0LWtleS1oZXJl  # your-super-secret-jwt-key-here
  
  # Database URLs
  DATABASE_URL: cG9zdGdyZXM6Ly9pM21fdXNlcjppM21fcGFzc3dvcmRAcG9zdGdyZXMtc2VydmljZTo1NDMyL2kzbV9wbGF0Zm9ybT9zc2xtb2RlPWRpc2FibGU=  # postgres://i3m_user:i3m_password@postgres-service:5432/i3m_platform?sslmode=disable
  REDIS_URL: cmVkaXM6Ly86aTNtX3Bhc3N3b3JkQHJlZGlzLXNlcnZpY2U6NjM3OQ==  # redis://:i3m_password@redis-service:6379
  MONGODB_URL: bW9uZ29kYjovL2kzbV91c2VyOmkzbV9wYXNzd29yZEBtb25nb2RiLXNlcnZpY2U6MjcwMTcvaTPtX3BsYXRmb3Jt  # mongodb://i3m_user:i3m_password@mongodb-service:27017/i3m_platform

---
apiVersion: v1
kind: Secret
metadata:
  name: registry-secret
  namespace: i3m-platform
type: kubernetes.io/dockerconfigjson
data:
  .dockerconfigjson: eyJhdXRocyI6eyJyZWdpc3RyeS5jb20iOnsidXNlcm5hbWUiOiJ1c2VyIiwicGFzc3dvcmQiOiJwYXNzIiwiYXV0aCI6ImRYTmxjanB3WVhOeiJ9fX0=  # Replace with actual registry credentials
--- ./deployments/k8s/namespace.yaml ---
apiVersion: v1
kind: Namespace
metadata:
  name: i3m-platform
  labels:
    name: i3m-platform
    environment: production
    version: "1.0.0"
  annotations:
    description: "I3M Platform - Microservices Architecture"
    contact: "devops@i3m.com"
--- ./deployments/k8s/ingress/ui-dashboard-ingress.yaml ---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ui-dashboard-ingress
  namespace: i3m-platform
  labels:
    app: ui-dashboard
    component: frontend
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
    nginx.ingress.kubernetes.io/ssl-redirect: "false"
    nginx.ingress.kubernetes.io/use-regex: "true"
    nginx.ingress.kubernetes.io/cors-allow-origin: "*"
    nginx.ingress.kubernetes.io/cors-allow-methods: "GET, POST, PUT, DELETE, OPTIONS"
    nginx.ingress.kubernetes.io/cors-allow-headers: "DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization"
spec:
  ingressClassName: nginx
  rules:
  - host: dashboard.i3m.local
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: ui-dashboard-service
            port:
              number: 80
  - host: localhost
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: ui-dashboard-service
            port:
              number: 80
--- ./deployments/k8s/ingress/ui-dashboard-dev-ingress.yaml ---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ui-dashboard-dev-ingress
  namespace: i3m-platform
  labels:
    app: ui-dashboard-dev
    component: frontend
    environment: development
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
    nginx.ingress.kubernetes.io/ssl-redirect: "false"
    nginx.ingress.kubernetes.io/use-regex: "true"
    nginx.ingress.kubernetes.io/cors-allow-origin: "*"
    nginx.ingress.kubernetes.io/cors-allow-methods: "GET, POST, PUT, DELETE, OPTIONS"
    nginx.ingress.kubernetes.io/cors-allow-headers: "DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization"
    nginx.ingress.kubernetes.io/proxy-read-timeout: "600"
    nginx.ingress.kubernetes.io/proxy-send-timeout: "600"
spec:
  ingressClassName: nginx
  rules:
  - host: dev.i3m.local
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: ui-dashboard-dev-service
            port:
              number: 5173
  - host: localhost
    http:
      paths:
      - path: /dev
        pathType: Prefix
        backend:
          service:
            name: ui-dashboard-dev-service
            port:
              number: 5173
--- ./deployments/k8s/deployments/ui-dashboard-deployment.yaml ---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ui-dashboard
  namespace: i3m-platform
  labels:
    app: ui-dashboard
    component: frontend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: ui-dashboard
  template:
    metadata:
      labels:
        app: ui-dashboard
        component: frontend
    spec:
      containers:
      - name: ui-dashboard
        image: i3m-platform/ui-dashboard:latest
        imagePullPolicy: Never
        ports:
        - containerPort: 80
        env:
        - name: NODE_ENV
          value: "production"
        - name: VITE_API_BASE_URL
          value: "http://api-gateway-service:8080"
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "200m"
        livenessProbe:
          httpGet:
            path: /health
            port: 80
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 5
        volumeMounts:
        - name: nginx-config
          mountPath: /etc/nginx/nginx.conf
          subPath: nginx.conf
      volumes:
      - name: nginx-config
        configMap:
          name: ui-dashboard-config
--- ./deployments/k8s/deployments/ui-dashboard-dev-deployment.yaml ---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ui-dashboard-dev
  namespace: i3m-platform
  labels:
    app: ui-dashboard-dev
    component: frontend
    environment: development
spec:
  replicas: 1
  selector:
    matchLabels:
      app: ui-dashboard-dev
  template:
    metadata:
      labels:
        app: ui-dashboard-dev
        component: frontend
        environment: development
    spec:
      containers:
      - name: ui-dashboard-dev
        image: i3m-platform/ui-dashboard-dev:latest
        imagePullPolicy: IfNotPresent
        ports:
        - containerPort: 5173
        env:
        - name: NODE_ENV
          value: "development"
        - name: VITE_API_BASE_URL
          value: "http://api-gateway-service:8080"
        - name: CHOKIDAR_USEPOLLING
          value: "true"
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "200m"
        volumeMounts:
        - name: node-modules
          mountPath: /app/node_modules
      volumes:
      - name: node-modules
        emptyDir: {}
--- ./deployments/k8s/services/ui-dashboard-service.yaml ---
apiVersion: v1
kind: Service
metadata:
  name: ui-dashboard-service
  namespace: i3m-platform
  labels:
    app: ui-dashboard
    component: frontend
spec:
  type: ClusterIP
  ports:
  - port: 80
    targetPort: 80
    protocol: TCP
    name: http
  selector:
    app: ui-dashboard
--- ./deployments/k8s/services/databases.yaml ---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: postgres
  namespace: i3m-platform
  labels:
    app: postgres
    tier: database
spec:
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
        tier: database
    spec:
      containers:
      - name: postgres
        image: postgres:15-alpine
        ports:
        - containerPort: 5432
          name: postgres
        env:
        - name: POSTGRES_DB
          value: i3m_platform
        - name: POSTGRES_USER
          value: i3m_user
        - name: POSTGRES_PASSWORD
          value: i3m_password
        resources:
          requests:
            cpu: 100m
            memory: 256Mi
          limits:
            cpu: 500m
            memory: 512Mi
---
apiVersion: v1
kind: Service
metadata:
  name: postgres-service
  namespace: i3m-platform
spec:
  selector:
    app: postgres
  ports:
  - port: 5432
    targetPort: 5432
    name: postgres
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: redis
  namespace: i3m-platform
  labels:
    app: redis
    tier: database
spec:
  replicas: 1
  selector:
    matchLabels:
      app: redis
  template:
    metadata:
      labels:
        app: redis
        tier: database
    spec:
      containers:
      - name: redis
        image: redis:7-alpine
        ports:
        - containerPort: 6379
          name: redis
        resources:
          requests:
            cpu: 100m
            memory: 128Mi
          limits:
            cpu: 200m
            memory: 256Mi
---
apiVersion: v1
kind: Service
metadata:
  name: redis-service
  namespace: i3m-platform
spec:
  selector:
    app: redis
  ports:
  - port: 6379
    targetPort: 6379
    name: redis
--- ./deployments/k8s/services/auth-service.yaml ---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: auth-service
  namespace: i3m-platform
  labels:
    app: auth-service
    tier: core
    version: "1.0.0"
spec:
  replicas: 2
  selector:
    matchLabels:
      app: auth-service
  template:
    metadata:
      labels:
        app: auth-service
        tier: core
      annotations:
        prometheus.io/scrape: "true"
        prometheus.io/port: "3008"
        prometheus.io/path: "/metrics"
    spec:
      containers:
      - name: auth-service
        image: i3m-platform-auth-service:latest
        imagePullPolicy: Never
        ports:
        - containerPort: 3008
          name: http
        env:
        - name: PORT
          value: "3008"
        - name: ENVIRONMENT
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: ENVIRONMENT
        - name: DATABASE_URL
          value: "postgres://i3m_user:i3m_password@postgres-service:5432/i3m_platform?sslmode=disable"
        - name: DB_HOST
          value: "postgres-service"
        - name: DB_PORT
          value: "5432"
        - name: DB_NAME
          value: "i3m_platform"
        - name: DB_USER
          value: "i3m_user"
        - name: DB_PASSWORD
          value: "i3m_password"
        - name: DB_SSLMODE
          value: "disable"
        - name: REDIS_URL
          value: "redis://redis-service:6379"
        - name: REDIS_HOST
          value: "redis-service"
        - name: REDIS_PORT
          value: "6379"
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: JWT_SECRET
        resources:
          requests:
            memory: "256Mi"
            cpu: "200m"
          limits:
            memory: "512Mi"
            cpu: "1000m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3008
          initialDelaySeconds: 30
          periodSeconds: 10
          timeoutSeconds: 5
          successThreshold: 1
          failureThreshold: 3
        readinessProbe:
          httpGet:
            path: /health
            port: 3008
          initialDelaySeconds: 10
          periodSeconds: 5
          timeoutSeconds: 3
          successThreshold: 1
          failureThreshold: 3
      imagePullSecrets:
      - name: registry-secret

---
apiVersion: v1
kind: Service
metadata:
  name: auth-service
  namespace: i3m-platform
  labels:
    app: auth-service
spec:
  selector:
    app: auth-service
  ports:
  - port: 3008
    targetPort: 3008
    protocol: TCP
    name: http
  type: ClusterIP

---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: auth-service-hpa
  namespace: i3m-platform
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: auth-service
  minReplicas: 2
  maxReplicas: 6
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
--- ./deployments/k8s/services/ui-dashboard-dev-service.yaml ---
apiVersion: v1
kind: Service
metadata:
  name: ui-dashboard-dev-service
  namespace: i3m-platform
  labels:
    app: ui-dashboard-dev
    component: frontend
    environment: development
spec:
  type: ClusterIP
  ports:
  - port: 5173
    targetPort: 5173
    protocol: TCP
    name: dev-server
  selector:
    app: ui-dashboard-dev
--- ./deployments/k8s/services/api-gateway.yaml ---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-gateway
  namespace: i3m-platform
  labels:
    app: api-gateway
    tier: gateway
    version: "1.0.0"
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api-gateway
  template:
    metadata:
      labels:
        app: api-gateway
        tier: gateway
      annotations:
        prometheus.io/scrape: "true"
        prometheus.io/port: "3004"
        prometheus.io/path: "/metrics"
    spec:
      containers:
      - name: api-gateway
        image: i3m-platform-api-gateway:latest
        imagePullPolicy: Never
        ports:
        - containerPort: 3004
          name: http
        env:
        - name: PORT
          value: "3004"
        - name: ENVIRONMENT
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: ENVIRONMENT
        - name: REDIS_URL
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: REDIS_URL
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: JWT_SECRET
        - name: AUTH_SERVICE
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: AUTH_SERVICE_URL
        - name: USER_SERVICE
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: USER_SERVICE_URL
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3004
          initialDelaySeconds: 30
          periodSeconds: 10
          timeoutSeconds: 5
          successThreshold: 1
          failureThreshold: 3
        readinessProbe:
          httpGet:
            path: /health
            port: 3004
          initialDelaySeconds: 5
          periodSeconds: 5
          timeoutSeconds: 3
          successThreshold: 1
          failureThreshold: 3
      imagePullSecrets:
      - name: registry-secret

---
apiVersion: v1
kind: Service
metadata:
  name: api-gateway-service
  namespace: i3m-platform
  labels:
    app: api-gateway
spec:
  selector:
    app: api-gateway
  ports:
  - port: 3004
    targetPort: 3004
    protocol: TCP
    name: http
  type: ClusterIP

---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: api-gateway-ingress
  namespace: i3m-platform
  annotations:
    kubernetes.io/ingress.class: "nginx"
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
    nginx.ingress.kubernetes.io/rate-limit: "100"
    nginx.ingress.kubernetes.io/rate-limit-window: "1m"
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    nginx.ingress.kubernetes.io/proxy-body-size: "10m"
spec:
  tls:
  - hosts:
    - api.i3m.com
    secretName: api-gateway-tls
  rules:
  - host: api.i3m.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: api-gateway-service
            port:
              number: 3004

---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api-gateway-hpa
  namespace: i3m-platform
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: api-gateway
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
--- ./deployments/k8s/services/user-service.yaml ---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: user-service
  namespace: i3m-platform
  labels:
    app: user-service
    tier: core
    version: "1.0.0"
spec:
  replicas: 2
  selector:
    matchLabels:
      app: user-service
  template:
    metadata:
      labels:
        app: user-service
        tier: core
      annotations:
        prometheus.io/scrape: "true"
        prometheus.io/port: "3009"
        prometheus.io/path: "/actuator/prometheus"
    spec:
      containers:
      - name: user-service
        image: i3m-platform-user-service:latest
        imagePullPolicy: Never
        ports:
        - containerPort: 3009
          name: http
        env:
        - name: SERVER_PORT
          value: "3009"
        - name: SPRING_PROFILES_ACTIVE
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: ENVIRONMENT
        - name: SPRING_DATASOURCE_URL
          value: "jdbc:postgresql://postgres-service:5432/i3m_platform?sslmode=disable"
        - name: SPRING_DATASOURCE_USERNAME
          value: "i3m_user"
        - name: SPRING_DATASOURCE_PASSWORD
          value: "i3m_password"
        - name: SPRING_REDIS_HOST
          value: "redis-service"
        - name: SPRING_REDIS_PORT
          value: "6379"
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: JWT_SECRET
        resources:
          requests:
            memory: "512Mi"
            cpu: "300m"
          limits:
            memory: "1Gi"
            cpu: "1500m"
        livenessProbe:
          httpGet:
            path: /actuator/health
            port: 3009
          initialDelaySeconds: 60
          periodSeconds: 10
          timeoutSeconds: 5
          successThreshold: 1
          failureThreshold: 3
        readinessProbe:
          httpGet:
            path: /actuator/health
            port: 3009
          initialDelaySeconds: 30
          periodSeconds: 5
          timeoutSeconds: 3
          successThreshold: 1
          failureThreshold: 3
      imagePullSecrets:
      - name: registry-secret

---
apiVersion: v1
kind: Service
metadata:
  name: user-service
  namespace: i3m-platform
  labels:
    app: user-service
spec:
  selector:
    app: user-service
  ports:
  - port: 3009
    targetPort: 3009
    protocol: TCP
    name: http
  type: ClusterIP

---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: user-service-hpa
  namespace: i3m-platform
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: user-service
  minReplicas: 2
  maxReplicas: 8
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
--- ./deployments/k8s/configmaps/ui-dashboard-config.yaml ---
apiVersion: v1
kind: ConfigMap
metadata:
  name: ui-dashboard-config
  namespace: i3m-platform
  labels:
    app: ui-dashboard
    component: frontend
data:
  nginx.conf: |
    events {
        worker_connections 1024;
    }

    http {
        include       /etc/nginx/mime.types;
        default_type  application/octet-stream;

        # Logging
        log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                        '$status $body_bytes_sent "$http_referer" '
                        '"$http_user_agent" "$http_x_forwarded_for"';

        access_log /var/log/nginx/access.log main;
        error_log /var/log/nginx/error.log;

        # Gzip compression
        gzip on;
        gzip_vary on;
        gzip_min_length 1024;
        gzip_proxied any;
        gzip_comp_level 6;
        gzip_types
            text/plain
            text/css
            text/xml
            text/javascript
            application/json
            application/javascript
            application/xml+rss
            application/atom+xml
            image/svg+xml;

        server {
            listen 80;
            server_name localhost;
            root /usr/share/nginx/html;
            index index.html;

            # Security headers
            add_header X-Frame-Options "SAMEORIGIN" always;
            add_header X-Content-Type-Options "nosniff" always;
            add_header X-XSS-Protection "1; mode=block" always;
            add_header Referrer-Policy "no-referrer-when-downgrade" always;

            # Handle client-side routing
            location / {
                try_files $uri $uri/ /index.html;
            }

            # Cache static assets
            location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
                expires 1y;
                add_header Cache-Control "public, immutable";
            }

            # API proxy
            location /api/ {
                proxy_pass http://api-gateway-service:8080/;
                proxy_set_header Host $host;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto $scheme;
            }

            # Health check
            location /health {
                access_log off;
                return 200 "healthy\n";
                add_header Content-Type text/plain;
            }
        }
    }
--- ./deployments/k8s/configmaps/app-config.yaml ---
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
  namespace: i3m-platform
data:
  # Database Configuration
  POSTGRES_HOST: "postgres-service"
  POSTGRES_PORT: "5432"
  POSTGRES_DB: "i3m_platform"
  MONGODB_HOST: "mongodb-service"
  MONGODB_PORT: "27017"
  MONGODB_DB: "i3m_platform"
  REDIS_HOST: "redis-service"
  REDIS_PORT: "6379"
  TIMESCALEDB_HOST: "timescaledb-service"
  TIMESCALEDB_PORT: "5432"
  ELASTICSEARCH_HOST: "elasticsearch-service"
  ELASTICSEARCH_PORT: "9200"
  
  # Kafka Configuration
  KAFKA_BROKERS: "kafka-service:9092"
  KAFKA_ZOOKEEPER: "zookeeper-service:2181"
  
  # Service URLs
  API_GATEWAY_URL: "http://api-gateway-service:3004"
  AUTH_SERVICE_URL: "http://auth-service:3008"
  USER_SERVICE_URL: "http://user-service:3009"
  
  # Application Configuration
  ENVIRONMENT: "production"
  LOG_LEVEL: "INFO"
  
  # CORS Configuration
  CORS_ALLOWED_ORIGINS: "https://app.i3m.com,https://admin.i3m.com"
  
  # Rate Limiting
  RATE_LIMIT_REQUESTS_PER_MINUTE: "100"
  
  # Cache Configuration
  CACHE_TTL: "600"
  
  # Monitoring
  PROMETHEUS_ENABLED: "true"
  METRICS_ENABLED: "true"

---
apiVersion: v1
kind: ConfigMap
metadata:
  name: prometheus-config
  namespace: i3m-platform
data:
  prometheus.yml: |
    global:
      scrape_interval: 15s
      evaluation_interval: 15s
    
    scrape_configs:
      - job_name: 'kubernetes-pods'
        kubernetes_sd_configs:
          - role: pod
            namespaces:
              names:
                - i3m-platform
        relabel_configs:
          - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
            action: keep
            regex: true
          - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_path]
            action: replace
            target_label: __metrics_path__
            regex: (.+)
          - source_labels: [__address__, __meta_kubernetes_pod_annotation_prometheus_io_port]
            action: replace
            regex: ([^:]+)(?::\d+)?;(\d+)
            replacement: $1:$2
            target_label: __address__
          - action: labelmap
            regex: __meta_kubernetes_pod_label_(.+)
          - source_labels: [__meta_kubernetes_namespace]
            action: replace
            target_label: kubernetes_namespace
          - source_labels: [__meta_kubernetes_pod_name]
            action: replace
            target_label: kubernetes_pod_name

---
apiVersion: v1
kind: ConfigMap
metadata:
  name: grafana-datasources
  namespace: i3m-platform
data:
  datasources.yaml: |
    apiVersion: 1
    datasources:
      - name: Prometheus
        type: prometheus
        url: http://prometheus-service:9090
        access: proxy
        isDefault: true
      - name: PostgreSQL
        type: postgres
        url: postgres-service:5432
        database: i3m_platform
        user: i3m_user
        secureJsonData:
          password: i3m_password
      - name: Elasticsearch
        type: elasticsearch
        url: http://elasticsearch-service:9200
        access: proxy
        database: "[logstash-]YYYY.MM.DD"
