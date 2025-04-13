const amqp = require('amqplib');
require('dotenv').config();

let connection = null;
let channel = null;

const connectRabbitMQ = async () => {
  try {
    connection = await amqp.connect(process.env.RABBITMQ_URL);
    channel = await connection.createChannel();
    
    console.log('Connected to RabbitMQ');
    
    // Define queues
    await channel.assertQueue('logs', { durable: true });
    await channel.assertQueue('notifications', { durable: true });
    await channel.assertQueue('firewall_commands', { durable: true });
    await channel.assertQueue('reports', { durable: true });
    
    return { connection, channel };
  } catch (error) {
    console.error('RabbitMQ connection error:', error);
    // Retry connection after delay
    setTimeout(connectRabbitMQ, 5000);
    return null;
  }
};

const publishMessage = async (queue, message) => {
  try {
    if (!channel) {
      await connectRabbitMQ();
    }
    
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
      persistent: true
    });
    
    return true;
  } catch (error) {
    console.error('Error publishing message to RabbitMQ:', error);
    return false;
  }
};

const consumeMessages = async (queue, callback) => {
  try {
    if (!channel) {
      await connectRabbitMQ();
    }
    
    channel.consume(queue, (message) => {
      if (message !== null) {
        const content = JSON.parse(message.content.toString());
        callback(content);
        channel.ack(message);
      }
    });
  } catch (error) {
    console.error(`Error consuming messages from queue ${queue}:`, error);
  }
};

module.exports = {
  connectRabbitMQ,
  publishMessage,
  consumeMessages
};
