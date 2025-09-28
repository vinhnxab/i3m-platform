const express = require('express');
const router = express.Router();
const logger = require('../config/logger');

router.get('/', (req, res) => {
  logger.info('List templates endpoint hit');
  res.status(200).json({ 
    message: 'List templates endpoint',
    templates: [
      { id: 'template1', name: 'Basic Template', type: 'html' },
      { id: 'template2', name: 'React Template', type: 'react' },
      { id: 'template3', name: 'Vue Template', type: 'vue' }
    ]
  });
});

router.post('/', (req, res) => {
  logger.info('Create template endpoint hit');
  res.status(200).json({ 
    message: 'Create template endpoint',
    templateId: 'template_' + Date.now()
  });
});

module.exports = router;
