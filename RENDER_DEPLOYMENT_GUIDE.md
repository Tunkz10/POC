# Complete Guide: Deploy Backend to Render & Connect to Vercel

This is a step-by-step guide to deploy your Express.js backend to Render and connect it to your Vercel frontend at **https://poc-kwpr.vercel.app**

---

## Prerequisites

✅ Your code is pushed to GitHub  
✅ You have a Render account (sign up at https://render.com)  
✅ You have your Supabase credentials ready  
✅ Your frontend is deployed on Vercel: **https://poc-kwpr.vercel.app**

---

## Part 1: Prepare Your Backend

### Step 1.1: Verify Your Backend Structure

Make sure your backend folder structure looks like this:
```
backend/
├── routes/
│   ├── auth.js
│   ├── bookings.js
│   ├── messages.js
│   └── jobs.js
├── services/
│   ├── serviceM8.js
│   └── supabase.js
├── middleware/
│   └── auth.js
├── server.js
└── package.json
```

### Step 1.2: Verify package.json

Your `backend/package.json` should have:
- ✅ `"main": "server.js"`
- ✅ `"type": "module"`
- ✅ `"start": "node server.js"` script
- ✅ All dependencies listed

This should already be correct! ✅

---

## Part 2: Deploy to Render

### Step 2.1: Sign Up / Log In to Render

1. Go to **https://render.com**
2. Click **"Get Started for Free"** (or **"Log In"** if you have an account)
3. Choose **"Continue with GitHub"** (recommended)
4. Authorize Render to access your GitHub

### Step 2.2: Create New Web Service

1. After logging in, you'll see the Render dashboard
2. Click the **"New +"** button (top right)
3. Select **"Web Service"**

### Step 2.3: Connect Your Repository

1. You'll see a list of your GitHub repositories
2. **Find and click** on your project repository
3. Click **"Connect"**

### Step 2.4: Configure Your Service

Fill in the service configuration:

**Basic Settings:**
- **Name:** `customer-portal-backend` (or any name you prefer)
- **Region:** Choose closest to you (e.g., `Oregon (US West)`)
- **Branch:** `main` (or `master` if that's your branch)
- **Runtime:** `Node` (should be auto-detected)

**Build & Deploy:**
- **Root Directory:** Leave **empty** (or set to `backend` if you prefer)
- **Environment:** `Node`
- **Build Command:** 
  ```
  cd backend && npm install
  ```
- **Start Command:**
  ```
  cd backend && npm start
  ```

**⚠️ IMPORTANT:** If you set Root Directory to `backend`, then use:
- **Build Command:** `npm install`
- **Start Command:** `npm start`

**Plan:**
- Select **"Free"** (or paid if you prefer)

### Step 2.5: Add Environment Variables

**Before creating the service, add all environment variables:**

Click **"Advanced"** → **"Add Environment Variable"** for each:

#### 1. Server Configuration

**NODE_ENV**
- **Key:** `NODE_ENV`
- **Value:** `production`

**PORT**
- **Key:** `PORT`
- **Value:** `10000`
- *(Render sets this automatically, but good to have)*

#### 2. Frontend URL (for CORS)

**FRONTEND_URL**
- **Key:** `FRONTEND_URL`
- **Value:** `https://poc-kwpr.vercel.app`
- ⚠️ **No trailing slash!**

#### 3. Supabase Connection

**SUPABASE_URL**
- **Key:** `SUPABASE_URL`
- **Value:** Your Supabase Project URL
- Get it from: Supabase Dashboard → Settings → API → Project URL
- Example: `https://xxxxx.supabase.co`

**SUPABASE_KEY**
- **Key:** `SUPABASE_KEY`
- **Value:** Your Supabase anon/public key
- Get it from: Supabase Dashboard → Settings → API → anon public key
- ⚠️ Use the **anon** key, NOT the service_role key!

#### 4. JWT Secret

**JWT_SECRET**
- **Key:** `JWT_SECRET`
- **Value:** Generate a strong random string
- **Generate with:**
  ```bash
  openssl rand -base64 32
  ```
- Or use online generator: https://randomkeygen.com/
- **Keep this secret!** Don't share it publicly

#### 5. ServiceM8 (Optional - for mock data)

**SERVICEM8_USE_MOCK**
- **Key:** `SERVICEM8_USE_MOCK`
- **Value:** `true`

**SERVICEM8_API_KEY** (Optional - only if you have a working API key)
- **Key:** `SERVICEM8_API_KEY`
- **Value:** Your ServiceM8 API key (if you have one)

### Step 2.6: Create Service

1. Review all your settings
2. Scroll down and click **"Create Web Service"**
3. Render will start building and deploying your service
4. This usually takes 2-5 minutes

### Step 2.7: Get Your Backend URL

1. Once deployment completes, you'll see:
   - ✅ **"Live"** status (green)
   - Your service URL at the top (e.g., `https://customer-portal-backend.onrender.com`)

2. **Copy this URL** - you'll need it!

3. **Test your backend:**
   - Visit: `https://your-backend.onrender.com/health`
   - Should return: `{"status":"ok"}`

---

## Part 3: Connect Vercel Frontend to Render Backend

### Step 3.1: Add Environment Variable in Vercel

Now we need to tell your Vercel frontend where your Render backend is.

1. Go to **https://vercel.com/dashboard**
2. Click on your project (the one with URL `poc-kwpr.vercel.app`)
3. Go to **Settings** → **Environment Variables**
4. Click **"Add New"**

5. Add this variable:

   **Name:**
   ```
   NEXT_PUBLIC_BACKEND_URL
   ```

   **Value:**
   ```
   https://your-backend.onrender.com/api
   ```
   *(Replace `your-backend.onrender.com` with your actual Render backend URL)*
   
   ⚠️ **IMPORTANT:** Must include `/api` at the end!

   **Environment:** Select all three:
   - ☑️ Production
   - ☑️ Preview
   - ☑️ Development

6. Click **"Save"**

### Step 3.2: Redeploy Frontend

1. Go to **Deployments** tab in Vercel
2. Click the **⋯** (three dots) menu on the latest deployment
3. Click **"Redeploy"**
4. Wait for redeployment to complete

**OR** just push a new commit to trigger auto-deployment.

---

## Part 4: Verify Everything Works

### Step 4.1: Test Backend

1. Visit your backend health endpoint:
   ```
   https://your-backend.onrender.com/health
   ```
2. Should return: `{"status":"ok"}`

### Step 4.2: Test Frontend Connection

1. Visit your frontend: **https://poc-kwpr.vercel.app**
2. Open browser Developer Tools:
   - Press `F12` or right-click → "Inspect"
   - Go to **"Console"** tab
   - Go to **"Network"** tab

3. **Try to log in:**
   - Enter an email and phone number
   - Click "Sign in"
   - Watch the Network tab for API calls

4. **Check for success:**
   - **Console tab:** Should have no red errors
   - **Network tab:** API calls should show `200 OK` (green)
   - Should redirect to bookings page

### Step 4.3: Check Backend Logs

1. Go to Render dashboard → Your backend service
2. Click **"Logs"** tab
3. You should see:
   - `🚀 Server running on port...`
   - `🌐 Allowed origins: https://poc-kwpr.vercel.app...`
   - Incoming API requests when you use the frontend

---

## Part 5: Troubleshooting

### Problem: Backend Build Fails

**Symptoms:**
- Render shows red error during build
- Build logs show errors

**Solution:**
1. Check Render build logs:
   - Go to your service → **"Logs"** tab
   - Look for specific error messages

2. Common issues:
   - **"Cannot find module"** → Check `package.json` has all dependencies
   - **"Build command failed"** → Verify build command is: `cd backend && npm install`
   - **"Start command failed"** → Verify start command is: `cd backend && npm start`

3. If Root Directory is set to `backend`:
   - Build Command: `npm install`
   - Start Command: `npm start`

### Problem: Backend Won't Start

**Symptoms:**
- Build succeeds but service shows "Failed" or "Unhealthy"

**Solution:**
1. Check Render logs for startup errors
2. Verify environment variables are set:
   - `NODE_ENV=production`
   - `PORT=10000`
   - `SUPABASE_URL` is set
   - `SUPABASE_KEY` is set
3. Test locally first: `cd backend && npm start`

### Problem: CORS Errors

**Symptoms:**
- Browser console shows: `CORS policy: No 'Access-Control-Allow-Origin'`
- Network requests fail

**Solution:**
1. Go to Render → Environment tab
2. Verify `FRONTEND_URL` is set to: `https://poc-kwpr.vercel.app`
   - ⚠️ No trailing slash!
   - ⚠️ Must be `https://` not `http://`
3. Save and wait for auto-redeploy
4. Clear browser cache and try again

### Problem: "Missing Supabase environment variables"

**Symptoms:**
- Backend logs show Supabase errors
- Login fails

**Solution:**
1. Go to Render → Environment tab
2. Verify both are set:
   - `SUPABASE_URL` = Your Supabase project URL
   - `SUPABASE_KEY` = Your Supabase anon key
3. Check values are correct (no extra spaces)
4. Use the **anon** key, not service_role key
5. Save and redeploy

### Problem: Frontend Can't Connect to Backend

**Symptoms:**
- Frontend shows "Failed to load" errors
- Network tab shows failed requests

**Solution:**
1. Verify `NEXT_PUBLIC_BACKEND_URL` in Vercel:
   - Should be: `https://your-backend.onrender.com/api`
   - Must include `/api` at the end!
2. Test backend directly: Visit `https://your-backend.onrender.com/health`
3. Check Render service is running (not sleeping)
4. Redeploy frontend after updating environment variable

### Problem: Backend is "Sleeping"

**Symptoms:**
- First request takes 30+ seconds
- Service shows "Sleeping" status

**Solution:**
- This is **normal** for Render free tier
- Services sleep after 15 minutes of inactivity
- First request will wake it up (takes ~30 seconds)
- Consider upgrading to paid tier for always-on service

---

## Quick Reference Checklist

### Before Deploying:
- [ ] Code is pushed to GitHub
- [ ] Backend folder structure is correct
- [ ] `package.json` has all dependencies
- [ ] You have Supabase credentials
- [ ] You have your Vercel frontend URL

### During Deployment:
- [ ] Root Directory set (empty or `backend`)
- [ ] Build Command: `cd backend && npm install`
- [ ] Start Command: `cd backend && npm start`
- [ ] All environment variables added
- [ ] `FRONTEND_URL` = `https://poc-kwpr.vercel.app`
- [ ] Service created successfully

### After Deployment:
- [ ] Backend URL copied
- [ ] Backend health check works: `/health` returns `{"status":"ok"}`
- [ ] `NEXT_PUBLIC_BACKEND_URL` added to Vercel
- [ ] Frontend redeployed
- [ ] Tested login flow
- [ ] No errors in browser console
- [ ] API calls working in Network tab

---

## Environment Variables Summary

### Render (Backend) - Required:
```
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://poc-kwpr.vercel.app
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=your_supabase_anon_key
JWT_SECRET=your_generated_secret
```

### Render (Backend) - Optional:
```
SERVICEM8_USE_MOCK=true
SERVICEM8_API_KEY=your_api_key
```

### Vercel (Frontend) - Required:
```
NEXT_PUBLIC_BACKEND_URL=https://your-backend.onrender.com/api
```

---

## Your URLs

**Frontend (Vercel):**
```
https://poc-kwpr.vercel.app
```

**Backend (Render):**
```
https://____________________.onrender.com
```
*(Fill in after deployment)*

**Backend API Base (for Vercel):**
```
https://____________________.onrender.com/api
```

---

## Summary

1. ✅ **Deploy to Render:**
   - Create Web Service
   - Connect GitHub repo
   - Set build/start commands
   - Add all environment variables
   - Deploy

2. ✅ **Connect Vercel:**
   - Add `NEXT_PUBLIC_BACKEND_URL` to Vercel
   - Redeploy frontend

3. ✅ **Test:**
   - Backend health check
   - Frontend login
   - Check for errors

That's it! Your backend is now deployed on Render and connected to your Vercel frontend! 🎉

