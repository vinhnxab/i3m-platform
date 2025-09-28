# Redis Architecture & Configuration Guide

## 📊 Overview

I3M Platform sử dụng Redis cho caching, session management, và message queuing trong kiến trúc microservices. Tài liệu này mô tả cách Redis được cấu hình và sử dụng trong hệ thống.

## 🏗️ Redis Architecture

### Redis Container Configuration
```yaml
# docker-compose.yml
redis:
  image: redis:7.0-alpine
  container_name: i3m-redis
  command: redis-server --requirepass i3m_password
  ports:
    - "6380:6379"
  volumes:
    - redis_data:/data
  networks:
    - i3m-network
```

### Redis Database Allocation

| Database | Service | Purpose |
|----------|---------|---------|
| DB 0 | notification-service | Message queue, notifications |
| DB 1 | auth-service | Token blacklist, authentication |
| DB 2 | user-service | Session management, user data |
| DB 3 | finance-service | Transaction caching |
| DB 4 | hrm-service | Employee data caching |
| DB 5 | inventory-service | Product caching |
| DB 6 | procurement-service | Order caching |
| DB 7 | ecommerce-service | Cart, session management |
| DB 8 | ai-service | ML model caching |
| DB 9 | currency-exchange-service | Exchange rate caching |
| DB 10 | analytics-service | Analytics data caching |
| DB 11 | user-analytics-service | User behavior caching |
| DB 12 | content-service | Content caching |
| DB 13 | media-service | Media metadata caching |
| DB 14 | api-documentation-service | API docs caching |
| DB 15 | preview-service | Template caching |

## 🔧 Configuration Patterns

### Go Services
```go
// Connection string format
REDIS_URL=redis://:i3m_password@redis:6379/DB_NUMBER

// Example usage
redisClient := redis.NewClient(&redis.Options{
    Addr:     "redis:6379",
    Password: "i3m_password",
    DB:       DB_NUMBER,
})
```

### Java Spring Boot Services
```yaml
# application.yml
spring:
  data:
    redis:
      host: redis
      port: 6379
      password: i3m_password
      database: DB_NUMBER
      timeout: 2000ms
      lettuce:
        pool:
          max-active: 20
          max-idle: 10
          min-idle: 5
          max-wait: 1000ms
```

### Node.js Services
```javascript
// Environment variables
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=i3m_password
REDIS_DB=DB_NUMBER

// Connection example
const redis = require('redis');
const client = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
    db: process.env.REDIS_DB
});
```

### Python Services
```python
# Environment variables
REDIS_URL=redis://:i3m_password@redis:6379/DB_NUMBER

# Connection example
import redis
client = redis.from_url(os.getenv('REDIS_URL'))
```

## 📈 Redis Usage by Service Category

### Core Services (DB 0-3)
- **api-gateway**: Circuit breaker, rate limiting
- **auth-service**: Token blacklist, authentication
- **user-service**: Session management, user data
- **finance-service**: Transaction caching

### ERP Services (DB 4-7)
- **hrm-service**: Employee data caching
- **inventory-service**: Product caching
- **procurement-service**: Order caching
- **ecommerce-service**: Cart, session management

### Analytics Services (DB 8-11)
- **ai-service**: ML model caching
- **ml-pipeline-service**: Training data caching
- **analytics-service**: Analytics data caching
- **user-analytics-service**: User behavior caching

### Content & Integration Services (DB 12-15)
- **content-service**: Content caching
- **media-service**: Media metadata caching
- **api-documentation-service**: API docs caching
- **preview-service**: Template caching

## 🔍 Monitoring & Management

### Redis Info Commands
```bash
# Check Redis status
docker exec i3m-redis redis-cli -a i3m_password info

# Check memory usage
docker exec i3m-redis redis-cli -a i3m_password info memory

# Check keyspace
docker exec i3m-redis redis-cli -a i3m_password info keyspace

# Monitor Redis commands
docker exec i3m-redis redis-cli -a i3m_password monitor
```

### Key Patterns by Service
- **auth-service**: `blacklist:*`, `tenant:*`
- **api-gateway**: `circuit_breaker:*`, `failure:*`
- **user-service**: `session:*`, `user:*`
- **ecommerce-service**: `cart:*`, `session:*`
- **notification-service**: `queue:*`, `notification:*`

## 🚀 Best Practices

### 1. Database Separation
- Mỗi service sử dụng unique database
- Tránh conflicts giữa các services
- Dễ dàng monitoring và debugging

### 2. Connection Pooling
```yaml
# Spring Boot configuration
spring:
  data:
    redis:
      lettuce:
        pool:
          max-active: 20
          max-idle: 10
          min-idle: 5
          max-wait: 1000ms
```

### 3. Key Naming Conventions
```
service:type:id
Examples:
- auth:blacklist:token123
- user:session:user456
- ecommerce:cart:user789
```

### 4. TTL Management
```javascript
// Set expiration for keys
client.setex('key', 3600, 'value'); // 1 hour
client.expire('key', 3600); // Set TTL
```

## 🔧 Troubleshooting

### Common Issues

#### 1. Connection Refused
```bash
# Check Redis container status
docker ps | grep redis

# Check Redis logs
docker logs i3m-redis

# Test connection
docker exec i3m-redis redis-cli -a i3m_password ping
```

#### 2. Database Conflicts
```bash
# Check which services use same DB
grep -r "REDIS_DB=" docker-compose.yml

# Reallocate databases to avoid conflicts
```

#### 3. Memory Issues
```bash
# Check memory usage
docker exec i3m-redis redis-cli -a i3m_password info memory

# Clear specific database
docker exec i3m-redis redis-cli -a i3m_password -n DB_NUMBER flushdb
```

## 📊 Performance Optimization

### 1. Memory Optimization
- Set appropriate TTL for keys
- Use Redis data structures efficiently
- Monitor memory usage regularly

### 2. Connection Optimization
- Use connection pooling
- Set appropriate timeout values
- Monitor connection count

### 3. Monitoring
- Track key patterns
- Monitor memory usage
- Check connection count
- Analyze performance metrics

## 🔄 Backup & Recovery

### Backup Redis Data
```bash
# Create backup
docker exec i3m-redis redis-cli -a i3m_password --rdb /data/backup.rdb

# Copy backup file
docker cp i3m-redis:/data/backup.rdb ./redis-backup.rdb
```

### Restore Redis Data
```bash
# Copy backup to container
docker cp ./redis-backup.rdb i3m-redis:/data/dump.rdb

# Restart Redis container
docker restart i3m-redis
```

## 📝 Environment Variables Template

```bash
# Redis Configuration Template
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=i3m_password
REDIS_DATABASE=0
REDIS_URL=redis://:i3m_password@redis:6379/0

# Spring Boot Redis Configuration
SPRING_DATA_REDIS_HOST=redis
SPRING_DATA_REDIS_PORT=6379
SPRING_DATA_REDIS_PASSWORD=i3m_password
SPRING_DATA_REDIS_DATABASE=0
SPRING_DATA_REDIS_TIMEOUT=2000ms

# Redis Connection Pool
REDIS_POOL_MAX_ACTIVE=20
REDIS_POOL_MAX_IDLE=10
REDIS_POOL_MIN_IDLE=5
REDIS_POOL_MAX_WAIT=1000ms
```

## 🎯 Summary

I3M Platform sử dụng Redis với:
- **26+ services** sử dụng Redis
- **16 databases** (0-15) được allocate
- **No conflicts** giữa các services
- **Standardized configuration** across all services
- **Ready for production** deployment

---

*Last updated: 2025-09-28*
*Version: 1.0*
