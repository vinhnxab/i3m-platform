const express = require('express');
const router = express.Router();
const logger = require('../config/logger');

router.post('/generate', (req, res) => {
  logger.info('Generate preview endpoint hit');
  res.status(200).json({ 
    message: 'Generate preview endpoint',
    previewId: 'preview_' + Date.now(),
    status: 'generating'
  });
});

router.get('/:id', (req, res) => {
  logger.info('Get preview by ID endpoint hit');
  res.status(200).json({ 
    message: 'Get preview by ID endpoint',
    id: req.params.id,
    status: 'ready'
  });
});

module.exports = router;
