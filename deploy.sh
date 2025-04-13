#!/bin/bash

# Script to deploy the hotspot application
echo "Starting deployment process..."

# Set environment variables
export NODE_ENV=production

# Backend deployment
echo "Deploying backend services..."
cd /home/ubuntu/hotspot-app/backend

# Install production dependencies
echo "Installing backend dependencies..."
npm install --production

# Create database schema if not exists
echo "Setting up database schema..."
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

const fs = require('fs');
const path = require('path');

async function setupDatabase() {
  try {
    // Read schema SQL file
    const schemaPath = path.join('/home/ubuntu/hotspot-app/database', 'schema.sql');
    
    if (!fs.existsSync(schemaPath)) {
      console.log('Schema file not found at', schemaPath);
      console.log('Creating basic schema instead...');
      
      // Create basic schema if file doesn't exist
      await pool.query(\`
        -- Create basic tables if they don't exist
        CREATE TABLE IF NOT EXISTS organizations (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          address TEXT,
          phone VARCHAR(50),
          email VARCHAR(255),
          logo_url TEXT,
          is_active BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS roles (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          description TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          username VARCHAR(100) NOT NULL UNIQUE,
          email VARCHAR(255) NOT NULL,
          password VARCHAR(255) NOT NULL,
          first_name VARCHAR(100),
          last_name VARCHAR(100),
          phone VARCHAR(50),
          role_id INTEGER REFERENCES roles(id),
          is_super_admin BOOLEAN DEFAULT FALSE,
          organization_id INTEGER REFERENCES organizations(id),
          last_login TIMESTAMP,
          is_active BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- Insert default roles if not exist
        INSERT INTO roles (name, description)
        VALUES 
          ('Super Admin', 'Full system access'),
          ('Organization Admin', 'Full organization access'),
          ('Manager', 'Manage organization resources'),
          ('Staff', 'Regular staff access'),
          ('Read Only', 'View only access')
        ON CONFLICT (name) DO NOTHING;

        -- Insert default super admin if not exist
        INSERT INTO users (username, email, password, first_name, last_name, is_super_admin, is_active)
        VALUES ('admin', 'admin@example.com', '$2a$10$iqJSHD.BGr0E2IxQwYgJmeP3NvhPrXAeLSaGCj6IR/XU5QtjVu5Tm', 'System', 'Admin', TRUE, TRUE)
        ON CONFLICT (username) DO NOTHING;
      \`);
      
      console.log('Basic schema created successfully');
    } else {
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      await pool.query(schemaSql);
      console.log('Database schema created from file successfully');
    }
    
    process.exit(0);
  } catch (err) {
    console.error('Error setting up database schema:', err);
    process.exit(1);
  }
}

setupDatabase();
"

if [ $? -ne 0 ]; then
  echo "Database schema setup failed!"
  exit 1
else
  echo "Database schema setup completed successfully!"
fi

# Create .env file if not exists
if [ ! -f .env ]; then
  echo "Creating .env file..."
  cat > .env << EOL
PORT=3000
API_VERSION=v1
NODE_ENV=production
DB_USER=postgres
DB_PASSWORD=112446Aa
DB_HOST=212.156.247.238
DB_PORT=5432
DB_NAME=mrtbt
DB_SSL=false
RABBITMQ_URL=amqps://ixavmtsc:0fTOOtTQFBXEdcs6yFm8vVkF5xAYRCXX@ostrich.lmq.cloudamqp.com/ixavmtsc
REDIS_URL=redis://default:112446Aa@212.156.247.238:6379
JWT_SECRET=hotspot_jwt_secret_key_change_in_production
JWT_REFRESH_SECRET=hotspot_refresh_secret_key_change_in_production
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGIN=*
EOL
fi

# Start backend server
echo "Starting backend server..."
npm install pm2 -g
pm2 start src/app.js --name hotspot-backend

# Frontend deployment
echo "Deploying frontend application..."
cd /home/ubuntu/hotspot-app/frontend

# Create .env file for frontend
echo "Creating frontend environment file..."
cat > .env << EOL
REACT_APP_API_URL=http://localhost:3000/api/v1
EOL

# Install dependencies if needed
echo "Installing frontend dependencies..."
npm install --legacy-peer-deps

# Create production build
echo "Creating production build..."
npm run build

# Serve frontend using a simple HTTP server
echo "Setting up frontend server..."
npm install -g serve
pm2 start serve --name hotspot-frontend -- -s build -l 3001

echo "Deployment completed successfully!"
echo "Backend API is running on: http://localhost:3000/api/v1"
echo "Frontend application is running on: http://localhost:3001"
echo "Default admin credentials: username: admin, password: password123"
