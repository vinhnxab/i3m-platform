const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    // Check MongoDB connection
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
      service: 'Template Marketplace Service',
      version: '1.0.0',
      uptime: process.uptime(),
      checks: {
        database: {
          status: dbState === 1 ? 'healthy' : 'unhealthy',
          state: dbStatus[dbState],
          host: mongoose.connection.host,
          name: mongoose.connection.name
        },
        memory: {
          used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
          total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
          external: Math.round(process.memoryUsage().external / 1024 / 1024)
        }
      }
    };

    // Set status based on checks
    if (dbState !== 1) {
      health.status = 'unhealthy';
      return res.status(503).json(health);
    }

    res.json(health);
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      service: 'Template Marketplace Service',
      version: '1.0.0',
      error: error.message
    });
  }
});

module.exports = router;
