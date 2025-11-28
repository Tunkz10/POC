# Quick Deployment Steps

## 🚀 Deploy Backend to Render

1. **Go to Render:** https://dashboard.render.com
2. **Click "New +" → "Web Service"**
3. **Connect your GitHub repo**
4. **Configure:**
   - Name: `customer-portal-backend`
   - Environment: `Node`
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
   - Plan: Free

5. **Add Environment Variables:**
   ```
   NODE_ENV=production
   PORT=10000
   FRONTEND_URL=https://your-frontend.vercel.app (update after frontend deploy)
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_anon_key
   JWT_SECRET=generate_with_openssl_rand_base64_32
   SERVICEM8_USE_MOCK=true
   ```

6. **Deploy and copy your backend URL** (e.g., `https://customer-portal-backend.onrender.com`)

---

## 🎨 Deploy Frontend to Vercel

1. **Go to Vercel:** https://vercel.com
2. **Click "Add New..." → "Project"**
3. **Import your GitHub repo**
4. **Configure:**
   - Framework: Next.js
   - Root Directory: `frontend` ⚠️ **IMPORTANT!**
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

5. **Add Environment Variable:**
   ```
   NEXT_PUBLIC_BACKEND_URL=https://your-backend.onrender.com/api
   ```
   (Replace with your actual Render backend URL)

6. **Deploy**

7. **Copy your frontend URL** (e.g., `https://your-project.vercel.app`)

---

## 🔄 Update Backend CORS

1. Go back to Render dashboard
2. Edit your backend service
3. Update `FRONTEND_URL` to your Vercel URL:
   ```
   FRONTEND_URL=https://your-project.vercel.app
   ```
4. Save (auto-redeploys)

---

## ✅ Test

- Backend: `https://your-backend.onrender.com/health`
- Frontend: Visit your Vercel URL and test login

---

## 📝 Environment Variables Checklist

### Render (Backend)
- [ ] NODE_ENV=production
- [ ] PORT=10000
- [ ] FRONTEND_URL=(your Vercel URL)
- [ ] SUPABASE_URL=(from Supabase dashboard)
- [ ] SUPABASE_KEY=(from Supabase dashboard)
- [ ] JWT_SECRET=(generate: `openssl rand -base64 32`)
- [ ] SERVICEM8_USE_MOCK=true

### Vercel (Frontend)
- [ ] NEXT_PUBLIC_BACKEND_URL=(your Render backend URL + /api)

---

## 🐛 Common Issues

**CORS Error?**
- Update FRONTEND_URL in Render to match Vercel URL exactly

**Build Fails?**
- Check Root Directory is set to `frontend` in Vercel
- Verify all dependencies in package.json

**Backend Not Starting?**
- Check PORT is set to 10000 in Render
- Verify build command includes `cd backend`

