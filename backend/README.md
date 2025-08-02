# TactLink GraphQL Backend

A GraphQL server built with Apollo Server and TypeScript for the TactLink application.

## Features

- GraphQL API with Apollo Server
- TypeScript support
- Authentication service
- Health check endpoint
- Docker containerization
- Production-ready configuration

## Quick Start

### Local Development

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Access GraphQL playground:
```
http://localhost:4000
```

### Docker Development

1. Build and run with Docker Compose:
```bash
docker-compose up --build
```

2. Access the application:
- GraphQL: http://localhost:4000
- Health Check: http://localhost:4001/health

## API Endpoints

### GraphQL
- **URL**: `http://localhost:4000/graphql`
- **Playground**: `http://localhost:4000`

### Health Check
- **URL**: `http://localhost:4001/health`
- **Method**: GET
- **Response**: JSON with status and timestamp

## Project Structure

```
src/
├── data/           # Data layer (in-memory store)
├── models/         # Data models
├── schema/         # GraphQL schema
│   ├── typeDefs.ts # Type definitions
│   └── resolvers.ts # Resolvers
├── services/       # Business logic
│   ├── authService.ts
│   └── todoService.ts
├── types/          # TypeScript types
└── index.ts        # Application entry point
```

## Deployment

### EC2 Deployment

For detailed EC2 deployment instructions, see [EC2_DEPLOYMENT_GUIDE.md](./EC2_DEPLOYMENT_GUIDE.md).

Quick deployment steps:

1. Upload code to EC2:
```bash
scp -i your-key.pem -r backend/ ec2-user@your-instance-ip:/tmp/
```

2. Run setup scripts:
```bash
ssh -i your-key.pem ec2-user@your-instance-ip
cd /tmp/backend
chmod +x ec2-setup.sh deploy.sh
./ec2-setup.sh
./deploy.sh
```

### Docker Deployment

1. Build image:
```bash
docker build -t tactlink-backend .
```

2. Run container:
```bash
docker run -p 4000:4000 -p 4001:4001 tactlink-backend
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | GraphQL server port | `4000` |

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Compile TypeScript
- `npm start` - Start production server
- `npm test` - Run tests (placeholder)

## Health Check

The application includes a health check endpoint that returns:

```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "service": "tactlink-graphql-backend"
}
```

## Monitoring

### Logs
- Application logs are available via Docker Compose: `docker-compose logs -f`
- System logs: `sudo journalctl -u docker -f`

### Metrics
- Health check endpoint for basic monitoring
- Docker container health checks
- System resource monitoring with `htop`

## Security

- Input validation in GraphQL resolvers
- Error handling and logging
- Firewall configuration (see EC2 setup script)
- Fail2ban for SSH protection

## Troubleshooting

### Common Issues

1. **Port already in use**
   - Check if another process is using port 4000/4001
   - Use `netstat -tlnp` to check port usage

2. **Docker build fails**
   - Ensure Docker is running
   - Check Dockerfile syntax
   - Verify all dependencies are in package.json

3. **GraphQL server not responding**
   - Check container logs: `docker-compose logs`
   - Verify health endpoint: `curl http://localhost:4001/health`
   - Check firewall settings

### Debug Commands

```bash
# Check container status
docker ps

# View logs
docker-compose logs -f

# Restart services
docker-compose restart

# Check system resources
htop
free -h
df -h
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

ISC License 