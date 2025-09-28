const express = require('express');
const router = express.Router();
const logger = require('../config/logger');

router.get('/', (req, res) => {
  logger.info('Exchange rates endpoint hit');
  res.status(200).json({ 
    message: 'Exchange rates endpoint',
    rates: {
      'USD/EUR': 0.85,
      'USD/GBP': 0.73,
      'USD/JPY': 110.0
    }
  });
});

router.get('/historical', (req, res) => {
  logger.info('Historical rates endpoint hit');
  res.status(200).json({ 
    message: 'Historical rates endpoint',
    data: []
  });
});

module.exports = router;
