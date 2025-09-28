const express = require('express');
const router = express.Router();
const logger = require('../config/logger');

router.get('/supported', (req, res) => {
  logger.info('Supported currencies endpoint hit');
  res.status(200).json({ 
    message: 'Supported currencies endpoint',
    currencies: ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY']
  });
});

module.exports = router;
