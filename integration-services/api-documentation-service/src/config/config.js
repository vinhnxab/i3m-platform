require('dotenv').config();

const config = {
  // Server configuration
  port: process.env.PORT || 3050,
  env: process.env.NODE_ENV || 'development',
  
  // Database configuration
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://i3m_user:i3m_password@localhost:27017/i3m_api_docs_db?authSource=admin',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    }
  },
  
  // Redis configuration
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT) || 6380,
    password: process.env.REDIS_PASSWORD || 'i3m_redis_password',
    db: parseInt(process.env.REDIS_DB) || 6,
    retryDelayOnFailover: 100,
    maxRetriesPerRequest: 3,
  },
  
  // JWT configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-here',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },
  
  // API Documentation specific configuration
  documentation: {
    autoDiscovery: process.env.AUTO_DISCOVERY === 'true' || true,
    discoveryInterval: parseInt(process.env.DISCOVERY_INTERVAL) || 300000, // 5 minutes
    maxServices: parseInt(process.env.MAX_SERVICES) || 100,
    cacheTimeout: parseInt(process.env.CACHE_TIMEOUT) || 3600, // 1 hour
  },
  
  // Service discovery
  services: {
    apiGateway: process.env.API_GATEWAY_URL || 'http://localhost:3004',
    authService: process.env.AUTH_SERVICE_URL || 'http://localhost:3008',
    userService: process.env.USER_SERVICE_URL || 'http://localhost:3009',
    // Add other service URLs as needed
  },
  
  // Swagger/OpenAPI configuration
  swagger: {
    title: 'I3M Platform API Documentation',
    version: '1.0.0',
    description: 'Comprehensive API documentation for I3M Platform microservices',
    termsOfService: 'https://i3m-platform.com/terms',
    contact: {
      name: 'I3M Platform Support',
      email: 'support@i3m-platform.com',
      url: 'https://i3m-platform.com/support'
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT'
    }
  },
  
  // Testing configuration
  testing: {
    enabled: process.env.TESTING_ENABLED === 'true' || true,
    maxConcurrentTests: parseInt(process.env.MAX_CONCURRENT_TESTS) || 10,
    defaultTimeout: parseInt(process.env.DEFAULT_TIMEOUT) || 30000,
    retryAttempts: parseInt(process.env.RETRY_ATTEMPTS) || 3,
  },
  
  // Security configuration
  security: {
    rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000, // 15 minutes
    rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX) || 1000,
    corsOrigins: process.env.CORS_ORIGINS?.split(',') || ['*'],
    trustedProxies: process.env.TRUSTED_PROXIES?.split(',') || [],
  },
  
  // Logging configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.LOG_FORMAT || 'json',
    maxFiles: parseInt(process.env.LOG_MAX_FILES) || 5,
    maxSize: process.env.LOG_MAX_SIZE || '10m',
  },
  
  // Monitoring configuration
  monitoring: {
    metricsEnabled: process.env.METRICS_ENABLED === 'true' || true,
    healthCheckInterval: parseInt(process.env.HEALTH_CHECK_INTERVAL) || 60000, // 1 minute
    prometheusEnabled: process.env.PROMETHEUS_ENABLED === 'true' || true,
  }
};

module.exports = config;
