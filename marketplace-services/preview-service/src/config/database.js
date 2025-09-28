const mongoose = require('mongoose');
const config = require('./config');
const logger = require('./logger');

const connectDB = async () => {
  try {
    // MongoDB connection is optional for preview service
    logger.info('Database connection not required for preview service');
  } catch (error) {
    logger.error('Database connection error:', error);
    // Do not exit process, allow service to run without database
  }
};

module.exports = { connectDB };
