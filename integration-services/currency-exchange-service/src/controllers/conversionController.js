const express = require('express');
const router = express.Router();
const logger = require('../config/logger');

router.post('/', (req, res) => {
  logger.info('Currency conversion endpoint hit');
  res.status(200).json({ 
    message: 'Currency conversion endpoint',
    result: {
      from: req.body.from || 'USD',
      to: req.body.to || 'EUR',
      amount: req.body.amount || 100,
      converted: 85.0
    }
  });
});

module.exports = router;
