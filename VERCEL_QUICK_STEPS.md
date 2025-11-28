# Vercel Deployment - Quick Steps

## 🚀 Deploy Frontend to Vercel

### 1. Go to Vercel
- Visit: https://vercel.com
- Sign up/Login with GitHub

### 2. Create Project
- Click **"Add New..."** → **"Project"**
- Select your GitHub repository
- Click **"Import"**

### 3. Configure (IMPORTANT!)
- **Root Directory:** Set to `frontend` ⚠️
- **Framework:** Next.js (auto-detected)
- **Build Command:** `npm run build` (default)
- **Output Directory:** `.next` (default)

### 4. Add Environment Variable
- Scroll to **"Environment Variables"**
- Click **"Add"**
- **Name:** `NEXT_PUBLIC_BACKEND_URL`
- **Value:** `https://your-backend.onrender.com/api`
- **Environment:** Select all (Production, Preview, Development)
- Click **"Add"**

### 5. Deploy
- Click **"Deploy"** button
- Wait 1-3 minutes
- Copy your Vercel URL (e.g., `https://your-project.vercel.app`)

---

## 🔗 Connect to Render Backend

### 6. Update Render CORS
- Go to: https://dashboard.render.com
- Click your backend service
- Go to **"Environment"** tab
- Add/Update: `FRONTEND_URL = https://your-project.vercel.app`
- Save (auto-redeploys)

---

## ✅ Test

1. **Backend:** `https://your-backend.onrender.com/health` → Should return `{"status":"ok"}`

2. **Frontend:** Visit your Vercel URL → Try logging in

3. **Check Console:** Press F12 → Console tab → Should have no errors

---

## 🐛 Common Issues

**CORS Error?**
- Update `FRONTEND_URL` in Render to match Vercel URL exactly (no trailing slash)

**Can't Connect?**
- Verify `NEXT_PUBLIC_BACKEND_URL` includes `/api` at the end
- Redeploy frontend after updating env var

**Build Fails?**
- Check Root Directory is set to `frontend`
- Verify all dependencies in `package.json`

---

## 📋 Checklist

- [ ] Root Directory = `frontend`
- [ ] `NEXT_PUBLIC_BACKEND_URL` = `https://your-backend.onrender.com/api`
- [ ] `FRONTEND_URL` in Render = your Vercel URL
- [ ] Both services deployed
- [ ] Tested login - works!

