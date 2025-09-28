const redis = require('redis');
const config = require('./config');
const logger = require('./logger');

let redisClient;

const connectRedis = async () => {
  try {
    redisClient = redis.createClient({
      host: config.redis.host,
      port: config.redis.port,
      password: config.redis.password,
      db: config.redis.db,
      retryDelayOnFailover: config.redis.retryDelayOnFailover,
      maxRetriesPerRequest: config.redis.maxRetriesPerRequest,
    });

    redisClient.on('error', (err) => {
      logger.error('Redis Client Error:', err);
    });

    redisClient.on('connect', () => {
      logger.info('Redis Client Connected');
    });

    await redisClient.connect();
    return redisClient;
  } catch (error) {
    logger.error('Redis connection error:', error);
    throw error;
  }
};

const getRedisClient = () => redisClient;

module.exports = { connectRedis, getRedisClient };
