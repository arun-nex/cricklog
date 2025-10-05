# DigitalOcean Infrastructure Plan

## 1. Infrastructure Overview

### 1.1 Server Architecture
```
Internet → CloudFlare CDN → DigitalOcean Load Balancer → Application Servers
                                                      ↓
                                              DigitalOcean Managed PostgreSQL
                                                      ↓
                                              Redis Cache Server
```

### 1.2 DigitalOcean Resources

#### Production Environment
- **Frontend Server**: 1x $12/month Droplet (1GB RAM, 1 CPU, 25GB SSD)
- **Backend Server**: 1x $24/month Droplet (2GB RAM, 1 CPU, 50GB SSD)
- **Database**: DigitalOcean Managed PostgreSQL ($15/month)
- **Redis Cache**: 1x $12/month Droplet (1GB RAM, 1 CPU, 25GB SSD)
- **Load Balancer**: DigitalOcean Load Balancer ($12/month)
- **Spaces**: DigitalOcean Spaces for file storage ($5/month)

#### Development Environment
- **Development Server**: 1x $6/month Droplet (512MB RAM, 1 CPU, 20GB SSD)
- **Database**: Shared PostgreSQL instance

## 2. Server Configuration

### 2.1 Frontend Server (Next.js)
**Droplet Specs**: 1GB RAM, 1 CPU, 25GB SSD
**OS**: Ubuntu 22.04 LTS

**Services Running**:
- Nginx (reverse proxy)
- Next.js application (PM2 process manager)
- SSL certificates (Let's Encrypt)

**Port Configuration**:
- Port 80: HTTP (redirects to HTTPS)
- Port 443: HTTPS (Nginx)
- Port 3000: Next.js application

### 2.2 Backend Server (Express.js API)
**Droplet Specs**: 2GB RAM, 1 CPU, 50GB SSD
**OS**: Ubuntu 22.04 LTS

**Services Running**:
- Node.js application (PM2 process manager)
- Redis client
- Database connection pool
- File upload handling

**Port Configuration**:
- Port 80: HTTP (redirects to HTTPS)
- Port 443: HTTPS (Nginx)
- Port 4000: Express.js API

### 2.3 Database Server
**Service**: DigitalOcean Managed PostgreSQL
**Specs**: 1GB RAM, 1 CPU, 10GB SSD
**Features**:
- Automated backups
- High availability
- Connection pooling
- SSL encryption

### 2.4 Redis Cache Server
**Droplet Specs**: 1GB RAM, 1 CPU, 25GB SSD
**OS**: Ubuntu 22.04 LTS

**Services Running**:
- Redis 6+
- Redis persistence (RDB + AOF)
- Redis monitoring

## 3. GitHub Actions CI/CD Pipeline

### 3.1 Workflow Structure
```yaml
# .github/workflows/deploy.yml
name: Deploy to DigitalOcean

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    # Run tests
  build:
    # Build Docker images
  deploy:
    # Deploy to DigitalOcean
```

### 3.2 Deployment Process
1. **Code Push**: Developer pushes to main branch
2. **GitHub Actions Trigger**: Workflow starts automatically
3. **Run Tests**: Execute unit and integration tests
4. **Build Images**: Create Docker images for frontend and backend
5. **Push to Registry**: Push images to DigitalOcean Container Registry
6. **Deploy to Servers**: Update running containers on DigitalOcean
7. **Health Check**: Verify deployment success
8. **Rollback**: Automatic rollback if health check fails

### 3.3 Environment Variables
**Secrets stored in GitHub**:
- `DIGITALOCEAN_ACCESS_TOKEN`
- `DIGITALOCEAN_SSH_KEY`
- `DATABASE_URL`
- `REDIS_URL`
- `JWT_SECRET`
- `API_KEYS`

## 4. Docker Configuration

### 4.1 Frontend Dockerfile
```dockerfile
# Frontend Dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

### 4.2 Backend Dockerfile
```dockerfile
# Backend Dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 5000
CMD ["npm", "start"]
```

### 4.3 Docker Compose (Development)
```yaml
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - API_URL=http://localhost:5000

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://user:pass@db:5432/cricklog
      - REDIS_URL=redis://redis:6379

  db:
    image: postgres:14
    environment:
      - POSTGRES_DB=cricklog
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:6-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

## 5. Nginx Configuration

### 5.1 Frontend Nginx Config
```nginx
server {
    listen 80;
    server_name cricklog.com www.cricklog.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name cricklog.com www.cricklog.com;

    ssl_certificate /etc/letsencrypt/live/cricklog.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/cricklog.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 5.2 Backend Nginx Config
```nginx
server {
    listen 80;
    server_name api.cricklog.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.cricklog.com;

    ssl_certificate /etc/letsencrypt/live/api.cricklog.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.cricklog.com/privkey.pem;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 6. SSL and Security

### 6.1 SSL Certificates
- **Provider**: Let's Encrypt (free)
- **Tool**: Certbot for automatic renewal
- **Domains**: 
  - cricklog.com (frontend)
  - api.cricklog.com (backend)
  - admin.cricklog.com (admin panel)

### 6.2 Security Measures
- **Firewall**: UFW (Uncomplicated Firewall)
- **SSH**: Key-based authentication only
- **Updates**: Automatic security updates
- **Monitoring**: Fail2ban for intrusion prevention
- **Backups**: Automated daily backups

## 7. Monitoring and Logging

### 7.1 Application Monitoring
- **Error Tracking**: Sentry integration
- **Performance**: Custom metrics dashboard
- **Uptime**: Uptime monitoring service
- **Logs**: Centralized logging with ELK stack

### 7.2 Server Monitoring
- **Resource Usage**: CPU, RAM, disk space
- **Database Performance**: Query optimization
- **Network**: Bandwidth and latency monitoring
- **Alerts**: Email/Slack notifications for issues

## 8. Backup Strategy

### 8.1 Database Backups
- **Frequency**: Daily automated backups
- **Retention**: 30 days
- **Location**: DigitalOcean Spaces
- **Testing**: Monthly restore tests

### 8.2 Application Backups
- **Code**: GitHub repository
- **Files**: DigitalOcean Spaces
- **Configuration**: Version controlled
- **Disaster Recovery**: 4-hour RTO, 1-hour RPO

## 9. Cost Estimation

### 9.1 Monthly Costs
- **Frontend Server**: $12/month
- **Backend Server**: $24/month
- **Database**: $15/month
- **Redis Server**: $12/month
- **Load Balancer**: $12/month
- **Spaces Storage**: $5/month
- **Total**: ~$80/month

### 9.2 Scaling Costs
- **High Traffic**: Add more droplets ($12-24 each)
- **Database**: Upgrade to higher tier ($30-60/month)
- **CDN**: CloudFlare Pro ($20/month)
- **Monitoring**: Additional monitoring tools ($10-20/month)

## 10. Deployment Commands

### 10.1 Initial Server Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Nginx
sudo apt install nginx -y

# Install Certbot
sudo apt install certbot python3-certbot-nginx -y
```

### 10.2 Application Deployment
```bash
# Clone repository
git clone https://github.com/yourusername/cricklog.git
cd cricklog

# Build and start services
docker-compose up -d --build

# Setup SSL certificates
sudo certbot --nginx -d cricklog.com -d api.cricklog.com
```

---

## Next Steps
1. **Create DigitalOcean Account** and set up billing
2. **Create Droplets** for frontend, backend, and Redis
3. **Set up Managed PostgreSQL** database
4. **Configure GitHub Actions** workflow
5. **Deploy initial application** and test
6. **Set up monitoring** and alerting
7. **Configure backups** and disaster recovery
