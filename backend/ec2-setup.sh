#!/bin/bash

# EC2 Initial Setup Script
# Run this script after launching a new EC2 instance

set -e

echo "🔧 Setting up EC2 instance for GraphQL Backend deployment..."

# Update system
echo "📦 Updating system packages..."
sudo yum update -y

# Install essential tools
echo "🛠️ Installing essential tools..."
sudo yum install -y git curl wget unzip

# Configure firewall (if using iptables)
echo "🔥 Configuring firewall..."
sudo yum install -y iptables-services
sudo systemctl enable iptables
sudo systemctl start iptables

# Allow SSH, HTTP, and GraphQL port
sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 4000 -j ACCEPT
sudo iptables -A INPUT -i lo -j ACCEPT
sudo iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT
sudo iptables -P INPUT DROP

# Save iptables rules
sudo service iptables save

# Install and configure fail2ban (optional security)
echo "🛡️ Installing fail2ban..."
sudo yum install -y epel-release
sudo yum install -y fail2ban

# Create fail2ban configuration
sudo tee /etc/fail2ban/jail.local > /dev/null <<EOF
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 3

[sshd]
enabled = true
port = ssh
filter = sshd
logpath = /var/log/secure
maxretry = 3
EOF

sudo systemctl enable fail2ban
sudo systemctl start fail2ban

# Set up log rotation
echo "📝 Setting up log rotation..."
sudo tee /etc/logrotate.d/tactlink-backend > /dev/null <<EOF
/opt/tactlink-backend/logs/*.log {
    daily
    missingok
    rotate 7
    compress
    delaycompress
    notifempty
    create 644 ec2-user ec2-user
}
EOF

# Create application user (optional)
echo "👤 Creating application user..."
sudo useradd -r -s /bin/false tactlink-app

# Set up monitoring directory
sudo mkdir -p /opt/tactlink-backend/logs
sudo chown ec2-user:ec2-user /opt/tactlink-backend/logs

echo "✅ EC2 instance setup completed!"
echo "📋 Next steps:"
echo "1. Upload your backend code to /tmp/backend/"
echo "2. Run the deploy.sh script"
echo "3. Configure your security groups in AWS console" 