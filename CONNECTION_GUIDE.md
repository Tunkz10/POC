# Connection Guide: Vercel ↔ Render ↔ Supabase

This guide shows you how to connect your three services together.

---

## Architecture Overview

```
[Vercel Frontend] 
    ↓ (API calls)
[Render Backend]
    ↓ (Database queries)
[Supabase Database]
```

---

## Step 1: Get Your Service URLs

### 1.1 Get Your Render Backend URL
1. Go to https://dashboard.render.com
2. Click on your backend service
3. Copy the URL (e.g., `https://customer-portal-backend.onrender.com`)
4. **Note:** Add `/api` at the end for the API base URL: `https://customer-portal-backend.onrender.com/api`

### 1.2 Get Your Vercel Frontend URL
1. Go to https://vercel.com/dashboard
2. Click on your project
3. Copy the URL (e.g., `https://poc-kwpr.vercel.app`)

### 1.3 Get Your Supabase Credentials
1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (the `anon` key, not the `service_role` key)

---

## Step 2: Configure Vercel (Frontend → Backend)

### 2.1 Add Environment Variable in Vercel

1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Click **Add New**
4. Add this variable:

   **Name:**
   ```
   NEXT_PUBLIC_BACKEND_URL
   ```

   **Value:**
   ```
   https://your-backend.onrender.com/api
   ```
   *(Replace `your-backend.onrender.com` with your actual Render URL)*

   **Environment:** Select all (Production, Preview, Development)

5. Click **Save**

### 2.2 Redeploy Frontend

1. Go to **Deployments** tab
2. Click the **⋯** menu on the latest deployment
3. Click **Redeploy**
4. Wait for deployment to complete

**OR** just push a new commit to trigger auto-deployment.

---

## Step 3: Configure Render (Backend → Supabase & Frontend)

### 3.1 Add Environment Variables in Render

1. Go to your Render service dashboard
2. Click **Environment** tab
3. Click **Add Environment Variable** for each:

#### Required Variables:

**1. Supabase Connection:**
   - **Key:** `SUPABASE_URL`
   - **Value:** Your Supabase Project URL (from Step 1.3)
   - Example: `https://xxxxx.supabase.co`

   - **Key:** `SUPABASE_KEY`
   - **Value:** Your Supabase anon key (from Step 1.3)
   - Example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

**2. Frontend URL (for CORS):**
   - **Key:** `FRONTEND_URL`
   - **Value:** Your Vercel frontend URL (from Step 1.2)
   - Example: `https://poc-kwpr.vercel.app`

**3. Server Configuration:**
   - **Key:** `NODE_ENV`
   - **Value:** `production`

   - **Key:** `PORT`
   - **Value:** `10000` (Render sets this automatically, but good to have)

**4. JWT Secret:**
   - **Key:** `JWT_SECRET`
   - **Value:** Generate a strong random string
   - Generate with: `openssl rand -base64 32`
   - Or use an online generator: https://randomkeygen.com/

**5. ServiceM8 (Optional - for mock data):**
   - **Key:** `SERVICEM8_USE_MOCK`
   - **Value:** `true`

   - **Key:** `SERVICEM8_API_KEY` (optional)
   - **Value:** Your ServiceM8 API key (if you have one)

### 3.2 Save and Redeploy

1. Click **Save Changes**
2. Render will automatically redeploy
3. Wait for deployment to complete

---

## Step 4: Verify Connections

### 4.1 Test Backend → Supabase

1. Visit your Render backend health endpoint:
   ```
   https://your-backend.onrender.com/health
   ```
2. Should return: `{"status":"ok"}`

3. Check Render logs:
   - Go to Render dashboard → Your service → **Logs**
   - Look for: `🚀 Server running on port...`
   - Should NOT see: `Missing Supabase environment variables`

### 4.2 Test Frontend → Backend

1. Visit your Vercel frontend: `https://poc-kwpr.vercel.app`
2. Open browser Developer Tools (F12) → **Console** tab
3. Try to log in
4. Check the **Network** tab:
   - Look for requests to your Render backend URL
   - Should see `200 OK` responses (not CORS errors)

### 4.3 Test Full Flow

1. **Login:**
   - Go to: `https://poc-kwpr.vercel.app/login`
   - Enter email and phone
   - Click "Sign in"
   - Should redirect to bookings page

2. **View Bookings:**
   - Should see bookings list (mock data if ServiceM8 not connected)
   - No errors in console

3. **Check Backend Logs:**
   - Go to Render → Logs
   - Should see API requests coming through

---

## Step 5: Troubleshooting

### Problem: CORS Errors

**Symptoms:**
- Browser console shows: `CORS policy: No 'Access-Control-Allow-Origin' header`
- Network tab shows red requests

**Solution:**
1. Verify `FRONTEND_URL` in Render matches your Vercel URL exactly
2. No trailing slashes: `https://poc-kwpr.vercel.app` (not `https://poc-kwpr.vercel.app/`)
3. Check backend logs for CORS errors
4. Redeploy backend after updating `FRONTEND_URL`

### Problem: "Cannot connect to backend"

**Symptoms:**
- Frontend shows: "Failed to load bookings"
- Network tab shows failed requests

**Solution:**
1. Verify `NEXT_PUBLIC_BACKEND_URL` in Vercel:
   - Should be: `https://your-backend.onrender.com/api`
   - Must include `/api` at the end
2. Test backend directly: Visit `https://your-backend.onrender.com/health`
3. Check Render service is running (not sleeping)
4. Redeploy frontend after updating environment variable

### Problem: "Missing Supabase environment variables"

**Symptoms:**
- Backend logs show Supabase errors
- Login fails

**Solution:**
1. Verify `SUPABASE_URL` and `SUPABASE_KEY` are set in Render
2. Check values are correct (no extra spaces)
3. Use the **anon** key, not service_role key
4. Redeploy backend after updating

### Problem: Backend is "Sleeping"

**Symptoms:**
- First request takes 30+ seconds
- Render free tier services sleep after 15 minutes of inactivity

**Solution:**
- This is normal for free tier
- First request will wake it up (takes ~30 seconds)
- Consider upgrading to paid tier for always-on service

---

## Environment Variables Checklist

### ✅ Vercel (Frontend)
- [ ] `NEXT_PUBLIC_BACKEND_URL` = `https://your-backend.onrender.com/api`

### ✅ Render (Backend)
- [ ] `NODE_ENV` = `production`
- [ ] `PORT` = `10000`
- [ ] `FRONTEND_URL` = `https://poc-kwpr.vercel.app`
- [ ] `SUPABASE_URL` = `https://xxxxx.supabase.co`
- [ ] `SUPABASE_KEY` = `your_anon_key_here`
- [ ] `JWT_SECRET` = `your_generated_secret`
- [ ] `SERVICEM8_USE_MOCK` = `true` (optional)

---

## Quick Reference

### Your URLs (Update these with your actual values):

**Frontend (Vercel):**
```
https://poc-kwpr.vercel.app
```

**Backend (Render):**
```
https://your-backend.onrender.com
```

**Backend API Base:**
```
https://your-backend.onrender.com/api
```

**Supabase:**
```
https://xxxxx.supabase.co
```

---

## Testing Checklist

- [ ] Backend health check works: `/health` returns `{"status":"ok"}`
- [ ] Frontend loads without errors
- [ ] Login works (creates/retrieves customer in Supabase)
- [ ] Bookings page loads (shows mock data)
- [ ] No CORS errors in browser console
- [ ] Backend logs show incoming requests
- [ ] Messages can be sent and saved to Supabase

---

## Next Steps

Once everything is connected:
1. ✅ Test all features
2. ✅ Monitor logs for errors
3. ✅ Set up custom domains (optional)
4. ✅ Enable monitoring (optional)

Your POC is now fully connected! 🎉

