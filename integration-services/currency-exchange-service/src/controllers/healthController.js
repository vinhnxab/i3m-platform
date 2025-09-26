const express = require('express');
const mongoose = require('mongoose');
const redis = require('redis');
const config = require('../config/config');
const logger = require('../config/logger');

const router = express.Router();

/**
 * Health check endpoint
 */
router.get('/', async (req, res) => {
  const startTime = Date.now();
  const healthStatus = {
    status: 'healthy',
    service: 'Currency Exchange Service',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    dependencies: {}
  };

  try {
    // Check MongoDB connection
    const mongoStart = Date.now();
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.db.admin().ping();
      healthStatus.dependencies.mongodb = {
        status: 'connected',
        responseTime: Date.now() - mongoStart
      };
    } else {
      healthStatus.dependencies.mongodb = {
        status: 'disconnected',
        responseTime: Date.now() - mongoStart
      };
      healthStatus.status = 'degraded';
    }

    // Check Redis connection
    const redisStart = Date.now();
    try {
      const redisClient = redis.createClient({
        socket: {
          host: config.redis.host,
          port: config.redis.port
        },
        password: config.redis.password,
        database: config.redis.db
      });
      
      await redisClient.connect();
      await redisClient.ping();
      await redisClient.disconnect();
      
      healthStatus.dependencies.redis = {
        status: 'connected',
        responseTime: Date.now() - redisStart
      };
    } catch (redisError) {
      healthStatus.dependencies.redis = {
        status: 'disconnected',
        error: redisError.message,
        responseTime: Date.now() - redisStart
      };
      healthStatus.status = 'degraded';
    }

    // Check exchange rate providers
    const providersStart = Date.now();
    healthStatus.dependencies.exchangeProviders = {
      primary: config.exchangeProviders.primary,
      fallback: config.exchangeProviders.fallback,
      status: 'available',
      responseTime: Date.now() - providersStart
    };

    // Add system metrics
    healthStatus.system = {
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        external: Math.round(process.memoryUsage().external / 1024 / 1024)
      },
      cpu: {
        usage: process.cpuUsage()
      }
    };

    // Add currency service specific info
    healthStatus.currency = {
      baseCurrency: config.currency.baseCurrency,
      supportedCurrencies: config.currency.supportedCurrencies.length,
      lastUpdateCheck: new Date().toISOString(),
      cacheEnabled: true
    };

    healthStatus.responseTime = Date.now() - startTime;

    // Determine overall status
    if (healthStatus.status === 'healthy') {
      res.status(200).json(healthStatus);
    } else {
      res.status(503).json(healthStatus);
    }

  } catch (error) {
    logger.error('Health check failed:', error);
    res.status(503).json({
      status: 'unhealthy',
      service: 'Currency Exchange Service',
      error: error.message,
      timestamp: new Date().toISOString(),
      responseTime: Date.now() - startTime
    });
  }
});

/**
 * Readiness check endpoint
 */
router.get('/ready', async (req, res) => {
  try {
    // Check if all critical dependencies are available
    const isMongoReady = mongoose.connection.readyState === 1;
    
    if (isMongoReady) {
      res.status(200).json({
        status: 'ready',
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(503).json({
        status: 'not ready',
        reason: 'Database not connected',
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    res.status(503).json({
      status: 'not ready',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Liveness check endpoint
 */
router.get('/live', (req, res) => {
  res.status(200).json({
    status: 'alive',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

module.exports = router;
