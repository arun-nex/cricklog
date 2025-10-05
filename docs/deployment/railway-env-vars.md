# Railway Environment Variables Setup

## 🔧 **Step 3: Set Environment Variables in Railway**

### **How to Add Environment Variables:**

1. **Go to your Railway project dashboard**
2. **Click on your service** (cricklog-backend)
3. **Click the "Variables" tab**
4. **Add each variable** by clicking "New Variable"

### **Environment Variables to Add:**

#### **1. Database Configuration**
```
Key: DATABASE_URL
Value: postgresql://arunz_developer:YOUR_PASSWORD@db-postgresql-sgp1-test-env-do-user-3428780-0.j.db.ondigitalocean.com:25060/arunz_cricklog_dev
```

#### **2. Redis Configuration**
```
Key: REDIS_URL
Value: redis://localhost:6379
```

#### **3. JWT Secret**
```
Key: JWT_SECRET
Value: your-super-secret-jwt-key-here
```

#### **4. Node Environment**
```
Key: NODE_ENV
Value: production
```

#### **5. API Port**
```
Key: API_PORT
Value: 4000
```

#### **6. CORS Origin (Frontend URL)**
```
Key: CORS_ORIGIN
Value: https://cricklog.vercel.app
```

## 📋 **Step-by-Step Instructions:**

### **Step 1: Access Variables Tab**
1. Go to your Railway project
2. Click on your backend service
3. Click **"Variables"** tab in the left sidebar

### **Step 2: Add Each Variable**
For each variable above:
1. Click **"New Variable"**
2. Enter the **Key** (left column)
3. Enter the **Value** (right column)
4. Click **"Add"**

### **Step 3: Verify All Variables**
You should have 6 environment variables total:
- ✅ DATABASE_URL
- ✅ REDIS_URL
- ✅ JWT_SECRET
- ✅ NODE_ENV
- ✅ API_PORT
- ✅ CORS_ORIGIN

### **Step 4: Deploy**
1. Click **"Deploy"** or **"Redeploy"**
2. Wait for the build to complete
3. Check the logs for any errors

## 🎯 **Expected Result:**

After adding these variables and deploying:
- ✅ **Backend API** will be accessible
- ✅ **Database connection** will work
- ✅ **CORS** will allow frontend requests
- ✅ **Health check** will pass

## 🔍 **Troubleshooting:**

### **If deployment fails:**
1. Check the **logs** in Railway dashboard
2. Verify all **environment variables** are set correctly
3. Make sure **database password** is correct
4. Check if **CORS_ORIGIN** matches your Vercel URL

### **Common Issues:**
- **Database connection failed**: Check DATABASE_URL format
- **CORS errors**: Verify CORS_ORIGIN matches frontend URL
- **Port issues**: API_PORT should be 4000

## 📝 **Quick Copy-Paste List:**

```
DATABASE_URL=postgresql://arunz_developer:YOUR_PASSWORD@db-postgresql-sgp1-test-env-do-user-3428780-0.j.db.ondigitalocean.com:25060/arunz_cricklog_dev
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=production
API_PORT=4000
CORS_ORIGIN=https://cricklog.vercel.app
```

---

## 🚀 **Ready to Add Variables?**

1. **Go to Railway Variables tab**
2. **Add all 6 variables** from the list above
3. **Deploy/Redeploy** your service
4. **Get your Railway URL** (something like `https://cricklog-backend-xxx.railway.app`)

Once deployed, you'll need to update your Vercel environment variable with the actual Railway URL!
