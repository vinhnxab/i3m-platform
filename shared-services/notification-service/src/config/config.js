require('dotenv').config();

const config = {
  // Server configuration
  port: process.env.PORT || 3070,
  env: process.env.NODE_ENV || 'development',
  
  // Database configuration
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://i3m_user:i3m_password@localhost:27017/i3m_notification_db?authSource=admin',
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
    password: process.env.REDIS_PASSWORD || 'i3m_password',
    db: parseInt(process.env.REDIS_DB) || 17,
    retryDelayOnFailover: 100,
    maxRetriesPerRequest: 3,
  },
  
  // JWT configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-here',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },
  
  // Email configuration
  email: {
    provider: process.env.EMAIL_PROVIDER || 'smtp',
    smtp: {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true' || false,
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || ''
      }
    },
    from: process.env.EMAIL_FROM || 'noreply@i3m-platform.com',
    replyTo: process.env.EMAIL_REPLY_TO || 'support@i3m-platform.com'
  },
  
  // Push notification configuration
  push: {
    firebase: {
      projectId: process.env.FIREBASE_PROJECT_ID || '',
      privateKey: process.env.FIREBASE_PRIVATE_KEY || '',
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL || '',
      databaseURL: process.env.FIREBASE_DATABASE_URL || ''
    },
    vapid: {
      publicKey: process.env.VAPID_PUBLIC_KEY || '',
      privateKey: process.env.VAPID_PRIVATE_KEY || '',
      subject: process.env.VAPID_SUBJECT || 'mailto:admin@i3m-platform.com'
    }
  },
  
  // SMS configuration
  sms: {
    provider: process.env.SMS_PROVIDER || 'twilio',
    twilio: {
      accountSid: process.env.TWILIO_ACCOUNT_SID || '',
      authToken: process.env.TWILIO_AUTH_TOKEN || '',
      fromNumber: process.env.TWILIO_FROM_NUMBER || ''
    }
  },
  
  // Notification configuration
  notification: {
    maxRetries: parseInt(process.env.NOTIFICATION_MAX_RETRIES) || 3,
    retryDelay: parseInt(process.env.NOTIFICATION_RETRY_DELAY) || 5000, // 5 seconds
    batchSize: parseInt(process.env.NOTIFICATION_BATCH_SIZE) || 100,
    rateLimit: parseInt(process.env.NOTIFICATION_RATE_LIMIT) || 1000, // per hour
    retentionDays: parseInt(process.env.NOTIFICATION_RETENTION_DAYS) || 90,
    templateCacheExpiry: parseInt(process.env.TEMPLATE_CACHE_EXPIRY) || 3600, // 1 hour
  },
  
  // Analytics configuration
  analytics: {
    enabled: process.env.ANALYTICS_ENABLED === 'true' || true,
    trackingInterval: parseInt(process.env.ANALYTICS_TRACKING_INTERVAL) || 60000, // 1 minute
    metricsRetention: parseInt(process.env.ANALYTICS_METRICS_RETENTION) || 30, // days
  },
  
  // Security configuration
  security: {
    rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000, // 15 minutes
    rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX) || 5000,
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
