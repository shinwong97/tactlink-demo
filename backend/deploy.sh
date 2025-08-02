#!/bin/bash

# EC2 Deployment Script for GraphQL Backend
# This script sets up the environment and deploys the application

set -e

echo "🚀 Starting EC2 deployment for GraphQL Backend..."

# Update system packages
echo "📦 Updating system packages..."
sudo yum update -y

# Install Docker
echo "🐳 Installing Docker..."
sudo yum install -y docker
sudo service docker start
sudo usermod -a -G docker ec2-user

# Install Docker Compose
echo "📋 Installing Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Node.js (for development/testing)
echo "📦 Installing Node.js..."
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Create application directory
echo "📁 Setting up application directory..."
sudo mkdir -p /opt/tactlink-backend
sudo chown ec2-user:ec2-user /opt/tactlink-backend

# Copy application files (assuming they're uploaded to /tmp)
echo "📋 Copying application files..."
cp -r /tmp/backend/* /opt/tactlink-backend/
cd /opt/tactlink-backend

# Build and start the application
echo "🔨 Building and starting the application..."
docker-compose up -d --build

# Wait for application to start
echo "⏳ Waiting for application to start..."
sleep 10

# Check if application is running
if curl -f http://localhost:4000/health > /dev/null 2>&1; then
    echo "✅ Application deployed successfully!"
    echo "🌐 GraphQL endpoint: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4):4000"
else
    echo "❌ Application failed to start. Check logs with: docker-compose logs"
    exit 1
fi

echo "🎉 Deployment completed!" 