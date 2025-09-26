require('dotenv').config();

const config = {
  // Server configuration
  port: process.env.PORT || 3062,
  env: process.env.NODE_ENV || 'development',
  
  // Redis configuration
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT) || 6380,
    password: process.env.REDIS_PASSWORD || 'i3m_password',
    db: parseInt(process.env.REDIS_DB) || 16,
    retryDelayOnFailover: 100,
    maxRetriesPerRequest: 3,
  },
  
  // Preview configuration
  preview: {
    maxConcurrentPreviews: parseInt(process.env.MAX_CONCURRENT_PREVIEWS) || 10,
    previewTimeout: parseInt(process.env.PREVIEW_TIMEOUT) || 30000, // 30 seconds
    cacheExpiry: parseInt(process.env.CACHE_EXPIRY) || 3600, // 1 hour
    screenshotQuality: parseInt(process.env.SCREENSHOT_QUALITY) || 90,
    screenshotFormat: process.env.SCREENSHOT_FORMAT || 'png',
    maxPreviewSize: parseInt(process.env.MAX_PREVIEW_SIZE) || 10485760, // 10MB
  },
  
  // Template configuration
  template: {
    supportedFormats: ['html', 'jsx', 'vue', 'react', 'angular'],
    maxTemplateSize: parseInt(process.env.MAX_TEMPLATE_SIZE) || 52428800, // 50MB
    allowedDomains: process.env.ALLOWED_DOMAINS?.split(',') || ['localhost', '127.0.0.1'],
    sandboxMode: process.env.SANDBOX_MODE === 'true' || true,
  },
  
  // CDN configuration
  cdn: {
    enabled: process.env.CDN_ENABLED === 'true' || false,
    baseUrl: process.env.CDN_BASE_URL || 'https://cdn.i3m-platform.com',
    uploadEndpoint: process.env.CDN_UPLOAD_ENDPOINT,
    apiKey: process.env.CDN_API_KEY,
  },
  
  // Security configuration
  security: {
    rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000, // 15 minutes
    rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX) || 2000,
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
