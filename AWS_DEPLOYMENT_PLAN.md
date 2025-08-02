# AWS EC2 Deployment Plan for GraphQL Backend

## Architecture Overview

### Current Application Analysis

- **Backend**: Node.js + TypeScript + Apollo GraphQL Server
- **Data Storage**: In-memory storage (non-persistent)
- **Authentication**: Dummy JWT-based auth
- **Port**: 4000
- **Dependencies**: Apollo Server, GraphQL, TypeScript

### Proposed AWS Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client Apps   │    │   Application   │    │   Data Layer    │
│  (Mobile/Web)   │───▶│   Load Balancer │───▶│   EC2 Instance  │
│                 │    │   (ALB)         │    │   (t3.micro)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   Route 53      │
                       │   (DNS)         │
                       ┌─────────────────┐
```

## AWS Services Required

### 1. **EC2 Instance**

- **Instance Type**: t3.micro (1 vCPU, 1 GB RAM)
- **OS**: Amazon Linux 2023
- **Storage**: 8 GB gp3 EBS volume
- **Purpose**: Host the GraphQL server

### 2. **Application Load Balancer (ALB)**

- **Type**: Application Load Balancer
- **Target Group**: EC2 instance on port 4000
- **Health Checks**: HTTP on /graphql endpoint
- **SSL/TLS**: ACM certificate for HTTPS

### 3. **Route 53**

- **Domain**: Custom domain (optional)
- **DNS**: A record pointing to ALB
- **Health Checks**: Monitor ALB health

### 4. **Security Groups**

- **ALB Security Group**:
  - Inbound: HTTP (80), HTTPS (443) from 0.0.0.0/0
  - Outbound: All traffic
- **EC2 Security Group**:
  - Inbound: HTTP (4000) from ALB security group
  - Outbound: All traffic

### 5. **IAM Roles**

- **EC2 Role**: Basic execution role for CloudWatch logs
- **Permissions**: Minimal required for application operation

## Deployment Steps

### Phase 1: Infrastructure Setup

1. **Create VPC and Subnets**

   - Default VPC with public subnets
   - Internet Gateway for external access

2. **Launch EC2 Instance**

   - Amazon Linux 2023 AMI
   - t3.micro instance type
   - Configure security groups
   - Attach IAM role

3. **Setup Application Load Balancer**
   - Create ALB in public subnets
   - Configure target group
   - Setup health checks

### Phase 2: Application Deployment

1. **Server Setup**

   ```bash
   # Install Node.js 18+
   curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
   sudo yum install -y nodejs

   # Install PM2 for process management
   sudo npm install -g pm2
   ```

2. **Application Deployment**

   ```bash
   # Clone repository
   git clone <repo-url>
   cd backend

   # Install dependencies
   npm install

   # Build application
   npm run compile

   # Start with PM2
   pm2 start dist/index.js --name "graphql-server"
   pm2 startup
   pm2 save
   ```

3. **Environment Configuration**
   ```bash
   # Create environment file
   sudo nano /etc/environment
   # Add: NODE_ENV=production
   # Add: PORT=4000
   ```

### Phase 3: Production Enhancements

1. **SSL/TLS Certificate**

   - Request ACM certificate for domain
   - Attach to ALB listener

2. **Monitoring Setup**

   - CloudWatch logs integration
   - Basic metrics monitoring
   - Alarm for instance health

3. **Backup Strategy**
   - EBS snapshots (weekly)
   - Application code backup

## Cost Estimate (US East - N. Virginia)

### Monthly Costs Breakdown

| Service                       | Specification         | Monthly Cost |
| ----------------------------- | --------------------- | ------------ |
| **EC2 t3.micro**              | 1 instance, 24/7      | $8.47        |
| **EBS gp3**                   | 8 GB storage          | $0.80        |
| **Application Load Balancer** | 1 ALB                 | $16.20       |
| **ALB Data Processing**       | ~1 GB/month           | $0.01        |
| **Route 53**                  | Hosted zone + queries | $0.50        |
| **Data Transfer**             | ~1 GB/month           | $0.09        |
| **CloudWatch**                | Basic monitoring      | $0.30        |
| **ACM Certificate**           | SSL certificate       | $0.00 (free) |

**Total Estimated Monthly Cost: ~$26.37**

### Cost Optimization Strategies

1. **Reserved Instances**: 1-year term could reduce EC2 costs by ~40%
2. **Spot Instances**: For non-critical workloads (not recommended for production)
3. **ALB Optimization**: Consider removing ALB for single-instance deployment
4. **Data Transfer**: Monitor and optimize outbound traffic

## Production Considerations

### Scalability

- **Horizontal Scaling**: Add more EC2 instances behind ALB
- **Auto Scaling Group**: Automatically scale based on CPU/memory usage
- **Database Migration**: Move from in-memory to RDS/Aurora for persistence

### Security

- **VPC Configuration**: Private subnets for EC2, public for ALB
- **WAF**: Web Application Firewall for additional protection
- **Secrets Management**: AWS Secrets Manager for sensitive data
- **Regular Updates**: Security patches and dependency updates

### Monitoring & Logging

- **CloudWatch Logs**: Application and system logs
- **CloudWatch Metrics**: CPU, memory, network utilization
- **X-Ray**: Distributed tracing for GraphQL queries
- **Health Checks**: Automated monitoring and alerting

### Backup & Recovery

- **EBS Snapshots**: Automated daily backups
- **Application Backup**: Git repository with deployment scripts
- **Disaster Recovery**: Multi-AZ deployment for high availability

## Alternative Deployment Options

### Option 1: Lambda + API Gateway

- **Pros**: Serverless, pay-per-use, auto-scaling
- **Cons**: Cold starts, 15-minute timeout limit
- **Cost**: ~$5-10/month for low traffic

### Option 2: ECS Fargate

- **Pros**: Containerized, managed, auto-scaling
- **Cons**: More complex setup
- **Cost**: ~$15-20/month

### Option 3: Elastic Beanstalk

- **Pros**: Managed platform, easy deployment
- **Cons**: Less control, higher costs
- **Cost**: ~$30-40/month

## Recommendation

For the current GraphQL backend with in-memory storage and low traffic requirements, the **EC2 t3.micro deployment** is the most cost-effective and straightforward solution. It provides:

- ✅ Full control over the environment
- ✅ Cost-effective for 24/7 operation
- ✅ Easy to scale and modify
- ✅ Simple deployment and maintenance
- ✅ Suitable for development and small production workloads

The estimated monthly cost of ~$26 is reasonable for a production GraphQL API that serves both mobile and web applications.
