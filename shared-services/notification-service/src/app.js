const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const redis = require('redis');
const { createServer } = require('http');
const { Server } = require('socket.io');

const config = require('./config/config');
const logger = require('./config/logger');
const { connectDB } = require('./config/database');
const { connectRedis } = require('./config/redis');
const { setupMetrics, metricsMiddleware } = require('./config/metrics');

// Import routes
const healthRoutes = require('./controllers/healthController');
const notificationRoutes = require('./controllers/notificationController');
const analyticsRoutes = require('./controllers/analyticsController');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    methods: ['GET', 'POST']
  }
});

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
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
  max: 5000, // limit each IP to 5000 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Metrics middleware
app.use(metricsMiddleware);

// API routes
app.use('/health', healthRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/analytics', analyticsRoutes);

// WebSocket connection handling
io.on('connection', (socket) => {
  logger.info(`Client connected: ${socket.id}`);
  
  socket.on('join-tenant', (tenantId) => {
    socket.join(`tenant-${tenantId}`);
    logger.info(`Client ${socket.id} joined tenant ${tenantId}`);
  });
  
  socket.on('disconnect', () => {
    logger.info(`Client disconnected: ${socket.id}`);
  });
});

// Make io available to routes
app.set('io', io);

// Metrics endpoint
app.get('/metrics', setupMetrics);

// Root route
app.get('/', (req, res) => {
  res.json({
    service: 'Notification Service',
    version: '1.0.0',
    description: 'Push/email notifications and analytics service',
    endpoints: {
      'Health Check': '/health',
      'Send Notifications': '/api/v1/notifications',
      'Analytics': '/api/v1/analytics',
      'WebSocket': '/socket.io/',
      'Metrics': '/metrics'
    },
    features: [
      'Push notifications (Firebase)',
      'Email notifications (SMTP)',
      'SMS notifications (Twilio)',
      'Real-time WebSocket delivery',
      'Notification analytics',
      'Template management',
      'Multi-tenant support',
      'Scheduled notifications'
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
      'POST /api/v1/notifications/send - Send notification',
      'GET /api/v1/notifications/history - Get notification history',
      'GET /api/v1/analytics/dashboard - Get analytics dashboard'
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
    // Connect to MongoDB
    await connectDB();
    logger.info('Connected to MongoDB');

    // Connect to Redis
    await connectRedis();
    logger.info('Connected to Redis');

    // Start server
    server.listen(config.port, () => {
      logger.info(`Notification Service running on port ${config.port}`);
      logger.info(`Health check available at: http://localhost:${config.port}/health`);
      logger.info(`WebSocket available at: http://localhost:${config.port}/socket.io/`);
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
