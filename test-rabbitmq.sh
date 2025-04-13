#!/bin/bash

# Script to test RabbitMQ connection
echo "Testing RabbitMQ connection..."
cd /home/ubuntu/hotspot-app/backend
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

echo "Connection tests completed!"
