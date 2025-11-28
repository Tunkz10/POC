# Quick Connection Steps

## 🔗 Connect Vercel → Render → Supabase

### Step 1: Vercel (Frontend)

**Add Environment Variable:**
```
NEXT_PUBLIC_BACKEND_URL = https://your-backend.onrender.com/api
```

**Where:** Vercel Dashboard → Your Project → Settings → Environment Variables

---

### Step 2: Render (Backend)

**Add Environment Variables:**

```
NODE_ENV = production
PORT = 10000
FRONTEND_URL = https://poc-kwpr.vercel.app
SUPABASE_URL = https://xxxxx.supabase.co
SUPABASE_KEY = your_supabase_anon_key
JWT_SECRET = generate_with_openssl_rand_base64_32
SERVICEM8_USE_MOCK = true
```

**Where:** Render Dashboard → Your Service → Environment Tab

---

### Step 3: Test

1. **Backend:** `https://your-backend.onrender.com/health` → Should return `{"status":"ok"}`
2. **Frontend:** Visit `https://poc-kwpr.vercel.app` → Try logging in
3. **Check:** Browser console should have no errors

---

## 🐛 Common Issues

**CORS Error?**
- Update `FRONTEND_URL` in Render to match Vercel URL exactly

**Can't Connect?**
- Verify `NEXT_PUBLIC_BACKEND_URL` includes `/api` at the end
- Check Render service is running (not sleeping)

**Supabase Error?**
- Verify `SUPABASE_URL` and `SUPABASE_KEY` are correct in Render
- Use the **anon** key, not service_role

---

## 📋 Checklist

- [ ] Vercel: `NEXT_PUBLIC_BACKEND_URL` set
- [ ] Render: `FRONTEND_URL` set to Vercel URL
- [ ] Render: `SUPABASE_URL` set
- [ ] Render: `SUPABASE_KEY` set
- [ ] Render: `JWT_SECRET` set
- [ ] Both services redeployed
- [ ] Tested login flow
- [ ] No errors in console

