# CORS Error Fix Guide

## The Problem

You're seeing this error:
```
Access to fetch at 'https://poc-ebr9.onrender.com/auth/login' from origin 'https://poc-kwpr.vercel.app' has been blocked by CORS policy
```

## Issues to Fix

### 1. Backend URL Missing `/api` Prefix

The error shows the request is going to:
```
https://poc-ebr9.onrender.com/auth/login
```

But it should be:
```
https://poc-ebr9.onrender.com/api/auth/login
```

### 2. CORS Configuration

The backend needs to properly allow your Vercel frontend.

---

## Step-by-Step Fix

### Step 1: Update Vercel Environment Variable

1. Go to **Vercel Dashboard** → Your project → **Settings** → **Environment Variables**
2. Find `NEXT_PUBLIC_BACKEND_URL`
3. Make sure it's set to:
   ```
   https://poc-ebr9.onrender.com/api
   ```
   ⚠️ **Must include `/api` at the end!**
4. If it's wrong, update it and **Save**
5. **Redeploy** your frontend:
   - Go to **Deployments** tab
   - Click **⋯** on latest deployment
   - Click **Redeploy**

### Step 2: Update Render Environment Variable

1. Go to **Render Dashboard** → Your backend service → **Environment** tab
2. Find or add `FRONTEND_URL`
3. Set it to:
   ```
   https://poc-kwpr.vercel.app
   ```
   ⚠️ **No trailing slash!**
4. **Save Changes** (Render will auto-redeploy)

### Step 3: Push Updated Backend Code

I've updated the CORS configuration. Push the changes:

```bash
git add backend/server.js
git commit -m "Fix CORS configuration for Vercel frontend"
git push origin main
```

Render will automatically redeploy.

### Step 4: Wait for Redeployments

- **Render:** Usually takes 2-5 minutes
- **Vercel:** Usually takes 1-3 minutes

### Step 5: Test Again

1. Clear your browser cache (Ctrl+Shift+Delete)
2. Visit: `https://poc-kwpr.vercel.app`
3. Try logging in
4. Check browser console (F12) - should have no CORS errors

---

## Verify Your Configuration

### In Vercel:
```
NEXT_PUBLIC_BACKEND_URL = https://poc-ebr9.onrender.com/api
```

### In Render:
```
FRONTEND_URL = https://poc-kwpr.vercel.app
```

---

## If Still Not Working

### Check Render Logs:
1. Go to Render → Your service → **Logs** tab
2. Look for:
   - `🚀 Server running on port...`
   - `🌐 Allowed origins: https://poc-kwpr.vercel.app...`
3. If you see CORS errors in logs, the origin might not match exactly

### Check Browser Network Tab:
1. Open Developer Tools (F12)
2. Go to **Network** tab
3. Try logging in
4. Click on the failed request
5. Check:
   - **Request URL:** Should be `https://poc-ebr9.onrender.com/api/auth/login`
   - **Request Headers:** Should include `Origin: https://poc-kwpr.vercel.app`
   - **Response Headers:** Should include `Access-Control-Allow-Origin: https://poc-kwpr.vercel.app`

---

## Quick Checklist

- [ ] `NEXT_PUBLIC_BACKEND_URL` in Vercel = `https://poc-ebr9.onrender.com/api`
- [ ] `FRONTEND_URL` in Render = `https://poc-kwpr.vercel.app`
- [ ] Both services redeployed
- [ ] Browser cache cleared
- [ ] Tested login - no CORS errors

