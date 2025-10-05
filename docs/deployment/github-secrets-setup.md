# GitHub Actions Secrets Configuration

## 🎯 **Objective**
Configure GitHub Actions secrets for automated deployment to DigitalOcean.

## 📋 **Required Secrets**

### **1. DigitalOcean Access Token**
- **Purpose**: Authenticate with DigitalOcean API
- **Scope**: Read/Write access to droplets and container registry

### **2. Server Connection Details**
- **DIGITALOCEAN_HOST**: Main server IP address
- **DIGITALOCEAN_USERNAME**: SSH username (usually 'root')
- **DIGITALOCEAN_SSH_KEY**: Private SSH key for server access

### **3. Optional: Slack Notifications**
- **SLACK_WEBHOOK**: Webhook URL for deployment notifications

## 🔑 **Step 1: Generate DigitalOcean Access Token**

### **Create Personal Access Token:**
1. Go to [DigitalOcean API Tokens](https://cloud.digitalocean.com/account/api/tokens)
2. Click **"Generate New Token"**
3. **Token name**: `Cricklog Deployment`
4. **Scopes**: 
   - ✅ **Read** (for droplet information)
   - ✅ **Write** (for container registry and deployments)
5. **Expiration**: 1 year (recommended)
6. Click **"Generate Token"**
7. **Copy the token** (you won't see it again!)

### **Token Permissions Required:**
- `droplets:read` - Read droplet information
- `droplets:write` - Create/update droplets
- `images:read` - Access container images
- `images:write` - Push container images
- `registry:read` - Access container registry
- `registry:write` - Push to container registry

## 🔐 **Step 2: Prepare SSH Key**

### **If you don't have SSH keys:**
```bash
# Generate SSH key pair
ssh-keygen -t rsa -b 4096 -C "cricklog-deployment"

# This creates:
# ~/.ssh/id_rsa (private key - keep secret!)
# ~/.ssh/id_rsa.pub (public key - add to servers)
```

### **Add Public Key to DigitalOcean Servers:**
```bash
# Copy public key
cat ~/.ssh/id_rsa.pub

# SSH into each server and add the key
ssh root@FRONTEND_IP
ssh root@BACKEND_IP  
ssh root@REDIS_IP

# On each server, run:
mkdir -p ~/.ssh
echo "YOUR_PUBLIC_KEY_HERE" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh
```

## 📝 **Step 3: Configure GitHub Secrets**

### **Navigate to GitHub Secrets:**
1. Go to your repository: `https://github.com/arun-nex/cricklog`
2. Click **Settings** tab
3. In left sidebar, click **Secrets and variables** → **Actions**
4. Click **"New repository secret"**

### **Add Each Secret:**

#### **Secret 1: DIGITALOCEAN_ACCESS_TOKEN**
- **Name**: `DIGITALOCEAN_ACCESS_TOKEN`
- **Value**: `dop_v1_your_token_here`
- **Description**: DigitalOcean API access token

#### **Secret 2: DIGITALOCEAN_HOST**
- **Name**: `DIGITALOCEAN_HOST`
- **Value**: `your_frontend_server_ip`
- **Description**: Main server IP address for deployment

#### **Secret 3: DIGITALOCEAN_USERNAME**
- **Name**: `DIGITALOCEAN_USERNAME`
- **Value**: `root`
- **Description**: SSH username for server access

#### **Secret 4: DIGITALOCEAN_SSH_KEY**
- **Name**: `DIGITALOCEAN_SSH_KEY`
- **Value**: 
```bash
# Copy the entire private key content:
-----BEGIN OPENSSH PRIVATE KEY-----
your_private_key_content_here
-----END OPENSSH PRIVATE KEY-----
```
- **Description**: Private SSH key for server authentication

#### **Secret 5: SLACK_WEBHOOK (Optional)**
- **Name**: `SLACK_WEBHOOK`
- **Value**: `https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK`
- **Description**: Slack webhook for deployment notifications

## 🧪 **Step 4: Test GitHub Actions**

### **Trigger Test Deployment:**
1. Make a small change to any file
2. Commit and push to main branch:
```bash
git add .
git commit -m "Test deployment trigger"
git push origin main
```

### **Monitor Deployment:**
1. Go to **Actions** tab in your GitHub repository
2. Click on the running workflow
3. Monitor the deployment progress
4. Check for any errors in the logs

## 🔍 **Troubleshooting Common Issues**

### **Issue 1: SSH Connection Failed**
```bash
# Test SSH connection manually
ssh -i ~/.ssh/id_rsa root@YOUR_SERVER_IP

# If it fails, check:
# - SSH key is correctly added to server
# - Server IP is correct
# - Firewall allows SSH (port 22)
```

### **Issue 2: DigitalOcean API Token Invalid**
- Verify token has correct permissions
- Check token hasn't expired
- Ensure token is copied correctly (no extra spaces)

### **Issue 3: Container Registry Access Denied**
```bash
# Login to DigitalOcean Container Registry
doctl registry login

# Test push
docker tag hello-world registry.digitalocean.com/cricklog/hello
docker push registry.digitalocean.com/cricklog/hello
```

## 📊 **Secrets Summary**

| Secret Name | Value Example | Purpose |
|-------------|---------------|---------|
| `DIGITALOCEAN_ACCESS_TOKEN` | `dop_v1_abc123...` | API authentication |
| `DIGITALOCEAN_HOST` | `192.168.1.100` | Server IP address |
| `DIGITALOCEAN_USERNAME` | `root` | SSH username |
| `DIGITALOCEAN_SSH_KEY` | `-----BEGIN OPENSSH...` | SSH private key |
| `SLACK_WEBHOOK` | `https://hooks.slack...` | Notifications (optional) |

## ✅ **Verification Checklist**

- [ ] DigitalOcean access token created with correct permissions
- [ ] SSH key pair generated and public key added to servers
- [ ] All 5 secrets added to GitHub repository
- [ ] SSH connection tested manually
- [ ] GitHub Actions workflow triggered successfully
- [ ] Deployment logs show no errors

## 🚀 **Next Steps After Secrets Setup**

1. **Set up domain DNS** to point to your server
2. **Deploy application** using GitHub Actions
3. **Configure SSL certificates** for HTTPS
4. **Test live application** functionality

---

## ⚠️ **Security Best Practices**

- **Never commit secrets** to your repository
- **Use environment-specific tokens** (separate for dev/prod)
- **Rotate tokens regularly** (every 6-12 months)
- **Limit token permissions** to minimum required
- **Monitor token usage** in DigitalOcean dashboard

Ready to configure your secrets? 🔐
