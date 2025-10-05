#!/bin/bash

# Cricklog Deployment Script for DigitalOcean
# This script sets up the server and deploys the application

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="cricklog"
APP_DIR="/opt/$APP_NAME"
DOMAIN="cricklog.com"
API_DOMAIN="api.cricklog.com"
ADMIN_DOMAIN="admin.cricklog.com"

echo -e "${GREEN}🚀 Starting Cricklog deployment on DigitalOcean${NC}"

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   echo -e "${RED}❌ This script should not be run as root${NC}"
   exit 1
fi

# Update system packages
echo -e "${YELLOW}📦 Updating system packages...${NC}"
sudo apt update && sudo apt upgrade -y

# Install required packages
echo -e "${YELLOW}📦 Installing required packages...${NC}"
sudo apt install -y curl wget git unzip software-properties-common apt-transport-https ca-certificates gnupg lsb-release

# Install Docker
echo -e "${YELLOW}🐳 Installing Docker...${NC}"
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
    echo -e "${GREEN}✅ Docker installed successfully${NC}"
else
    echo -e "${GREEN}✅ Docker already installed${NC}"
fi

# Install Docker Compose
echo -e "${YELLOW}🐳 Installing Docker Compose...${NC}"
if ! command -v docker-compose &> /dev/null; then
    sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    echo -e "${GREEN}✅ Docker Compose installed successfully${NC}"
else
    echo -e "${GREEN}✅ Docker Compose already installed${NC}"
fi

# Install Nginx
echo -e "${YELLOW}🌐 Installing Nginx...${NC}"
if ! command -v nginx &> /dev/null; then
    sudo apt install -y nginx
    sudo systemctl enable nginx
    sudo systemctl start nginx
    echo -e "${GREEN}✅ Nginx installed successfully${NC}"
else
    echo -e "${GREEN}✅ Nginx already installed${NC}"
fi

# Install Certbot for SSL
echo -e "${YELLOW}🔒 Installing Certbot for SSL certificates...${NC}"
if ! command -v certbot &> /dev/null; then
    sudo apt install -y certbot python3-certbot-nginx
    echo -e "${GREEN}✅ Certbot installed successfully${NC}"
else
    echo -e "${GREEN}✅ Certbot already installed${NC}"
fi

# Create application directory
echo -e "${YELLOW}📁 Creating application directory...${NC}"
sudo mkdir -p $APP_DIR
sudo chown $USER:$USER $APP_DIR

# Clone repository (if not already present)
if [ ! -d "$APP_DIR/.git" ]; then
    echo -e "${YELLOW}📥 Cloning repository...${NC}"
    git clone https://github.com/arun-nex/cricklog.git $APP_DIR
else
    echo -e "${YELLOW}📥 Updating repository...${NC}"
    cd $APP_DIR
    git pull origin main
fi

# Create environment file
echo -e "${YELLOW}⚙️ Creating environment configuration...${NC}"
cat > $APP_DIR/.env << EOF
# Database Configuration
DATABASE_URL=postgresql://arunz_developer:password@db-postgresql-sgp1-test-env-do-user-3428780-0.j.db.ondigitalocean.com:25060/arunz_cricklog_dev

# Redis Configuration
REDIS_URL=redis://localhost:6379

# JWT Secret (generate a secure random string)
JWT_SECRET=your-super-secret-jwt-key-here

# API Configuration
API_PORT=4000
NODE_ENV=production

# Frontend Configuration
NEXT_PUBLIC_API_URL=https://api.cricklog.com
EOF

echo -e "${GREEN}✅ Environment file created at $APP_DIR/.env${NC}"
echo -e "${YELLOW}⚠️ Please update the .env file with your actual database password and JWT secret${NC}"
echo -e "${YELLOW}📋 Database Configuration:${NC}"
echo -e "${YELLOW}  • Host: db-postgresql-sgp1-test-env-do-user-3428780-0.j.db.ondigitalocean.com${NC}"
echo -e "${YELLOW}  • Port: 25060${NC}"
echo -e "${YELLOW}  • Database: arunz_cricklog_dev${NC}"
echo -e "${YELLOW}  • Username: arunz_developer${NC}"
echo -e "${YELLOW}  • Password: [Update in .env file]${NC}"

# Create SSL directory
sudo mkdir -p /etc/ssl/certs/$DOMAIN
sudo mkdir -p /etc/ssl/certs/$API_DOMAIN

# Setup Nginx configuration
echo -e "${YELLOW}🌐 Configuring Nginx...${NC}"
sudo cp $APP_DIR/nginx/nginx.conf /etc/nginx/nginx.conf
sudo cp $APP_DIR/nginx/conf.d/cricklog.conf /etc/nginx/sites-available/cricklog

# Enable site
sudo ln -sf /etc/nginx/sites-available/cricklog /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Start services with Docker Compose
echo -e "${YELLOW}🐳 Starting application services...${NC}"
cd $APP_DIR
docker-compose down 2>/dev/null || true
docker-compose up -d --build

# Wait for services to start
echo -e "${YELLOW}⏳ Waiting for services to start...${NC}"
sleep 30

# Health check
echo -e "${YELLOW}🏥 Performing health checks...${NC}"
if curl -f http://localhost:3000/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Frontend service is healthy${NC}"
else
    echo -e "${RED}❌ Frontend service health check failed${NC}"
fi

if curl -f http://localhost:4000/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend service is healthy${NC}"
else
    echo -e "${RED}❌ Backend service health check failed${NC}"
fi

# Setup SSL certificates
echo -e "${YELLOW}🔒 Setting up SSL certificates...${NC}"
echo -e "${YELLOW}⚠️ Make sure your domain points to this server's IP address${NC}"
read -p "Do you want to setup SSL certificates now? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN -d $API_DOMAIN -d $ADMIN_DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN
    echo -e "${GREEN}✅ SSL certificates configured${NC}"
else
    echo -e "${YELLOW}⚠️ SSL certificates not configured. You can run this later:${NC}"
    echo -e "${YELLOW}sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN -d $API_DOMAIN${NC}"
fi

# Setup firewall
echo -e "${YELLOW}🔥 Configuring firewall...${NC}"
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw --force enable

# Setup log rotation
echo -e "${YELLOW}📝 Setting up log rotation...${NC}"
sudo tee /etc/logrotate.d/cricklog > /dev/null << EOF
/opt/cricklog/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 $USER $USER
    postrotate
        docker-compose -f /opt/cricklog/docker-compose.yml restart nginx
    endscript
}
EOF

# Create systemd service for auto-start
echo -e "${YELLOW}🔄 Creating systemd service...${NC}"
sudo tee /etc/systemd/system/cricklog.service > /dev/null << EOF
[Unit]
Description=Cricklog Application
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=$APP_DIR
ExecStart=/usr/local/bin/docker-compose up -d
ExecStop=/usr/local/bin/docker-compose down
TimeoutStartSec=0
User=$USER

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable cricklog.service

# Setup monitoring script
echo -e "${YELLOW}📊 Setting up monitoring...${NC}"
cat > $APP_DIR/monitor.sh << 'EOF'
#!/bin/bash

# Simple monitoring script for Cricklog
LOG_FILE="/opt/cricklog/logs/monitor.log"
DATE=$(date '+%Y-%m-%d %H:%M:%S')

# Check if services are running
if ! docker-compose -f /opt/cricklog/docker-compose.yml ps | grep -q "Up"; then
    echo "$DATE - ERROR: Some services are down" >> $LOG_FILE
    # Restart services
    cd /opt/cricklog
    docker-compose up -d
    echo "$DATE - INFO: Services restarted" >> $LOG_FILE
else
    echo "$DATE - INFO: All services running" >> $LOG_FILE
fi
EOF

chmod +x $APP_DIR/monitor.sh

# Add to crontab for monitoring
(crontab -l 2>/dev/null; echo "*/5 * * * * $APP_DIR/monitor.sh") | crontab -

# Create backup script
echo -e "${YELLOW}💾 Setting up backup script...${NC}"
cat > $APP_DIR/backup.sh << 'EOF'
#!/bin/bash

# Backup script for Cricklog
BACKUP_DIR="/opt/cricklog/backups"
DATE=$(date '+%Y-%m-%d_%H-%M-%S')

mkdir -p $BACKUP_DIR

# Backup database (if using local PostgreSQL)
# pg_dump -h localhost -U username cricklog > $BACKUP_DIR/database_$DATE.sql

# Backup application files
tar -czf $BACKUP_DIR/app_$DATE.tar.gz /opt/cricklog --exclude=backups --exclude=node_modules

# Keep only last 7 days of backups
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "Backup completed: $DATE"
EOF

chmod +x $APP_DIR/backup.sh

# Add backup to crontab
(crontab -l 2>/dev/null; echo "0 2 * * * $APP_DIR/backup.sh") | crontab -

# Final status
echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo -e "${GREEN}📋 Summary:${NC}"
echo -e "${GREEN}  • Application directory: $APP_DIR${NC}"
echo -e "${GREEN}  • Frontend: http://$DOMAIN${NC}"
echo -e "${GREEN}  • API: http://$API_DOMAIN${NC}"
echo -e "${GREEN}  • Services: docker-compose ps${NC}"
echo -e "${GREEN}  • Logs: docker-compose logs${NC}"
echo -e "${GREEN}  • Restart: sudo systemctl restart cricklog${NC}"

echo -e "${YELLOW}⚠️ Next steps:${NC}"
echo -e "${YELLOW}  1. Update .env file with your database credentials${NC}"
echo -e "${YELLOW}  2. Configure SSL certificates if not done already${NC}"
echo -e "${YELLOW}  3. Test the application endpoints${NC}"
echo -e "${YELLOW}  4. Set up monitoring and alerting${NC}"

echo -e "${GREEN}🚀 Cricklog is now running on DigitalOcean!${NC}"
