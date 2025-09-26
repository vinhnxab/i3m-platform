const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');
const mongoose = require('mongoose');
const cron = require('node-cron');

const config = require('./config/config');
const logger = require('./config/logger');
const { connectDB } = require('./config/database');
const { connectRedis } = require('./config/redis');
const { setupMetrics, metricsMiddleware } = require('./config/metrics');

// Import services
const ExchangeRateService = require('./services/exchangeRateService');

// Import routes
const healthRoutes = require('./controllers/healthController');
const exchangeRoutes = require('./controllers/exchangeController');
const ratesRoutes = require('./controllers/ratesController');
const conversionRoutes = require('./controllers/conversionController');

const app = express();

// Trust proxy (for rate limiting behind reverse proxy)
app.set('trust proxy', 1);

// Compression middleware
app.use(compression());

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Tenant-ID'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5000, // limit each IP to 5000 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Speed limiting for heavy endpoints
const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 1000, // allow 1000 requests per 15 minutes at full speed
  delayMs: 100 // add 100ms delay per request after delayAfter
});
app.use('/api/v1/currency/convert', speedLimiter);

// Body parsing middleware
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Metrics middleware
app.use(metricsMiddleware);

// API routes
app.use('/health', healthRoutes);
app.use('/api/v1/currency', exchangeRoutes);
app.use('/api/v1/rates', ratesRoutes);
app.use('/api/v1/convert', conversionRoutes);

// Metrics endpoint
app.get('/metrics', setupMetrics);

// Root route
app.get('/', (req, res) => {
  res.json({
    service: 'Currency Exchange Service',
    version: '1.0.0',
    description: 'Real-time currency exchange rates and conversion service',
    endpoints: {
      'Health Check': '/health',
      'Exchange Rates': '/api/v1/rates',
      'Currency Conversion': '/api/v1/convert',
      'Supported Currencies': '/api/v1/currency/supported',
      'Metrics': '/metrics'
    },
    features: [
      'Real-time exchange rates',
      'Multi-provider rate aggregation',
      'Historical rate data',
      'Currency conversion',
      'Rate alerts and notifications',
      'Caching for performance',
      'Multi-tenant support'
    ],
    supportedCurrencies: [
      'USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 
      'SEK', 'NZD', 'MXN', 'SGD', 'HKD', 'NOK', 'TRY', 'ZAR',
      'BRL', 'INR', 'KRW', 'RUB', 'PLN', 'THB', 'IDR', 'HUF',
      'CZK', 'ILS', 'CLP', 'PHP', 'AED', 'COP', 'SAR', 'MYR',
      'RON', 'BGN', 'HRK', 'ISK', 'DKK', 'EGP', 'QAR', 'KWD'
    ]
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.originalUrl} not found`,
    availableEndpoints: [
      'GET /health - Service health check',
      'GET /api/v1/rates - Get current exchange rates',
      'POST /api/v1/convert - Convert currency amounts',
      'GET /api/v1/currency/supported - List supported currencies',
      'GET /api/v1/rates/historical - Get historical rates'
    ]
  });
});

// Global error handler
app.use((error, req, res, next) => {
  logger.error('Global error handler:', {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  res.status(error.status || 500).json({
    error: error.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// Exchange rate update scheduler
const exchangeRateService = new ExchangeRateService();

// Update rates every 5 minutes
cron.schedule('*/5 * * * *', async () => {
  try {
    logger.info('Starting scheduled exchange rate update');
    await exchangeRateService.updateAllRates();
    logger.info('Scheduled exchange rate update completed');
  } catch (error) {
    logger.error('Scheduled exchange rate update failed:', error);
  }
});

// Update historical data daily at 1 AM
cron.schedule('0 1 * * *', async () => {
  try {
    logger.info('Starting daily historical rate update');
    await exchangeRateService.updateHistoricalRates();
    logger.info('Daily historical rate update completed');
  } catch (error) {
    logger.error('Daily historical rate update failed:', error);
  }
});

// Cleanup old data weekly on Sunday at 2 AM
cron.schedule('0 2 * * 0', async () => {
  try {
    logger.info('Starting weekly data cleanup');
    await exchangeRateService.cleanupOldData();
    logger.info('Weekly data cleanup completed');
  } catch (error) {
    logger.error('Weekly data cleanup failed:', error);
  }
});

// Database connections and server startup
async function startServer() {
  try {
    // Connect to MongoDB
    await connectDB();
    logger.info('Connected to MongoDB');

    // Connect to Redis
    await connectRedis();
    logger.info('Connected to Redis');

    // Initialize exchange rate service
    await exchangeRateService.initialize();
    logger.info('Exchange rate service initialized');

    // Perform initial rate update
    await exchangeRateService.updateAllRates();
    logger.info('Initial exchange rate update completed');

    // Start server
    const server = app.listen(config.port, () => {
      logger.info(`Currency Exchange Service running on port ${config.port}`);
      logger.info(`Health check available at: http://localhost:${config.port}/health`);
      logger.info(`Exchange rates API available at: http://localhost:${config.port}/api/v1/rates`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      logger.info('SIGTERM received, shutting down gracefully');
      server.close(() => {
        logger.info('Process terminated');
        mongoose.connection.close();
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      logger.info('SIGINT received, shutting down gracefully');
      server.close(() => {
        logger.info('Process terminated');
        mongoose.connection.close();
        process.exit(0);
      });
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

module.exports = app;
