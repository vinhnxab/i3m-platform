#!/bin/bash
set -e

echo "🐳 Building ERP and Industry Services Docker Images..."

# ERP Services (Core Business Logic)
echo "🏢 Building ERP Services..."

# Commerce Service
echo "📦 Building Commerce Service..."
cd erp-services/commerce-service
docker build -t i3m-platform-commerce-service:latest .
cd ../..

# CMS Service
echo "📦 Building CMS Service..."
cd erp-services/cms-service/content-service
docker build -t i3m-platform-cms-service:latest .
cd ../../..

# Analytics Service
echo "📦 Building Analytics Service..."
cd erp-services/analytics-services/analytics-service
docker build -t i3m-platform-analytics-service:latest .
cd ../../..

# Storage Service
echo "📦 Building Storage Service..."
cd erp-services/storage-service
docker build -t i3m-platform-storage-service:latest .
cd ../..

# Industry Services (Industry Applications)
echo "🏭 Building Industry Services..."

# Ecommerce Service
echo "📦 Building Ecommerce Service..."
cd industry-services/ecommerce-service
docker build -t i3m-platform-ecommerce-service:latest .
cd ../..

# Agriculture Service
echo "📦 Building Agriculture Service..."
cd industry-services/agriculture-service
docker build -t i3m-platform-agriculture-service:latest .
cd ../..

# Healthcare Service
echo "📦 Building Healthcare Service..."
cd industry-services/healthcare-service
docker build -t i3m-platform-healthcare-service:latest .
cd ../..

# Retail Service
echo "📦 Building Retail Service..."
cd industry-services/retail-service
docker build -t i3m-platform-retail-service:latest .
cd ../..

# Restaurant Service
echo "📦 Building Restaurant Service..."
cd industry-services/restaurant-service
docker build -t i3m-platform-restaurant-service:latest .
cd ../..

# Manufacturing Service
echo "📦 Building Manufacturing Service..."
cd industry-services/manufacturing-service
docker build -t i3m-platform-manufacturing-service:latest .
cd ../..

echo "✅ All ERP and Industry Services Docker images built successfully!"

# Show built images
echo "📊 Built Images:"
docker images | grep i3m-platform | grep -E "(commerce|cms|analytics|storage|ecommerce|agriculture|healthcare|retail|restaurant|manufacturing)"
