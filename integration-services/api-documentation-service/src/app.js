const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const mongoose = require('mongoose');
const redis = require('redis');

const config = require('./config/config');
const logger = require('./config/logger');
const { connectDB } = require('./config/database');
const { connectRedis } = require('./config/redis');
const { setupMetrics, metricsMiddleware } = require('./config/metrics');

// Import routes
const healthRoutes = require('./controllers/healthController');
const documentationRoutes = require('./controllers/documentationController');
const apiRoutes = require('./controllers/apiController');
const testingRoutes = require('./controllers/testingController');

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
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
  max: 1000, // limit each IP to 1000 requests per windowMs
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

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'I3M Platform API Documentation Service',
      version: '1.0.0',
      description: 'Auto-generated API documentation and testing service for I3M Platform microservices',
      contact: {
        name: 'I3M Platform Team',
        email: 'api@i3m-platform.com',
        url: 'https://i3m-platform.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: `http://localhost:${config.port}`,
        description: 'Development server'
      },
      {
        url: 'https://api.i3m-platform.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        },
        tenantHeader: {
          type: 'apiKey',
          in: 'header',
          name: 'X-Tenant-ID'
        }
      }
    },
    security: [
      {
        bearerAuth: [],
        tenantHeader: []
      }
    ]
  },
  apis: [
    './src/controllers/*.js',
    './src/routes/*.js',
    './docs/*.yaml',
    './docs/*.yml'
  ]
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Swagger UI setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'I3M Platform API Documentation',
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    filter: true,
    showExtensions: true,
    showCommonExtensions: true,
    tryItOutEnabled: true
  }
}));

// Serve swagger spec as JSON
app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Static files for documentation assets
app.use('/static', express.static('public'));
app.use('/docs/assets', express.static('docs/assets'));

// API routes
app.use('/health', healthRoutes);
app.use('/api/v1/documentation', documentationRoutes);
app.use('/api/v1/apis', apiRoutes);
app.use('/api/v1/testing', testingRoutes);

// Metrics endpoint
app.get('/metrics', setupMetrics);

// Root route
app.get('/', (req, res) => {
  res.json({
    service: 'API Documentation Service',
    version: '1.0.0',
    description: 'Auto-generated API documentation and testing service',
    endpoints: {
      'API Documentation': '/api-docs',
      'Swagger JSON': '/swagger.json',
      'Health Check': '/health',
      'Metrics': '/metrics'
    },
    features: [
      'Auto-generated API documentation',
      'Interactive API testing',
      'Multi-service documentation aggregation',
      'OpenAPI 3.0 specification',
      'Real-time API discovery',
      'Authentication testing',
      'Response validation'
    ]
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.originalUrl} not found`,
    availableEndpoints: [
      'GET /api-docs - Interactive API documentation',
      'GET /swagger.json - OpenAPI specification',
      'GET /health - Service health check',
      'POST /api/v1/documentation/generate - Generate documentation',
      'GET /api/v1/apis - List available APIs',
      'POST /api/v1/testing/run - Run API tests'
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

// Database connections
async function startServer() {
  try {
    // Connect to MongoDB
    await connectDB();
    logger.info('Connected to MongoDB');

    // Connect to Redis
    await connectRedis();
    logger.info('Connected to Redis');

    // Start server
    const server = app.listen(config.port, () => {
      logger.info(`API Documentation Service running on port ${config.port}`);
      logger.info(`API Documentation available at: http://localhost:${config.port}/api-docs`);
      logger.info(`Swagger JSON available at: http://localhost:${config.port}/swagger.json`);
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
