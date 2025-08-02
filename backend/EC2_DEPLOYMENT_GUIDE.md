# EC2 Deployment Guide for GraphQL Backend

This guide will walk you through deploying your TactLink GraphQL backend to an AWS EC2 instance.

## Prerequisites

- AWS Account with EC2 access
- SSH key pair for EC2 instance
- Basic knowledge of AWS console and SSH

## Step 1: Launch EC2 Instance

### 1.1 Create EC2 Instance

1. Go to AWS Console → EC2 → Instances → Launch Instance
2. Choose **Amazon Linux 2023** (recommended)
3. Select **t3.micro** (free tier) or **t3.small** for production
4. Configure Security Groups:
   - **SSH (22)**: Your IP only
   - **HTTP (80)**: 0.0.0.0/0 (if using load balancer)
   - **HTTPS (443)**: 0.0.0.0/0 (if using SSL)
   - **Custom TCP (4000)**: 0.0.0.0/0 (GraphQL endpoint)
   - **Custom TCP (4001)**: 0.0.0.0/0 (Health check endpoint)

### 1.2 Instance Configuration

- **Instance Type**: t3.micro (free tier) or t3.small
- **Storage**: 8GB GP2 (minimum)
- **IAM Role**: Create one with EC2 permissions if needed
- **User Data**: Leave empty (we'll run setup scripts manually)

## Step 2: Connect to EC2 Instance

```bash
# Connect via SSH (replace with your key and instance details)
ssh -i your-key.pem ec2-user@your-instance-public-ip
```

## Step 3: Initial Setup

### 3.1 Upload Your Code

```bash
# From your local machine, upload the backend folder
scp -i your-key.pem -r backend/ ec2-user@your-instance-public-ip:/tmp/
```

### 3.2 Run Initial Setup Script

```bash
# On the EC2 instance
cd /tmp/backend
chmod +x ec2-setup.sh
./ec2-setup.sh
```

## Step 4: Deploy Application

### 4.1 Run Deployment Script

```bash
# On the EC2 instance
cd /tmp/backend
chmod +x deploy.sh
./deploy.sh
```

### 4.2 Verify Deployment

```bash
# Check if containers are running
docker ps

# Check application logs
docker-compose logs

# Test health endpoint
curl http://localhost:4001/health

# Test GraphQL endpoint
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ __typename }"}'
```

## Step 5: Configure Domain and SSL (Optional)

### 5.1 Set Up Domain

1. Point your domain to the EC2 instance's public IP
2. Wait for DNS propagation

### 5.2 Install Nginx and SSL

```bash
# Install Nginx
sudo yum install -y nginx

# Configure Nginx
sudo tee /etc/nginx/conf.d/graphql.conf > /dev/null <<EOF
server {
    listen 80;
    server_name your-domain.com;

    location /graphql {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    location /health {
        proxy_pass http://localhost:4001;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }
}
EOF

# Start Nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

### 5.3 Install SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo yum install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Set up auto-renewal
sudo crontab -e
# Add this line: 0 12 * * * /usr/bin/certbot renew --quiet
```

## Step 6: Monitoring and Maintenance

### 6.1 Set Up Logging

```bash
# View application logs
docker-compose logs -f

# View system logs
sudo journalctl -u docker -f
```

### 6.2 Set Up Monitoring

```bash
# Install basic monitoring tools
sudo yum install -y htop iotop

# Monitor system resources
htop
```

### 6.3 Backup Strategy

```bash
# Create backup script
sudo tee /opt/backup.sh > /dev/null <<EOF
#!/bin/bash
BACKUP_DIR="/opt/backups"
DATE=\$(date +%Y%m%d_%H%M%S)

mkdir -p \$BACKUP_DIR
docker-compose -f /opt/tactlink-backend/docker-compose.yml down
tar -czf \$BACKUP_DIR/tactlink-backend_\$DATE.tar.gz /opt/tactlink-backend
docker-compose -f /opt/tactlink-backend/docker-compose.yml up -d
EOF

chmod +x /opt/backup.sh

# Add to crontab for daily backups
sudo crontab -e
# Add: 0 2 * * * /opt/backup.sh
```

## Step 7: Update Application

### 7.1 Deploy Updates

```bash
# Pull latest code
cd /opt/tactlink-backend
git pull origin main  # if using git

# Rebuild and restart
docker-compose down
docker-compose up -d --build
```

### 7.2 Rollback Strategy

```bash
# If you need to rollback
cd /opt/tactlink-backend
docker-compose down
# Restore from backup
tar -xzf /opt/backups/tactlink-backend_YYYYMMDD_HHMMSS.tar.gz -C /
docker-compose up -d
```

## Troubleshooting

### Common Issues

1. **Port 4000 not accessible**

   - Check security group settings
   - Verify firewall rules: `sudo iptables -L`

2. **Docker not starting**

   - Check Docker service: `sudo systemctl status docker`
   - Restart Docker: `sudo systemctl restart docker`

3. **Application not responding**

   - Check container status: `docker ps`
   - View logs: `docker-compose logs`
   - Check health endpoint: `curl http://localhost:4001/health`

4. **High memory usage**
   - Monitor with: `htop`
   - Restart containers: `docker-compose restart`

### Useful Commands

```bash
# View running containers
docker ps

# View container logs
docker-compose logs -f

# Restart application
docker-compose restart

# Update application
docker-compose down && docker-compose up -d --build

# Check system resources
free -h
df -h
top

# Check network connectivity
netstat -tlnp
```

## Security Considerations

1. **Keep system updated**: `sudo yum update -y`
2. **Use strong SSH keys**: Generate new keys regularly
3. **Limit SSH access**: Only allow specific IPs
4. **Monitor logs**: Check `/var/log/secure` for SSH attempts
5. **Use HTTPS**: Always use SSL in production
6. **Regular backups**: Automate backup processes
7. **Security groups**: Only open necessary ports

## Cost Optimization

1. **Use Spot Instances**: For non-critical workloads
2. **Right-size instances**: Monitor usage and adjust
3. **Use reserved instances**: For predictable workloads
4. **Enable auto-scaling**: For variable traffic
5. **Use CloudWatch**: Monitor costs and usage

## Next Steps

1. Set up CI/CD pipeline for automated deployments
2. Configure CloudWatch monitoring and alerts
3. Set up load balancing for high availability
4. Implement database persistence (RDS)
5. Add CDN for static assets
6. Set up automated backups to S3

---

**Note**: This guide assumes a single-instance deployment. For production environments, consider using AWS ECS, EKS, or Application Load Balancer for better scalability and reliability.
