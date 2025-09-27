# I3M Platform Environment Configuration

## Required Environment Variables

### Database Configuration
```bash
DATABASE_URL=postgresql://i3m_user:i3m_password@postgres:5432/i3m_platform
TIMESCALEDB_URL=postgresql://i3m_user:i3m_password@timescaledb:5432/i3m_analytics
MONGODB_URI=mongodb://i3m_user:i3m_password@mongodb:27017/i3m_platform?authSource=admin
REDIS_URL=redis://:i3m_password@redis:6379
```

### Security
```bash
JWT_SECRET=your-super-secret-jwt-key-here-change-in-production
SECRET_KEY=your-super-secret-key-here-change-in-production
```

### External Services
```bash
FIREBASE_PROJECT_ID=your-firebase-project-id
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

### Service URLs
```bash
AUTH_SERVICE_URL=http://auth-service:3008
USER_SERVICE_URL=http://user-service:3009
API_GATEWAY_URL=http://api-gateway:3004
```

### CORS Configuration
```bash
CORS_ORIGINS=http://localhost:3000,http://localhost:3001,http://localhost:8000
```

### Monitoring
```bash
ENABLE_METRICS=true
ENABLE_SWAGGER=true
ENABLE_REDOC=true
```

### Logging
```bash
LOG_LEVEL=INFO
LOG_FORMAT=json
```

### Rate Limiting
```bash
RATE_LIMIT_ENABLED=true
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_PERIOD=60
```

### File Storage
```bash
STORAGE_TYPE=local
STORAGE_BUCKET=i3m-platform-storage
STORAGE_ACCESS_KEY=
STORAGE_SECRET_KEY=
STORAGE_ENDPOINT=
```

### ML/AI Configuration
```bash
MLFLOW_TRACKING_URI=http://mlflow:5000
MODEL_STORAGE_PATH=/app/models
ENABLE_GPU=false
```

### Business Configuration
```bash
DEFAULT_TIMEZONE=UTC
DEFAULT_LANGUAGE=en
DEFAULT_CURRENCY=USD
```

## Port Configuration

### Core Services
- API Gateway: 3004
- Auth Service: 3008
- User Service: 3009

### Analytics Services
- AI Service: 3017
- ML Pipeline Service: 3018
- Analytics Service: 3019
- User Analytics Service: 3020

### Content Services
- Content Service: 3021
- Media Service: 3022
- Metadata Service: 3023

### ERP Services
- Finance Service: 3028
- HRM Service: 3029
- Inventory Service: 3030
- Procurement Service: 3031
- E-commerce Service: 3014
- CRM Service: 3015

### Industry Services
- Healthcare Service: 3034
- Agriculture Service: 3035

### Infrastructure Services
- Security Service: 3040
- Observability Service: 3041
- Cost Optimization Service: 3042
- Load Balancer Service: 3043
- Secrets Management Service: 3044

### Integration Services
- API Documentation Service: 3050
- Integration Service: 3051
- Currency Exchange Service: 3052

### Marketplace Services
- Template Marketplace Service: 3060
- Installation Service: 3061
- Preview Service: 3062

### Shared Services
- Notification Service: 3070
- Workflow Service: 3071
- Billing Service: 3072

### Databases
- PostgreSQL: 5433
- TimescaleDB: 5434
- MongoDB: 27017
- Redis: 6380
- Elasticsearch: 9200
- Kafka: 9092

### Monitoring
- Prometheus: 9090
- Grafana: 3000
