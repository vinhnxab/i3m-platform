# Redis Quick Reference - I3M Platform

## 🗂️ Database Allocation

| DB | Service | Port | Purpose |
|----|---------|------|---------|
| 0 | notification-service | 3070 | Message queue |
| 1 | auth-service | 3008 | Token blacklist |
| 2 | user-service | 3009 | Session management |
| 3 | finance-service | 3010 | Transaction caching |
| 4 | hrm-service | 3029 | Employee data |
| 5 | inventory-service | 3030 | Product caching |
| 6 | procurement-service | 3031 | Order caching |
| 7 | ecommerce-service | 3014 | Cart & session |
| 8 | ai-service | 3017 | ML model caching |
| 9 | currency-exchange-service | 3052 | Exchange rates |
| 10 | analytics-service | 3019 | Analytics data |
| 11 | user-analytics-service | 3020 | User behavior |
| 12 | content-service | 3021 | Content caching |
| 13 | media-service | 3022 | Media metadata |
| 14 | api-documentation-service | 3050 | API docs |
| 15 | preview-service | 3062 | Template caching |

## 🔧 Common Commands

### Redis Container Management
```bash
# Check Redis status
docker ps | grep redis

# View Redis logs
docker logs i3m-redis

# Connect to Redis CLI
docker exec -it i3m-redis redis-cli -a i3m_password

# Test connection
docker exec i3m-redis redis-cli -a i3m_password ping
```

### Redis Information
```bash
# General info
docker exec i3m-redis redis-cli -a i3m_password info

# Memory usage
docker exec i3m-redis redis-cli -a i3m_password info memory

# Keyspace info
docker exec i3m-redis redis-cli -a i3m_password info keyspace

# Monitor commands
docker exec i3m-redis redis-cli -a i3m_password monitor
```

### Database Operations
```bash
# Select database
docker exec i3m-redis redis-cli -a i3m_password -n DB_NUMBER

# List all keys in database
docker exec i3m-redis redis-cli -a i3m_password -n DB_NUMBER keys "*"

# Clear specific database
docker exec i3m-redis redis-cli -a i3m_password -n DB_NUMBER flushdb

# Clear all databases
docker exec i3m-redis redis-cli -a i3m_password flushall
```

## 🚨 Troubleshooting

### Connection Issues
```bash
# 1. Check Redis container
docker ps | grep redis

# 2. Check Redis logs
docker logs i3m-redis

# 3. Test connection
docker exec i3m-redis redis-cli -a i3m_password ping

# 4. Check network connectivity
docker exec SERVICE_NAME ping redis
```

### Memory Issues
```bash
# Check memory usage
docker exec i3m-redis redis-cli -a i3m_password info memory

# Check memory by database
docker exec i3m-redis redis-cli -a i3m_password -n DB_NUMBER dbsize

# Clear specific database
docker exec i3m-redis redis-cli -a i3m_password -n DB_NUMBER flushdb
```

### Service-Specific Issues
```bash
# Check service Redis configuration
docker exec SERVICE_NAME env | grep REDIS

# Test service Redis connection
docker exec SERVICE_NAME redis-cli -h redis -p 6379 -a i3m_password ping
```

## 📊 Monitoring

### Key Metrics
```bash
# Memory usage
docker exec i3m-redis redis-cli -a i3m_password info memory | grep used_memory_human

# Connection count
docker exec i3m-redis redis-cli -a i3m_password info clients | grep connected_clients

# Key count per database
for i in {0..15}; do
  echo "DB $i: $(docker exec i3m-redis redis-cli -a i3m_password -n $i dbsize) keys"
done
```

### Performance Monitoring
```bash
# Monitor real-time commands
docker exec i3m-redis redis-cli -a i3m_password monitor

# Check slow queries
docker exec i3m-redis redis-cli -a i3m_password slowlog get 10

# Reset slow log
docker exec i3m-redis redis-cli -a i3m_password slowlog reset
```

## 🔧 Configuration Templates

### Go Services
```go
REDIS_URL=redis://:i3m_password@redis:6379/DB_NUMBER
```

### Java Spring Boot
```yaml
SPRING_DATA_REDIS_HOST=redis
SPRING_DATA_REDIS_PORT=6379
SPRING_DATA_REDIS_PASSWORD=i3m_password
SPRING_DATA_REDIS_DATABASE=DB_NUMBER
```

### Node.js Services
```javascript
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=i3m_password
REDIS_DB=DB_NUMBER
```

### Python Services
```python
REDIS_URL=redis://:i3m_password@redis:6379/DB_NUMBER
```

## 🎯 Service Health Checks

### Check All Services Redis Status
```bash
# Core services
curl -s http://localhost:3008/health | jq .redis
curl -s http://localhost:3009/health | jq .redis

# ERP services
curl -s http://localhost:3029/health | jq .redis
curl -s http://localhost:3030/health | jq .redis

# Analytics services
curl -s http://localhost:3017/health | jq .redis
curl -s http://localhost:3019/health | jq .redis
```

## 📝 Quick Fixes

### Reset Redis Database
```bash
# Clear specific service database
docker exec i3m-redis redis-cli -a i3m_password -n DB_NUMBER flushdb

# Restart Redis container
docker restart i3m-redis
```

### Restart Service with Redis
```bash
# Restart specific service
docker compose restart SERVICE_NAME

# Rebuild and restart
docker compose build SERVICE_NAME
docker compose up -d SERVICE_NAME
```

### Check Redis Configuration
```bash
# Verify Redis config in docker-compose.yml
grep -A 10 -B 5 "REDIS" docker-compose.yml

# Check service environment variables
docker exec SERVICE_NAME env | grep REDIS
```

---

*Quick Reference for I3M Platform Redis Management*
*Last updated: 2025-09-28*
