# DigitalOcean Droplet Setup Guide

## 🎯 **Objective**
Set up 3 DigitalOcean droplets for Cricklog application hosting.

## 📋 **Required Droplets**

### **1. Frontend Server (Next.js)**
- **Size**: Basic $12/month (1GB RAM, 1 CPU, 25GB SSD)
- **OS**: Ubuntu 22.04 LTS
- **Purpose**: Host Next.js frontend application
- **Ports**: 3000 (app), 80/443 (nginx)

### **2. Backend Server (Express.js API)**
- **Size**: Basic $24/month (2GB RAM, 1 CPU, 50GB SSD)
- **OS**: Ubuntu 22.04 LTS
- **Purpose**: Host Express.js API and business logic
- **Ports**: 4000 (app), 80/443 (nginx)

### **3. Redis Cache Server**
- **Size**: Basic $12/month (1GB RAM, 1 CPU, 25GB SSD)
- **OS**: Ubuntu 22.04 LTS
- **Purpose**: Redis cache for real-time scoring
- **Ports**: 6379 (redis)

## 🛠️ **Step-by-Step Setup**

### **Step 1: Login to DigitalOcean**
1. Go to [DigitalOcean Console](https://cloud.digitalocean.com/)
2. Sign in with your account
3. Navigate to "Droplets" in the sidebar

### **Step 2: Create Frontend Server**

#### **Basic Configuration:**
- **Choose an image**: Ubuntu 22.04 LTS
- **Choose size**: Basic $12/month (1GB RAM, 1 CPU, 25GB SSD)
- **Choose datacenter region**: Singapore (closest to your database)
- **Authentication**: SSH Key (recommended) or Password
- **Choose a hostname**: `cricklog-frontend`
- **Choose a project**: Create new project "Cricklog"

#### **Advanced Options:**
- **Monitoring**: ✅ Enable
- **Backups**: ✅ Enable (optional, +20% cost)
- **IPv6**: ✅ Enable
- **User data**: Leave blank

#### **Final Configuration:**
- **Droplet name**: `cricklog-frontend`
- **Project**: Cricklog
- **Tags**: `frontend`, `cricklog`, `production`

### **Step 3: Create Backend Server**

#### **Basic Configuration:**
- **Choose an image**: Ubuntu 22.04 LTS
- **Choose size**: Basic $24/month (2GB RAM, 1 CPU, 50GB SSD)
- **Choose datacenter region**: Singapore
- **Authentication**: SSH Key
- **Choose a hostname**: `cricklog-backend`
- **Choose a project**: Cricklog

#### **Advanced Options:**
- **Monitoring**: ✅ Enable
- **Backups**: ✅ Enable (optional)
- **IPv6**: ✅ Enable

#### **Final Configuration:**
- **Droplet name**: `cricklog-backend`
- **Project**: Cricklog
- **Tags**: `backend`, `cricklog`, `production`

### **Step 4: Create Redis Server**

#### **Basic Configuration:**
- **Choose an image**: Ubuntu 22.04 LTS
- **Choose size**: Basic $12/month (1GB RAM, 1 CPU, 25GB SSD)
- **Choose datacenter region**: Singapore
- **Authentication**: SSH Key
- **Choose a hostname**: `cricklog-redis`
- **Choose a project**: Cricklog

#### **Final Configuration:**
- **Droplet name**: `cricklog-redis`
- **Project**: Cricklog
- **Tags**: `redis`, `cricklog`, `production`

## 🔑 **SSH Key Setup**

### **If you don't have SSH keys:**
```bash
# Generate SSH key pair
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"

# Copy public key to clipboard
cat ~/.ssh/id_rsa.pub | pbcopy  # macOS
# or
cat ~/.ssh/id_rsa.pub | xclip -selection clipboard  # Linux
```

### **Add SSH Key to DigitalOcean:**
1. Go to **Account** → **Security** → **SSH Keys**
2. Click **Add SSH Key**
3. Paste your public key
4. Give it a name: "Cricklog Development"
5. Click **Add SSH Key**

## 📊 **Cost Breakdown**

| Server | Monthly Cost | Purpose |
|--------|-------------|---------|
| Frontend | $12 | Next.js app + Nginx |
| Backend | $24 | Express.js API |
| Redis | $12 | Cache server |
| **Total** | **$48/month** | Production setup |

*Note: Add 20% for backups if enabled*

## 🌐 **Network Configuration**

### **Firewall Rules (Configure after creation):**

#### **Frontend Server:**
- **SSH**: Port 22 (your IP only)
- **HTTP**: Port 80 (0.0.0.0/0)
- **HTTPS**: Port 443 (0.0.0.0/0)
- **App**: Port 3000 (backend server only)

#### **Backend Server:**
- **SSH**: Port 22 (your IP only)
- **HTTP**: Port 80 (frontend server only)
- **HTTPS**: Port 443 (frontend server only)
- **App**: Port 4000 (frontend server only)

#### **Redis Server:**
- **SSH**: Port 22 (your IP only)
- **Redis**: Port 6379 (backend server only)

## 📝 **Important Notes**

### **After Droplet Creation:**
1. **Note down IP addresses** of all 3 servers
2. **Test SSH connection** to each server
3. **Update DNS records** to point to frontend server IP
4. **Configure firewall rules** for security

### **IP Addresses to Record:**
```
Frontend Server: xxx.xxx.xxx.xxx
Backend Server:  xxx.xxx.xxx.xxx  
Redis Server:    xxx.xxx.xxx.xxx
```

## 🚀 **Quick Commands After Creation**

### **Test SSH Connection:**
```bash
# Test frontend server
ssh root@FRONTEND_IP

# Test backend server  
ssh root@BACKEND_IP

# Test redis server
ssh root@REDIS_IP
```

### **Update Server Hostnames:**
```bash
# On each server, run:
hostnamectl set-hostname cricklog-frontend  # or backend/redis
```

## ⏰ **Expected Timeline**
- **Droplet Creation**: 5-10 minutes
- **SSH Setup**: 5 minutes
- **Network Configuration**: 10 minutes
- **Total**: ~20 minutes

## ✅ **Completion Checklist**
- [ ] All 3 droplets created successfully
- [ ] SSH access working to all servers
- [ ] IP addresses recorded
- [ ] Firewall rules configured
- [ ] Server hostnames set
- [ ] Monitoring enabled on all servers

---

## 🎯 **Next Steps After Setup**
1. **Configure GitHub Actions secrets** with server IPs
2. **Set up domain DNS** to point to frontend server
3. **Deploy application** using automated script
4. **Configure SSL certificates** for HTTPS
5. **Test live application** functionality

Ready to proceed with droplet creation? 🚀
