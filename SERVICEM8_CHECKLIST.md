# ServiceM8 API Setup Checklist

## What You Need to Check/Do on ServiceM8

### 1. **Account Type & API Access**
- [ ] **Check if your account has API access enabled**
  - Free trial accounts typically **DO NOT** have API access
  - You need a **paid subscription** for API access
  - Contact ServiceM8 support to verify: support@servicem8.com

### 2. **API Key Configuration**
- [ ] **Verify API Key exists:**
  - Log into ServiceM8 web portal
  - Go to: Settings → API Keys
  - Check if you have an API key created

- [ ] **Check API Key Permissions:**
  - The API key must have **"Jobs"** permission enabled
  - The API key should be **"Read Only"** or **"Read/Write"** (not disabled)
  - Verify the key is **Active** (not expired or revoked)

- [ ] **Verify API Key Format:**
  - Should be a long string (usually 32+ characters)
  - Copy the **entire key** (no spaces, no line breaks)
  - Paste it in your `.env` file as: `SERVICEM8_API_KEY=your_key_here`

### 3. **ServiceM8 Account Settings**
- [ ] **Check Account Status:**
  - Account must be **active** (not suspended)
  - Subscription must be **current** (not expired)
  - Billing must be **up to date**

- [ ] **Verify API Access is Enabled:**
  - Some accounts need API access explicitly enabled by ServiceM8 support
  - Contact support if you have a paid account but API doesn't work

### 4. **Test Your API Key**

#### Option A: Use the Test Endpoint
```bash
# Start your backend server, then visit:
http://localhost:3001/api/bookings/test-api
```

This will show you:
- Which endpoints were tried
- What error codes you're getting
- Whether authentication is working

#### Option B: Test with curl
```bash
# Replace YOUR_API_KEY with your actual key
curl -u "YOUR_API_KEY:" https://api.servicem8.com/api_1.0/job.json
```

**Expected Results:**
- ✅ **200 OK** = API is working! You'll see JSON data
- ❌ **401 Unauthorized** = API key is wrong or inactive
- ❌ **403 Forbidden** = API access not enabled for your account
- ❌ **404 Not Found** = Wrong endpoint (try different endpoint format)

### 5. **Common Issues & Solutions**

#### Issue: 403 Forbidden
**Cause:** API access is disabled on your account (common with free trials)
**Solution:** 
- Upgrade to a paid plan
- Contact ServiceM8 support to enable API access
- Use mock data mode for POC (set `SERVICEM8_USE_MOCK=true` in `.env`)

#### Issue: 401 Unauthorized
**Cause:** API key is incorrect or inactive
**Solution:**
- Double-check the API key in ServiceM8 settings
- Make sure you copied the entire key (no truncation)
- Verify the key has Jobs permission
- Create a new API key if needed

#### Issue: 404 Not Found
**Cause:** Wrong API endpoint format
**Solution:**
- The code tries multiple endpoint formats automatically
- Check ServiceM8 API documentation for your account type
- Different account types may use different endpoint formats

#### Issue: Timeout/Connection Error
**Cause:** Network issue or ServiceM8 API is down
**Solution:**
- Check your internet connection
- Verify ServiceM8 API status page
- The code will automatically fall back to mock data

### 6. **For POC/Demo Purposes**

**If you can't get ServiceM8 API working, you can force mock mode:**

1. **Edit your `.env` file:**
   ```
   SERVICEM8_USE_MOCK=true
   ```

2. **Restart your backend server**

3. **The app will use mock data** that matches the ServiceM8 schema

This is **perfectly fine for a POC** - it demonstrates the functionality without needing real API access.

### 7. **Contact ServiceM8 Support**

If you have a paid account but API still doesn't work:

**Email:** support@servicem8.com

**Ask them:**
1. "Does my account have API access enabled?"
2. "What API endpoint format should I use?"
3. "Can you verify my API key is active?"
4. "What permissions does my API key have?"

### 8. **Quick Test Commands**

```bash
# Test if API key is in environment
cd backend
node -e "require('dotenv').config(); console.log('API Key:', process.env.SERVICEM8_API_KEY ? 'Set (' + process.env.SERVICEM8_API_KEY.substring(0, 10) + '...)' : 'NOT SET')"

# Test the API endpoint directly
curl -u "YOUR_API_KEY:" https://api.servicem8.com/api_1.0/job.json -v
```

## Summary

**For POC:** You don't need to fix ServiceM8 - just use mock mode!
- Set `SERVICEM8_USE_MOCK=true` in `.env`
- The app will work perfectly with mock data
- All functionality will work as expected

**For Production:** You'll need:
- Paid ServiceM8 subscription
- API access enabled by support
- Valid API key with Jobs permission
- Correct endpoint format for your account type

