const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const config = require('./config/config');
const logger = require('./utils/logger');

const app = express();

// Trust proxy
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP'
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
}

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState;
    const dbStatus = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };

    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'Media Service',
      version: '1.0.0',
      uptime: process.uptime(),
      checks: {
        database: {
          status: dbState === 1 ? 'healthy' : 'unhealthy',
          state: dbStatus[dbState]
        }
      }
    };

    if (dbState !== 1) {
      health.status = 'unhealthy';
      return res.status(503).json(health);
    }

    res.json(health);
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      service: 'Media Service',
      version: '1.0.0',
      error: error.message
    });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    service: 'I3M Media Service',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

// Basic API endpoints for media
app.get('/api/v1/media', (req, res) => {
  const tenantId = req.header('X-Tenant-ID');
  if (!tenantId) {
    return res.status(400).json({
      success: false,
      message: 'Tenant ID is required'
    });
  }

  res.json({
    success: true,
    message: 'Media list retrieved successfully',
    data: [],
    pagination: {
      page: 1,
      limit: 20,
      total: 0,
      pages: 0
    }
  });
});

app.post('/api/v1/media/upload', (req, res) => {
  const tenantId = req.header('X-Tenant-ID');
  if (!tenantId) {
    return res.status(400).json({
      success: false,
      message: 'Tenant ID is required'
    });
  }

  res.json({
    success: true,
    message: 'Media upload endpoint ready',
    data: {
      id: 'media-123',
      filename: 'example.jpg',
      url: '/uploads/example.jpg',
      size: 1024,
      type: 'image/jpeg'
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Global error handler
app.use((error, req, res, next) => {
  logger.error('Unhandled error:', {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method
  });

  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal server error'
  });
});

// Database connection
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://i3m_user:i3m_password@mongodb:27017/i3m_media_db?authSource=admin');
    logger.info('Connected to MongoDB successfully');
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

// Start server
async function startServer() {
  try {
    await connectDB();
    
    const port = process.env.PORT || 3021;
    const server = app.listen(port, () => {
      logger.info(`Media Service running on port ${port}`);
    });

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        logger.error(`Port ${port} is already in use`);
        process.exit(1);
      } else {
        logger.error('Server error:', error);
      }
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server if this file is run directly
if (require.main === module) {
  startServer();
}

module.exports = app;
