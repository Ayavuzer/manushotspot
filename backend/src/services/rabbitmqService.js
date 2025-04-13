const amqp = require('amqplib');
require('dotenv').config();

// RabbitMQ connection URL from environment variables
const rabbitmqUrl = process.env.RABBITMQ_URL;

// Connection and channel variables
let connection = null;
let channel = null;

// Queue names
const QUEUES = {
  LOGS: 'logs',
  NOTIFICATIONS: 'notifications',
  FIREWALL_COMMANDS: 'firewall_commands',
  REPORTS: 'reports'
};

// Connect to RabbitMQ
const connect = async () => {
  try {
    // Create connection
    connection = await amqp.connect(rabbitmqUrl);
    
    // Handle connection close
    connection.on('close', () => {
      console.error('RabbitMQ connection closed, attempting to reconnect...');
      setTimeout(connect, 5000);
    });
    
    // Handle connection error
    connection.on('error', (err) => {
      console.error('RabbitMQ connection error:', err);
      if (connection) {
        connection.close();
      }
    });
    
    // Create channel
    channel = await connection.createChannel();
    
    // Assert queues
    await channel.assertQueue(QUEUES.LOGS, { durable: true });
    await channel.assertQueue(QUEUES.NOTIFICATIONS, { durable: true });
    await channel.assertQueue(QUEUES.FIREWALL_COMMANDS, { durable: true });
    await channel.assertQueue(QUEUES.REPORTS, { durable: true });
    
    console.log('Connected to RabbitMQ and channels created');
    
    return { connection, channel };
  } catch (error) {
    console.error('Failed to connect to RabbitMQ:', error);
    setTimeout(connect, 5000);
    return null;
  }
};

// Publish message to queue
const publishMessage = async (queue, message) => {
  try {
    if (!channel) {
      await connect();
    }
    
    const messageBuffer = Buffer.from(JSON.stringify(message));
    return channel.sendToQueue(queue, messageBuffer, { persistent: true });
  } catch (error) {
    console.error(`Error publishing message to queue ${queue}:`, error);
    return false;
  }
};

// Consume messages from queue
const consumeMessages = async (queue, callback) => {
  try {
    if (!channel) {
      await connect();
    }
    
    return channel.consume(queue, (message) => {
      if (message !== null) {
        try {
          const content = JSON.parse(message.content.toString());
          callback(content);
          channel.ack(message);
        } catch (error) {
          console.error(`Error processing message from queue ${queue}:`, error);
          channel.nack(message);
        }
      }
    });
  } catch (error) {
    console.error(`Error consuming messages from queue ${queue}:`, error);
    return null;
  }
};

// Close connection
const close = async () => {
  try {
    if (channel) {
      await channel.close();
    }
    if (connection) {
      await connection.close();
    }
    console.log('RabbitMQ connection closed');
  } catch (error) {
    console.error('Error closing RabbitMQ connection:', error);
  }
};

module.exports = {
  connect,
  publishMessage,
  consumeMessages,
  close,
  QUEUES
};
