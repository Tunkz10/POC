# Render Deployment - Quick Steps

## 🚀 Deploy Backend to Render

### 1. Go to Render
- Visit: https://render.com
- Sign up/Login with GitHub

### 2. Create Web Service
- Click **"New +"** → **"Web Service"**
- Select your GitHub repository
- Click **"Connect"**

### 3. Configure Service

**Basic:**
- **Name:** `customer-portal-backend`
- **Region:** Choose closest
- **Branch:** `main`
- **Runtime:** `Node`

**Build & Deploy:**
- **Root Directory:** Leave empty (or set to `backend`)
- **Build Command:** `cd backend && npm install`
- **Start Command:** `cd backend && npm start`
- **Plan:** Free

### 4. Add Environment Variables

Click **"Advanced"** → Add each:

```
NODE_ENV = production
PORT = 10000
FRONTEND_URL = https://poc-kwpr.vercel.app
SUPABASE_URL = https://xxxxx.supabase.co
SUPABASE_KEY = your_supabase_anon_key
JWT_SECRET = generate_with_openssl_rand_base64_32
SERVICEM8_USE_MOCK = true
```

### 5. Create & Deploy
- Click **"Create Web Service"**
- Wait 2-5 minutes
- Copy your backend URL (e.g., `https://customer-portal-backend.onrender.com`)

---

## 🔗 Connect Vercel Frontend

### 6. Add Environment Variable in Vercel
- Go to: https://vercel.com/dashboard
- Your project → **Settings** → **Environment Variables**
- **Add:**
  - **Name:** `NEXT_PUBLIC_BACKEND_URL`
  - **Value:** `https://your-backend.onrender.com/api`
  - **Environment:** All (Production, Preview, Development)

### 7. Redeploy Frontend
- **Deployments** tab → **⋯** → **Redeploy**

---

## ✅ Test

1. **Backend:** `https://your-backend.onrender.com/health` → `{"status":"ok"}`

2. **Frontend:** Visit `https://poc-kwpr.vercel.app` → Try logging in

3. **Check:** Browser console (F12) → No errors

---

## 🐛 Common Issues

**Build Fails?**
- Check Root Directory (empty or `backend`)
- Verify build command: `cd backend && npm install`

**CORS Error?**
- Update `FRONTEND_URL` in Render = `https://poc-kwpr.vercel.app` (no trailing slash)

**Can't Connect?**
- Verify `NEXT_PUBLIC_BACKEND_URL` includes `/api` at the end
- Test backend: `/health` endpoint

**Supabase Error?**
- Verify `SUPABASE_URL` and `SUPABASE_KEY` are set in Render
- Use **anon** key, not service_role

---

## 📋 Checklist

- [ ] Build Command: `cd backend && npm install`
- [ ] Start Command: `cd backend && npm start`
- [ ] `FRONTEND_URL` = `https://poc-kwpr.vercel.app`
- [ ] `SUPABASE_URL` and `SUPABASE_KEY` set
- [ ] `JWT_SECRET` generated and set
- [ ] Backend deployed successfully
- [ ] `NEXT_PUBLIC_BACKEND_URL` added to Vercel
- [ ] Frontend redeployed
- [ ] Tested - works! ✅

