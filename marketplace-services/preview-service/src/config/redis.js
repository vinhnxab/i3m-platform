const redis = require('redis');
const config = require('./config');
const logger = require('./logger');

let redisClient;

const connectRedis = async () => {
  try {
    redisClient = redis.createClient({
      url: `redis://${config.redis.host}:${config.redis.port}`,
      password: config.redis.password,
      database: config.redis.db,
      socket: {
        connectTimeout: 5000,
        reconnectStrategy: (retries) => {
          if (retries > config.redis.maxRetriesPerRequest) {
            return new Error('Redis: Too many retries');
          }
          return config.redis.retryDelayOnFailover * retries;
        },
      },
    });

    redisClient.on('error', (err) => logger.error('Redis Client Error:', err));
    redisClient.on('connect', () => logger.info('Redis client connected'));
    redisClient.on('ready', () => logger.info('Redis client ready to use'));
    redisClient.on('end', () => logger.info('Redis client disconnected'));

    await redisClient.connect();
    logger.info('Redis connected successfully');
  } catch (error) {
    logger.error('Redis connection error:', error);
    // Do not exit process, allow service to run without Redis if it's not critical
  }
};

const getRedisClient = () => redisClient;

module.exports = { connectRedis, getRedisClient };
