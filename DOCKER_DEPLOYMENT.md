# Docker Deployment Guide

This guide explains how to deploy the Hotspot application using Docker.

## Prerequisites

- Docker and Docker Compose installed on your server
- Git installed on your server

## Deployment Steps

1. Clone the repository:
   ```
   git clone https://github.com/Ayavuzer/manushotspot.git
   cd manushotspot
   ```

2. Start the application:
   ```
   docker-compose up -d
   ```

3. Check if all containers are running:
   ```
   docker-compose ps
   ```

4. Access the application:
   - Frontend: http://your-server-ip
   - Backend API: http://your-server-ip/api/v1

## Default Credentials

- Username: admin
- Password: password123

## Configuration

You can modify the environment variables in the `docker-compose.yml` file to change:
- Database connection details
- RabbitMQ connection details
- JWT secrets and expiration times
- API version
- Ports

## Troubleshooting

If you encounter any issues:

1. Check container logs:
   ```
   docker-compose logs backend
   docker-compose logs frontend
   docker-compose logs postgres
   ```

2. Restart services:
   ```
   docker-compose restart
   ```

3. Rebuild containers if needed:
   ```
   docker-compose build --no-cache
   docker-compose up -d
   ```

## Stopping the Application

To stop the application:
```
docker-compose down
```

To stop and remove volumes (will delete database data):
```
docker-compose down -v
```
