# Deployment Guide

This guide will help you deploy:
- **Frontend (Next.js)** → Vercel
- **Backend (Express.js)** → Render

---

## Prerequisites

1. **GitHub Account** (for connecting to Vercel/Render)
2. **Vercel Account** - Sign up at https://vercel.com
3. **Render Account** - Sign up at https://render.com
4. **Supabase Project** - Your database credentials
5. **ServiceM8 API Key** (optional, mock data works fine for POC)

---

## Step 1: Prepare Your Repository

### 1.1 Push to GitHub

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - ready for deployment"

# Create a repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

### 1.2 Verify .gitignore

Make sure `.gitignore` includes:
- `.env` files
- `node_modules/`
- `.next/`
- Other sensitive files

---

## Step 2: Deploy Backend to Render

### 2.1 Create Render Web Service

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:
   - **Name:** `customer-portal-backend`
   - **Environment:** `Node`
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `cd backend && npm start`
   - **Plan:** Free (or paid if you prefer)

### 2.2 Set Environment Variables in Render

In Render dashboard, go to your service → **Environment** tab, add:

```bash
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://your-frontend.vercel.app

# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key

# JWT
JWT_SECRET=your_strong_random_jwt_secret_here

# ServiceM8 (optional)
SERVICEM8_API_KEY=your_servicem8_api_key
SERVICEM8_USE_MOCK=true

# Backend URL (for reference)
BACKEND_URL=https://your-backend.onrender.com
```

**Important:**
- Generate a strong JWT_SECRET: `openssl rand -base64 32`
- Get your Supabase URL and key from Supabase dashboard
- Set `FRONTEND_URL` to your Vercel URL (you'll update this after deploying frontend)

### 2.3 Deploy

1. Click **"Create Web Service"**
2. Render will automatically build and deploy
3. Wait for deployment to complete
4. Copy your backend URL (e.g., `https://customer-portal-backend.onrender.com`)

### 2.4 Test Backend

Visit: `https://your-backend.onrender.com/health`

Should return: `{"status":"ok"}`

---

## Step 3: Deploy Frontend to Vercel

### 3.1 Connect Repository to Vercel

1. Go to https://vercel.com
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset:** Next.js
   - **Root Directory:** `frontend` (IMPORTANT!)
   - **Build Command:** `npm run build` (or leave default)
   - **Output Directory:** `.next` (or leave default)

### 3.2 Set Environment Variables in Vercel

In Vercel project settings → **Environment Variables**, add:

```bash
NEXT_PUBLIC_BACKEND_URL=https://your-backend.onrender.com/api
```

**Replace `your-backend.onrender.com` with your actual Render backend URL!**

### 3.3 Deploy

1. Click **"Deploy"**
2. Wait for build to complete
3. Copy your frontend URL (e.g., `https://your-project.vercel.app`)

### 3.4 Update Backend CORS

Go back to Render dashboard:
1. Edit your backend service
2. Update `FRONTEND_URL` environment variable:
   ```
   FRONTEND_URL=https://your-project.vercel.app
   ```
3. Save and redeploy (or it will auto-redeploy)

---

## Step 4: Verify Deployment

### 4.1 Test Backend Health
```
https://your-backend.onrender.com/health
```

### 4.2 Test Frontend
1. Visit your Vercel URL
2. Try logging in
3. Check if bookings load

### 4.3 Check Logs

**Render (Backend):**
- Go to your service → **Logs** tab
- Check for any errors

**Vercel (Frontend):**
- Go to your project → **Deployments** → Click on deployment → **Logs**
- Check for build errors

---

## Step 5: Update Supabase CORS (if needed)

If you have CORS issues with Supabase:

1. Go to Supabase Dashboard
2. Settings → API
3. Add your frontend URL to allowed origins:
   - `https://your-project.vercel.app`
   - `http://localhost:3000` (for local development)

---

## Troubleshooting

### Backend Issues

**Problem: Build fails**
- Check that `package.json` has correct scripts
- Verify all dependencies are listed
- Check Render logs for specific errors

**Problem: Service won't start**
- Verify `PORT` environment variable is set
- Check that `server.js` is the entry point
- Look for errors in Render logs

**Problem: CORS errors**
- Verify `FRONTEND_URL` matches your Vercel URL exactly
- Check backend logs for CORS errors
- Ensure no trailing slashes in URLs

### Frontend Issues

**Problem: Build fails**
- Check Next.js version compatibility
- Verify all dependencies are installed
- Check Vercel build logs

**Problem: API calls fail**
- Verify `NEXT_PUBLIC_BACKEND_URL` is set correctly
- Check browser console for errors
- Ensure backend is running and accessible

**Problem: Environment variables not working**
- Vercel requires `NEXT_PUBLIC_` prefix for client-side variables
- Redeploy after adding new environment variables
- Check Vercel environment variable settings

### Common Errors

**"Cannot connect to backend"**
- Check backend URL is correct
- Verify backend is running (check Render dashboard)
- Test backend health endpoint directly

**"CORS error"**
- Update `FRONTEND_URL` in Render
- Check backend CORS configuration
- Verify URLs match exactly (no trailing slashes)

**"Authentication failed"**
- Check JWT_SECRET is set in Render
- Verify token is being sent in requests
- Check backend logs for JWT errors

---

## Environment Variables Summary

### Render (Backend)
```bash
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://your-frontend.vercel.app
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
JWT_SECRET=your_jwt_secret
SERVICEM8_API_KEY=your_api_key (optional)
SERVICEM8_USE_MOCK=true (optional)
```

### Vercel (Frontend)
```bash
NEXT_PUBLIC_BACKEND_URL=https://your-backend.onrender.com/api
```

---

## Quick Reference

### Render Backend URL Format
```
https://your-service-name.onrender.com
```

### Vercel Frontend URL Format
```
https://your-project.vercel.app
```

### Update Backend CORS After Frontend Deploy
1. Get your Vercel URL
2. Update `FRONTEND_URL` in Render
3. Redeploy backend (or wait for auto-redeploy)

---

## Next Steps

1. ✅ Backend deployed to Render
2. ✅ Frontend deployed to Vercel
3. ✅ Environment variables configured
4. ✅ CORS updated
5. ✅ Test the application

Your POC is now live! 🎉

---

## Notes

- **Free tiers have limitations:**
  - Render free tier: Services spin down after 15 minutes of inactivity
  - Vercel free tier: Generous, but has build time limits

- **For production:**
  - Consider paid tiers for better performance
  - Set up custom domains
  - Enable monitoring and logging
  - Set up CI/CD pipelines

