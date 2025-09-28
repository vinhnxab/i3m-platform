const redis = require('redis');
const logger = require('./logger');

let redisClient;

const connectRedis = async () => {
  try {
    redisClient = redis.createClient({
      socket: {
        host: process.env.REDIS_HOST || 'redis',
        port: parseInt(process.env.REDIS_PORT) || 6379
      },
      password: process.env.REDIS_PASSWORD || 'i3m_password',
      database: parseInt(process.env.REDIS_DB) || 0
    });

    redisClient.on('error', (err) => {
      logger.error('Redis Client Error:', err);
    });

    redisClient.on('connect', () => {
      logger.info('Redis Client Connected');
    });

    await redisClient.connect();
    logger.info('Redis connected successfully');
  } catch (error) {
    logger.error('Redis connection error:', error);
    throw error;
  }
};

const getRedisClient = () => redisClient;

module.exports = { connectRedis, getRedisClient };
