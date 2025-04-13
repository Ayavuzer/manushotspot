const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { connectRedis } = require('./config/redis');
const { connectRabbitMQ } = require('./config/rabbitmq');
const sequelize = require('./config/database');
const logger = require('./config/logger');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const organizationRoutes = require('./routes/organizationRoutes');
const userRoutes = require('./routes/userRoutes');
const firewallRoutes = require('./routes/firewallRoutes');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;
const API_VERSION = process.env.API_VERSION || 'v1';

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } })); // HTTP request logging

// API routes
app.use(`/api/${API_VERSION}/auth`, authRoutes);
app.use(`/api/${API_VERSION}/organizations`, organizationRoutes);
app.use(`/api/${API_VERSION}/users`, userRoutes);
app.use(`/api/${API_VERSION}/firewalls`, firewallRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(`Error: ${err.message}`, { stack: err.stack });
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Initialize database and start server
const startServer = async () => {
  try {
    // Connect to database
    await sequelize.authenticate();
    logger.info('Connected to PostgreSQL database');
    
    // Connect to Redis
    await connectRedis();
    logger.info('Connected to Redis');
    
    // Connect to RabbitMQ
    await connectRabbitMQ();
    logger.info('Connected to RabbitMQ');
    
    // Start server
    app.listen(PORT, '0.0.0.0', () => {
      logger.info(`Server running on port ${PORT}`);
      logger.info(`API available at http://localhost:${PORT}/api/${API_VERSION}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

module.exports = app; // Export for testing
