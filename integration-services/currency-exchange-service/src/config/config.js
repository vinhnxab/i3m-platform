require('dotenv').config();

const config = {
  // Server configuration
  port: process.env.PORT || 3052,
  env: process.env.NODE_ENV || 'development',
  
  // Database configuration
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://i3m_user:i3m_password@mongodb:27017/i3m_currency_db?authSource=admin',
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
    host: process.env.REDIS_HOST || 'redis',
    port: parseInt(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD || 'i3m_password',
    db: parseInt(process.env.REDIS_DB) || 8,
    retryDelayOnFailover: 100,
    maxRetriesPerRequest: 3,
  },
  
  // JWT configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-here',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },
  
  // Exchange rate providers
  exchangeProviders: {
    primary: process.env.PRIMARY_EXCHANGE_PROVIDER || 'fixer',
    fallback: process.env.FALLBACK_EXCHANGE_PROVIDER || 'exchangerate',
    
    // Fixer.io configuration
    fixer: {
      apiKey: process.env.FIXER_API_KEY || 'your-fixer-api-key',
      baseUrl: 'http://data.fixer.io/api',
      timeout: 10000,
      rateLimit: 1000 // requests per month for free plan
    },
    
    // ExchangeRate-API configuration
    exchangerate: {
      apiKey: process.env.EXCHANGERATE_API_KEY || 'your-exchangerate-api-key',
      baseUrl: 'https://v6.exchangerate-api.com/v6',
      timeout: 10000,
      rateLimit: 1500 // requests per month for free plan
    },
    
    // Open Exchange Rates configuration
    openExchangeRates: {
      apiKey: process.env.OPEN_EXCHANGE_RATES_API_KEY || 'your-openexchangerates-api-key',
      baseUrl: 'https://openexchangerates.org/api',
      timeout: 10000,
      rateLimit: 1000 // requests per month for free plan
    },
    
    // CurrencyLayer configuration
    currencyLayer: {
      apiKey: process.env.CURRENCYLAYER_API_KEY || 'your-currencylayer-api-key',
      baseUrl: 'http://api.currencylayer.com',
      timeout: 10000,
      rateLimit: 1000 // requests per month for free plan
    }
  },
  
  // Currency configuration
  currency: {
    baseCurrency: process.env.BASE_CURRENCY || 'USD',
    defaultPrecision: parseInt(process.env.DEFAULT_PRECISION) || 6,
    maxHistoricalDays: parseInt(process.env.MAX_HISTORICAL_DAYS) || 365,
    cacheExpiryMinutes: parseInt(process.env.CACHE_EXPIRY_MINUTES) || 5,
    
    // Supported currencies
    supportedCurrencies: [
      'USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 
      'SEK', 'NZD', 'MXN', 'SGD', 'HKD', 'NOK', 'TRY', 'ZAR',
      'BRL', 'INR', 'KRW', 'RUB', 'PLN', 'THB', 'IDR', 'HUF',
      'CZK', 'ILS', 'CLP', 'PHP', 'AED', 'COP', 'SAR', 'MYR',
      'RON', 'BGN', 'HRK', 'ISK', 'DKK', 'EGP', 'QAR', 'KWD'
    ],
    
    // Major currency pairs for enhanced monitoring
    majorPairs: [
      'EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/CHF', 
      'AUD/USD', 'USD/CAD', 'NZD/USD'
    ]
  },
  
  // Rate update configuration
  rateUpdate: {
    intervalMinutes: parseInt(process.env.RATE_UPDATE_INTERVAL) || 5,
    retryAttempts: parseInt(process.env.RATE_UPDATE_RETRIES) || 3,
    retryDelaySeconds: parseInt(process.env.RATE_UPDATE_RETRY_DELAY) || 30,
    batchSize: parseInt(process.env.RATE_UPDATE_BATCH_SIZE) || 50,
    historicalUpdateHour: parseInt(process.env.HISTORICAL_UPDATE_HOUR) || 1,
    cleanupRetentionDays: parseInt(process.env.CLEANUP_RETENTION_DAYS) || 90
  },
  
  // Conversion configuration
  conversion: {
    maxAmount: parseFloat(process.env.MAX_CONVERSION_AMOUNT) || 1000000000, // 1 billion
    minAmount: parseFloat(process.env.MIN_CONVERSION_AMOUNT) || 0.01,
    defaultPrecision: parseInt(process.env.CONVERSION_PRECISION) || 2,
    roundingMode: process.env.ROUNDING_MODE || 'ROUND_HALF_UP'
  },
  
  // Alert configuration
  alerts: {
    enabled: process.env.ALERTS_ENABLED === 'true' || true,
    thresholdPercent: parseFloat(process.env.ALERT_THRESHOLD_PERCENT) || 5.0,
    cooldownMinutes: parseInt(process.env.ALERT_COOLDOWN_MINUTES) || 60,
    maxAlertsPerDay: parseInt(process.env.MAX_ALERTS_PER_DAY) || 50
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
