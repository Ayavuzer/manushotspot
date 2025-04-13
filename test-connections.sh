#!/bin/bash

# Script to test database connection
echo "Testing PostgreSQL connection..."
cd /home/ubuntu/hotspot-app/backend
node -e "
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('PostgreSQL connection error:', err);
    process.exit(1);
  } else {
    console.log('PostgreSQL connected successfully:', res.rows[0]);
    process.exit(0);
  }
});
"

if [ $? -ne 0 ]; then
  echo "PostgreSQL connection test failed!"
  exit 1
else
  echo "PostgreSQL connection test passed!"
fi

# Test Redis connection
echo "Testing Redis connection..."
node -e "
const redis = require('redis');
require('dotenv').config();

const client = redis.createClient({
  url: process.env.REDIS_URL
});

client.on('error', (err) => {
  console.error('Redis error:', err);
  process.exit(1);
});

async function testRedis() {
  try {
    await client.connect();
    await client.set('test_key', 'test_value');
    const value = await client.get('test_key');
    console.log('Redis test value:', value);
    await client.quit();
    process.exit(0);
  } catch (err) {
    console.error('Redis test failed:', err);
    process.exit(1);
  }
}

testRedis();
"

if [ $? -ne 0 ]; then
  echo "Redis connection test failed!"
  exit 1
else
  echo "Redis connection test passed!"
fi

# Test RabbitMQ connection
echo "Testing RabbitMQ connection..."
node -e "
const amqp = require('amqplib');
require('dotenv').config();

async function testRabbitMQ() {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    console.log('RabbitMQ connected successfully');
    const channel = await connection.createChannel();
    await channel.assertQueue('test_queue', { durable: true });
    console.log('RabbitMQ queue created successfully');
    await channel.close();
    await connection.close();
    process.exit(0);
  } catch (err) {
    console.error('RabbitMQ test failed:', err);
    process.exit(1);
  }
}

testRabbitMQ();
"

if [ $? -ne 0 ]; then
  echo "RabbitMQ connection test failed!"
  exit 1
else
  echo "RabbitMQ connection test passed!"
fi

echo "All connection tests passed successfully!"
