const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { getRedisClient } = require('../config/redis');
const logger = require('../config/logger');

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     description: Check the health status of the API Documentation Service
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: healthy
 *                 service:
 *                   type: string
 *                   example: API Documentation Service
 *                 version:
 *                   type: string
 *                   example: 1.0.0
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 database:
 *                   type: string
 *                   example: connected
 *                 redis:
 *                   type: string
 *                   example: connected
 *       503:
 *         description: Service is unhealthy
 */
router.get('/', async (req, res) => {
  try {
    const health = {
      status: 'healthy',
      service: 'API Documentation Service',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      database: 'connected',
      redis: 'connected'
    };

    // Check database connection
    if (mongoose.connection.readyState !== 1) {
      health.status = 'unhealthy';
      health.database = 'disconnected';
    }

    // Check Redis connection
    try {
      const redisClient = getRedisClient();
      if (redisClient && redisClient.isOpen) {
        await redisClient.ping();
      } else {
        health.status = 'unhealthy';
        health.redis = 'disconnected';
      }
    } catch (error) {
      health.status = 'unhealthy';
      health.redis = 'disconnected';
    }

    const statusCode = health.status === 'healthy' ? 200 : 503;
    res.status(statusCode).json(health);

  } catch (error) {
    logger.error('Health check error:', error);
    res.status(503).json({
      status: 'unhealthy',
      service: 'API Documentation Service',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;