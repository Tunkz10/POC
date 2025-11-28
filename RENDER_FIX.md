# Render Deployment Fix

## The Problem
Error: `Cannot find package 'dotenv'` - This happens because Render isn't installing dependencies in the `backend` directory correctly.

## Solution

### Option 1: Set Root Directory in Render (RECOMMENDED)

1. Go to your Render service dashboard
2. Click **Settings**
3. Scroll to **Root Directory**
4. Set it to: `backend`
5. Save

Then use these commands:

**Build Command:**
```
npm install
```

**Start Command:**
```
npm start
```

---

### Option 2: Keep Root Directory Empty (Current Setup)

If you keep the root directory empty, use these commands:

**Build Command:**
```
cd backend && npm install --production
```

**Start Command:**
```
cd backend && npm start
```

---

### Option 3: Use package.json in Root (Alternative)

If the above doesn't work, you can create a root-level package.json that runs the backend:

Create `package.json` in the root directory:

```json
{
  "name": "customer-portal",
  "version": "1.0.0",
  "scripts": {
    "install-backend": "cd backend && npm install",
    "start": "cd backend && npm start"
  }
}
```

Then in Render:
- **Build Command:** `npm run install-backend`
- **Start Command:** `npm start`

---

## Recommended: Use Option 1

**Steps:**
1. Render Dashboard → Your Service → Settings
2. Set **Root Directory** to: `backend`
3. **Build Command:** `npm install`
4. **Start Command:** `npm start`
5. Save and redeploy

This is the cleanest solution and what Render recommends for monorepo structures.

