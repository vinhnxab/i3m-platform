const jwt = require('jsonwebtoken');
const config = require('../config/config');
const logger = require('../utils/logger');

module.exports = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '') || req.header('x-auth-token');
    const tenantId = req.header('X-Tenant-ID');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided, authorization denied'
      });
    }

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        message: 'Tenant ID is required'
      });
    }

    const decoded = jwt.verify(token, config.jwt.secret);
    req.user = decoded;
    req.tenantId = tenantId;
    
    logger.debug('User authenticated:', { userId: decoded.id, tenantId });
    next();
  } catch (error) {
    logger.warn('Authentication failed:', { error: error.message, token: req.header('Authorization') });
    return res.status(401).json({
      success: false,
      message: 'Token is not valid'
    });
  }
};
