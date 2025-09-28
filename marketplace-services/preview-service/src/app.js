const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
// const mongoose = require('mongoose');
const redis = require('redis');

const config = require('./config/config');
const logger = require('./config/logger');
// const { connectDB } = require('./config/database');
const { connectRedis } = require('./config/redis');
const { setupMetrics, metricsMiddleware } = require('./config/metrics');

// Import routes
const healthRoutes = require('./controllers/healthController');
const previewRoutes = require('./controllers/previewController');
const templateRoutes = require('./controllers/templateController');

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      connectSrc: ["'self'", "ws:", "wss:"],
    },
  },
}));

// Compression middleware
app.use(compression());

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
  max: 2000, // limit each IP to 2000 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Metrics middleware
app.use(metricsMiddleware);

// Static files for preview assets
app.use('/static', express.static('public'));
app.use('/preview', express.static('public/preview'));

// API routes
app.use('/health', healthRoutes);
app.use('/api/v1/preview', previewRoutes);
app.use('/api/v1/templates', templateRoutes);

// Metrics endpoint
app.get('/metrics', setupMetrics);

// Root route
app.get('/', (req, res) => {
  res.json({
    service: 'Template Preview Service',
    version: '1.0.0',
    description: 'Live template preview and caching service',
    endpoints: {
      'Health Check': '/health',
      'Preview Templates': '/api/v1/preview',
      'Template Management': '/api/v1/templates',
      'Metrics': '/metrics'
    },
    features: [
      'Live template preview',
      'Real-time rendering',
      'Redis caching for performance',
      'Screenshot generation',
      'Template versioning',
      'Multi-tenant support',
      'CDN integration'
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
      'POST /api/v1/preview/generate - Generate template preview',
      'GET /api/v1/preview/:id - Get preview by ID',
      'GET /api/v1/templates - List available templates'
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

// Database connections and server startup
async function startServer() {
  try {
    // Connect to Redis
    await connectRedis();
    logger.info('Connected to Redis');

    // Start server
    const server = app.listen(config.port, () => {
      logger.info(`Template Preview Service running on port ${config.port}`);
      logger.info(`Health check available at: http://localhost:${config.port}/health`);
      logger.info(`Preview API available at: http://localhost:${config.port}/api/v1/preview`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      logger.info('SIGTERM received, shutting down gracefully');
      server.close(() => {
        logger.info('Process terminated');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      logger.info('SIGINT received, shutting down gracefully');
      server.close(() => {
        logger.info('Process terminated');
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
