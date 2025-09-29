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
