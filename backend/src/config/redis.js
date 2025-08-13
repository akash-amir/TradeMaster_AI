/**
 * Redis Configuration
 * Handles connection to Redis for BullMQ queue system
 */

const Redis = require('ioredis');
const logger = require('../utils/logger');

let redisClient = null;

const connectRedis = async () => {
  try {
    const redisConfig = {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT) || 6379,
      password: process.env.REDIS_PASSWORD || undefined,
      retryDelayOnFailover: 100,
      enableReadyCheck: false,
      maxRetriesPerRequest: null,
      lazyConnect: true,
      keepAlive: 30000,
      connectTimeout: 10000,
      commandTimeout: 5000,
    };

    // Use Redis URL if provided, otherwise use individual config
    if (process.env.REDIS_URL) {
      redisClient = new Redis(process.env.REDIS_URL, {
        ...redisConfig,
        lazyConnect: true,
      });
    } else {
      redisClient = new Redis(redisConfig);
    }

    // Handle Redis events
    redisClient.on('connect', () => {
      logger.info('Redis client connected');
    });

    redisClient.on('ready', () => {
      logger.info('Redis client ready');
    });

    redisClient.on('error', (err) => {
      logger.error('Redis client error:', err);
    });

    redisClient.on('close', () => {
      logger.warn('Redis client connection closed');
    });

    redisClient.on('reconnecting', () => {
      logger.info('Redis client reconnecting');
    });

    // Test connection
    await redisClient.connect();
    await redisClient.ping();
    
    logger.info(`Redis connected successfully on ${redisConfig.host}:${redisConfig.port}`);

    return redisClient;
  } catch (error) {
    logger.error('Redis connection failed:', error);
    throw error;
  }
};

const getRedisClient = () => {
  if (!redisClient) {
    throw new Error('Redis client not initialized. Call connectRedis() first.');
  }
  return redisClient;
};

const disconnectRedis = async () => {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
    logger.info('Redis client disconnected');
  }
};

module.exports = {
  connectRedis,
  getRedisClient,
  disconnectRedis,
};
