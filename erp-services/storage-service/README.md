# 🗄️ I3M Platform Storage Service

## 📋 Overview

Storage Service là một microservice được viết bằng Go, cung cấp khả năng quản lý file và dữ liệu cho I3M Platform. Service này được thiết kế cho thế giới số, nơi doanh nghiệp cần quản lý và lưu trữ dữ liệu một cách hiệu quả.

## 🚀 Features

### **📁 Core Functionality**
- **File Upload/Download**: Single và batch file upload
- **Metadata Management**: File information, tags, descriptions
- **Version Control**: File versioning và history
- **Thumbnail Generation**: Automatic thumbnail cho images
- **File Type Detection**: MIME type detection với filetype library
- **Search & Indexing**: Full-text search capabilities
- **Access Control**: Public/private file access
- **Storage Providers**: Local, AWS S3, MinIO support

### **🏗️ Technical Stack**
- **Language**: Go 1.21
- **Framework**: Gin (HTTP router)
- **Database**: PostgreSQL với custom repository pattern
- **Cache**: Redis cho performance
- **File Processing**: H2non/filetype, Disintegration/imaging
- **Cloud Storage**: AWS S3, MinIO integration
- **Security**: JWT authentication
- **Monitoring**: Prometheus metrics

## 📊 API Endpoints

```
/api/v1/storage/
├── /health                    # Health check
├── /upload                     # Single file upload
├── /upload/batch               # Multiple files upload
├── /files/{id}                 # Get file metadata
├── /files/{id}/download        # Download file
├── /files/{id}/preview         # Get file preview/thumbnail
├── /files                      # List files with pagination
├── /files/{id}                 # Update file metadata
├── /files/{id}                 # Delete file
├── /files/{id}/versions        # Get file versions
├── /files/{id}/versions/{version}/restore  # Restore version
├── /stats                      # Storage statistics
└── /search                     # Search files
```

## 🔧 Configuration

### **Environment Variables**
```bash
# Server
PORT=3032

# Database
DATABASE_URL=postgres://i3m_user:i3m_password@localhost:5433/i3m_platform?sslmode=disable

# Redis
REDIS_URL=redis://localhost:6379

# Storage
STORAGE_UPLOAD_PATH=/app/storage/uploads
STORAGE_THUMBNAIL_PATH=/app/storage/thumbnails
STORAGE_MAX_FILE_SIZE=104857600  # 100MB
STORAGE_MAX_REQUEST_SIZE=1048576000  # 1000MB

# Storage Providers
STORAGE_LOCAL_ENABLED=true
STORAGE_S3_ENABLED=false
STORAGE_MINIO_ENABLED=false
```

## 🚀 Quick Start

### **Development**
```bash
# Clone and navigate
cd erp-services/storage-service

# Install dependencies
go mod download

# Run locally
go run main.go
```

### **Docker**
```bash
# Build image
docker build -t i3m-platform-storage-service:latest .

# Run container
docker run -p 3032:3032 i3m-platform-storage-service:latest
```

### **Kubernetes**
```bash
# Deploy to Kubernetes
kubectl apply -f deployments/k8s/deployments/erp-services-deployment.yaml
```

## 📁 Project Structure

```
storage-service/
├── main.go                     # Application entry point
├── go.mod                      # Go module definition
├── go.sum                      # Go module checksums
├── Dockerfile                  # Docker configuration
├── internal/
│   ├── config/                 # Configuration management
│   ├── database/               # Database connection and schema
│   ├── handlers/               # HTTP request handlers
│   ├── middleware/             # HTTP middleware
│   ├── models/                 # Data models and DTOs
│   ├── repository/             # Database repository layer
│   └── service/                # Business logic layer
└── README.md                   # This file
```

## 🧪 Testing

### **Health Check**
```bash
curl http://localhost:3032/health
```

### **Upload File**
```bash
curl -X POST -F "file=@test.txt" -F "fileName=test.txt" \
  http://localhost:3032/api/v1/storage/upload
```

### **Download File**
```bash
curl http://localhost:3032/api/v1/storage/files/{file-id}/download
```

### **List Files**
```bash
curl "http://localhost:3032/api/v1/storage/files?page=1&pageSize=20"
```

## 📈 Performance

### **Optimizations**
- **Connection Pooling**: Database connection pooling
- **Redis Caching**: Metadata caching for fast access
- **File Streaming**: Efficient file upload/download
- **Thumbnail Generation**: Async image processing
- **Full-text Search**: PostgreSQL full-text search indexing

### **Monitoring**
- **Health Checks**: Built-in health check endpoint
- **Prometheus Metrics**: Performance and usage metrics
- **Logging**: Structured logging with different levels

## 🔒 Security

### **Features**
- **JWT Authentication**: Secure API access
- **File Validation**: File type and size validation
- **Access Control**: Public/private file access
- **Tenant Isolation**: Multi-tenant data separation
- **Input Sanitization**: SQL injection prevention

## 🌐 Integration

### **ERP Services Integration**
- **Commerce Service**: Product images and documents
- **CMS Service**: Media files and content
- **Analytics Service**: Data files and reports
- **HR Service**: Employee documents and files

### **Industry Services Integration**
- **Ecommerce Service**: Product catalogs and images
- **Agriculture Service**: Farm data and images
- **Healthcare Service**: Medical records and images
- **Retail Service**: POS data and receipts

## 📊 Database Schema

```sql
CREATE TABLE core.file_metadata (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_name VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(1000) NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL,
    file_hash VARCHAR(64),
    version INTEGER NOT NULL DEFAULT 1,
    is_public BOOLEAN NOT NULL DEFAULT false,
    is_deleted BOOLEAN NOT NULL DEFAULT false,
    description TEXT,
    tags TEXT,
    thumbnail_path VARCHAR(1000),
    storage_provider VARCHAR(50) NOT NULL DEFAULT 'local',
    storage_bucket VARCHAR(255),
    storage_key VARCHAR(1000),
    tenant_id VARCHAR(255) NOT NULL,
    created_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    accessed_at TIMESTAMP WITH TIME ZONE
);
```

## 🚀 Deployment

### **Kubernetes**
- **Port**: 3032
- **Storage**: 10Gi persistent volume
- **Resources**: 256Mi-512Mi memory, 200m-500m CPU
- **Health Checks**: Built-in liveness and readiness probes

### **Scaling**
- **Horizontal Scaling**: Multiple replicas supported
- **Load Balancing**: Kubernetes service load balancing
- **Storage Scaling**: Persistent volume expansion

## 🎯 Benefits

### **✅ Digital Enterprise Ready**
- **Centralized Storage**: Single point for all file management
- **Multi-tenant Support**: Tenant isolation and security
- **Cloud Integration**: AWS S3, MinIO support
- **Performance**: Fast file access with caching
- **Scalability**: Horizontal scaling capabilities

### **✅ Developer Experience**
- **REST API**: Simple and intuitive API
- **Go Performance**: Fast and efficient
- **Docker Ready**: Containerized deployment
- **Kubernetes Native**: Cloud-native design

**Storage Service - Digital File Management for Modern Enterprises! 🗄️🚀**
