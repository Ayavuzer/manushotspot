const Redis = require('redis');
require('dotenv').config();

const redisClient = Redis.createClient({
  url: process.env.REDIS_URL
});

redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

const connectRedis = async () => {
  try {
    await redisClient.connect();
  } catch (error) {
    console.error('Redis connection error:', error);
    // Retry connection after delay
    setTimeout(connectRedis, 5000);
  }
};

module.exports = {
  redisClient,
  connectRedis
};
