const redis = require('redis');
require('dotenv').config();

// Redis connection URL from environment variables
const redisUrl = process.env.REDIS_URL;

// Create Redis client
const client = redis.createClient({
  url: redisUrl
});

// Handle Redis connection events
client.on('connect', () => {
  console.log('Redis client connected');
});

client.on('error', (err) => {
  console.error('Redis client error:', err);
});

client.on('reconnecting', () => {
  console.log('Redis client reconnecting');
});

// Connect to Redis
const connect = async () => {
  try {
    await client.connect();
    return client;
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
    return null;
  }
};

// Set value with optional expiration
const setValue = async (key, value, expireSeconds = null) => {
  try {
    if (!client.isOpen) {
      await connect();
    }
    
    const options = {};
    if (expireSeconds) {
      options.EX = expireSeconds;
    }
    
    // Convert objects to JSON strings
    const valueToStore = typeof value === 'object' ? JSON.stringify(value) : value;
    
    await client.set(key, valueToStore, options);
    return true;
  } catch (error) {
    console.error(`Error setting Redis key ${key}:`, error);
    return false;
  }
};

// Get value
const getValue = async (key) => {
  try {
    if (!client.isOpen) {
      await connect();
    }
    
    const value = await client.get(key);
    
    // Try to parse JSON if possible
    if (value) {
      try {
        return JSON.parse(value);
      } catch (e) {
        return value;
      }
    }
    
    return null;
  } catch (error) {
    console.error(`Error getting Redis key ${key}:`, error);
    return null;
  }
};

// Delete key
const deleteKey = async (key) => {
  try {
    if (!client.isOpen) {
      await connect();
    }
    
    await client.del(key);
    return true;
  } catch (error) {
    console.error(`Error deleting Redis key ${key}:`, error);
    return false;
  }
};

// Check if key exists
const exists = async (key) => {
  try {
    if (!client.isOpen) {
      await connect();
    }
    
    const result = await client.exists(key);
    return result === 1;
  } catch (error) {
    console.error(`Error checking if Redis key ${key} exists:`, error);
    return false;
  }
};

// Set key expiration
const expire = async (key, seconds) => {
  try {
    if (!client.isOpen) {
      await connect();
    }
    
    await client.expire(key, seconds);
    return true;
  } catch (error) {
    console.error(`Error setting expiration for Redis key ${key}:`, error);
    return false;
  }
};

// Close connection
const close = async () => {
  try {
    if (client.isOpen) {
      await client.quit();
      console.log('Redis connection closed');
    }
    return true;
  } catch (error) {
    console.error('Error closing Redis connection:', error);
    return false;
  }
};

module.exports = {
  connect,
  setValue,
  getValue,
  deleteKey,
  exists,
  expire,
  close,
  client
};
