const express = require('express');
const router = express.Router();
const logger = require('../config/logger');

// Send notification
router.post('/send', async (req, res) => {
  try {
    const { type, recipient, subject, message, data } = req.body;
    
    logger.info('Sending notification:', { type, recipient, subject });
    
    // Simulate notification sending
    const notification = {
      id: Date.now().toString(),
      type,
      recipient,
      subject,
      message,
      data,
      status: 'sent',
      timestamp: new Date().toISOString()
    };
    
    // Emit to WebSocket clients
    const io = req.app.get('io');
    if (io) {
      io.emit('notification', notification);
    }
    
    res.json({
      success: true,
      message: 'Notification sent successfully',
      notification
    });
  } catch (error) {
    logger.error('Error sending notification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send notification',
      error: error.message
    });
  }
});

// Get notification history
router.get('/history', async (req, res) => {
  try {
    const { tenantId, limit = 50, offset = 0 } = req.query;
    
    // Simulate notification history
    const notifications = [
      {
        id: '1',
        type: 'email',
        recipient: 'user@example.com',
        subject: 'Welcome to I3M Platform',
        message: 'Welcome to our platform!',
        status: 'sent',
        timestamp: new Date().toISOString()
      },
      {
        id: '2',
        type: 'push',
        recipient: 'device-token-123',
        subject: 'New Message',
        message: 'You have a new message',
        status: 'delivered',
        timestamp: new Date(Date.now() - 3600000).toISOString()
      }
    ];
    
    res.json({
      success: true,
      notifications,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: notifications.length
      }
    });
  } catch (error) {
    logger.error('Error getting notification history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get notification history',
      error: error.message
    });
  }
});

module.exports = router;
