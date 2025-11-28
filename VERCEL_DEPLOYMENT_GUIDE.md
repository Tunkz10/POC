# Complete Guide: Deploy Frontend to Vercel & Connect to Render

This is a step-by-step guide to deploy your Next.js frontend to Vercel and connect it to your Render backend.

---

## Prerequisites

✅ Your backend is already deployed on Render  
✅ You have a GitHub account  
✅ Your code is pushed to GitHub  
✅ You have your Render backend URL (e.g., `https://your-backend.onrender.com`)

---

## Part 1: Prepare Your Code

### Step 1.1: Verify Your Frontend Structure

Make sure your project structure looks like this:
```
your-project/
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── package.json
│   └── next.config.js
├── backend/
└── README.md
```

### Step 1.2: Check Your API Configuration

Your `frontend/lib/api.js` should have:
```javascript
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001/api';
```

This is already correct! ✅

### Step 1.3: Push to GitHub (if not already done)

```bash
# If you haven't pushed to GitHub yet:
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

---

## Part 2: Deploy to Vercel

### Step 2.1: Sign Up / Log In to Vercel

1. Go to **https://vercel.com**
2. Click **"Sign Up"** (or **"Log In"** if you have an account)
3. Choose **"Continue with GitHub"** (recommended)
4. Authorize Vercel to access your GitHub

### Step 2.2: Create New Project

1. After logging in, you'll see the Vercel dashboard
2. Click the **"Add New..."** button (top right)
3. Select **"Project"**

### Step 2.3: Import Your Repository

1. You'll see a list of your GitHub repositories
2. **Find and click** on your project repository
3. Click **"Import"**

### Step 2.4: Configure Project Settings

**⚠️ IMPORTANT: Set the Root Directory!**

1. You'll see the **"Configure Project"** page
2. Look for **"Root Directory"** section
3. Click **"Edit"** next to Root Directory
4. Type: `frontend`
5. Click **"Continue"**

**Other Settings (usually auto-detected):**
- **Framework Preset:** Next.js (should be auto-detected)
- **Build Command:** `npm run build` (default - leave as is)
- **Output Directory:** `.next` (default - leave as is)
- **Install Command:** `npm install` (default - leave as is)

### Step 2.5: Add Environment Variable

**Before deploying, add your backend URL:**

1. On the same configuration page, scroll down to **"Environment Variables"**
2. Click **"Add"** or the **"+"** button
3. Add this variable:

   **Name:**
   ```
   NEXT_PUBLIC_BACKEND_URL
   ```

   **Value:**
   ```
   https://your-backend.onrender.com/api
   ```
   *(Replace `your-backend.onrender.com` with your actual Render backend URL)*

   **Environment:** Select all three:
   - ☑️ Production
   - ☑️ Preview  
   - ☑️ Development

4. Click **"Add"** to save

### Step 2.6: Deploy

1. Scroll to the bottom of the configuration page
2. Click the big **"Deploy"** button
3. Wait for the build to complete (usually 1-3 minutes)

**What happens:**
- Vercel installs dependencies
- Builds your Next.js app
- Deploys it to a URL

### Step 2.7: Get Your Frontend URL

1. Once deployment completes, you'll see:
   - ✅ **"Congratulations! Your project has been deployed"**
   - A URL like: `https://your-project.vercel.app`

2. **Copy this URL** - you'll need it for the next step!

---

## Part 3: Connect Frontend to Backend

### Step 3.1: Update Render Backend CORS

Now we need to tell your Render backend to accept requests from your Vercel frontend.

1. Go to **https://dashboard.render.com**
2. Click on your **backend service**
3. Go to the **"Environment"** tab
4. Find the `FRONTEND_URL` variable (or add it if it doesn't exist)

5. **Update/Add:**
   - **Key:** `FRONTEND_URL`
   - **Value:** Your Vercel URL (from Step 2.7)
     - Example: `https://your-project.vercel.app`
     - ⚠️ **No trailing slash!**

6. Click **"Save Changes"**
7. Render will automatically **redeploy** your backend

### Step 3.2: Verify Environment Variables in Vercel

Double-check your Vercel environment variable is correct:

1. Go back to Vercel dashboard
2. Click on your project
3. Go to **Settings** → **Environment Variables**
4. Verify `NEXT_PUBLIC_BACKEND_URL` is set correctly:
   - Should be: `https://your-backend.onrender.com/api`
   - Must include `/api` at the end!

---

## Part 4: Test Your Deployment

### Step 4.1: Test Backend Connection

1. Visit your Render backend health endpoint:
   ```
   https://your-backend.onrender.com/health
   ```
2. Should return: `{"status":"ok"}`

### Step 4.2: Test Frontend

1. Visit your Vercel frontend URL:
   ```
   https://your-project.vercel.app
   ```
2. You should see your login page

### Step 4.3: Test Full Flow

1. **Open Browser Developer Tools:**
   - Press `F12` or right-click → "Inspect"
   - Go to the **"Console"** tab
   - Go to the **"Network"** tab

2. **Try to Log In:**
   - Enter an email and phone number
   - Click "Sign in"
   - Watch the Network tab for API calls

3. **Check for Errors:**
   - **Console tab:** Should have no red errors
   - **Network tab:** API calls should show `200 OK` (green)
   - If you see CORS errors, go back to Step 3.1

### Step 4.4: Verify Backend Logs

1. Go to Render dashboard → Your backend service
2. Click **"Logs"** tab
3. You should see:
   - `🚀 Server running on port...`
   - Incoming API requests when you use the frontend

---

## Part 5: Troubleshooting

### Problem: "Cannot connect to backend"

**Symptoms:**
- Frontend shows error messages
- Network tab shows failed requests

**Solution:**
1. Verify `NEXT_PUBLIC_BACKEND_URL` in Vercel:
   - Go to Vercel → Settings → Environment Variables
   - Should be: `https://your-backend.onrender.com/api`
   - Must include `/api`!
2. Test backend directly: Visit `https://your-backend.onrender.com/health`
3. Redeploy frontend after fixing the variable

### Problem: CORS Error

**Symptoms:**
- Browser console shows: `CORS policy: No 'Access-Control-Allow-Origin'`
- Network requests fail with CORS error

**Solution:**
1. Go to Render → Environment tab
2. Check `FRONTEND_URL` matches your Vercel URL exactly:
   - Correct: `https://your-project.vercel.app`
   - Wrong: `https://your-project.vercel.app/` (trailing slash)
   - Wrong: `http://your-project.vercel.app` (http instead of https)
3. Save and wait for auto-redeploy
4. Clear browser cache and try again

### Problem: Build Fails on Vercel

**Symptoms:**
- Vercel deployment shows red error
- Build logs show errors

**Solution:**
1. Check Vercel build logs:
   - Go to Deployments → Click on failed deployment → View logs
2. Common issues:
   - **"Root Directory not found"** → Make sure Root Directory is set to `frontend`
   - **"Module not found"** → Check `package.json` has all dependencies
   - **"Build command failed"** → Check `next.config.js` is correct

### Problem: Environment Variable Not Working

**Symptoms:**
- Frontend still uses localhost URL
- API calls go to wrong URL

**Solution:**
1. In Vercel, environment variables starting with `NEXT_PUBLIC_` are needed for client-side
2. After adding/updating, you **must redeploy**:
   - Go to Deployments tab
   - Click **⋯** on latest deployment
   - Click **Redeploy**
3. Or push a new commit to trigger auto-deploy

---

## Quick Reference Checklist

### Before Deploying:
- [ ] Code is pushed to GitHub
- [ ] Frontend folder structure is correct
- [ ] `package.json` has all dependencies
- [ ] Backend is deployed on Render
- [ ] You have your Render backend URL

### During Deployment:
- [ ] Root Directory set to `frontend`
- [ ] `NEXT_PUBLIC_BACKEND_URL` environment variable added
- [ ] Value includes `/api` at the end
- [ ] Deployment completed successfully

### After Deployment:
- [ ] Copied Vercel frontend URL
- [ ] Updated `FRONTEND_URL` in Render
- [ ] Tested backend health endpoint
- [ ] Tested frontend login
- [ ] No errors in browser console
- [ ] API calls working in Network tab

---

## Your URLs (Fill in with your actual values)

**Frontend (Vercel):**
```
https://____________________.vercel.app
```

**Backend (Render):**
```
https://____________________.onrender.com
```

**Backend API Base (for Vercel env var):**
```
https://____________________.onrender.com/api
```

---

## Summary

1. ✅ **Deploy to Vercel:**
   - Import GitHub repo
   - Set Root Directory to `frontend`
   - Add `NEXT_PUBLIC_BACKEND_URL` environment variable
   - Deploy

2. ✅ **Connect to Render:**
   - Update `FRONTEND_URL` in Render to your Vercel URL
   - Wait for backend to redeploy

3. ✅ **Test:**
   - Visit your Vercel URL
   - Try logging in
   - Check for errors

That's it! Your frontend is now deployed and connected to your backend! 🎉

