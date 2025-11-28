# ServiceM8 API Fix - Step by Step Guide

## The Problem
Your ServiceM8 API is returning "access_denied" which means your API key doesn't have the right permissions or is invalid.

## Step-by-Step Fix in ServiceM8 Dashboard

### Step 1: Log into ServiceM8
1. Go to https://app.servicem8.com (or your ServiceM8 URL)
2. Log in with your ServiceM8 account credentials

### Step 2: Navigate to API Settings
**Option A - Via Settings:**
1. Click on **Settings** (gear icon, usually top right)
2. Look for **API** or **Integrations** in the menu
3. Click on **API Keys** or **API Access**

**Option B - Via Integrations:**
1. Click on **Integrations** in the main menu
2. Look for **API** or **API Keys**
3. Click to open API settings

### Step 3: Check Your Current API Key
1. Find your existing API key (starts with `smk-`)
2. Check if it's **Active** or **Enabled**
3. Look for **Permissions** or **Scopes** section

### Step 4: Verify/Enable Permissions
Your API key MUST have these permissions enabled:
- ✅ **Jobs** - Read access (required for `/api/job.json`)
- ✅ **API Access** - General API access
- ✅ **Read** permissions (not just write)

**How to check:**
- Look for a "Permissions" or "Scopes" section
- Ensure "Jobs" is checked/enabled
- Ensure "Read" is checked/enabled

### Step 5: Regenerate API Key (Recommended)
If permissions look correct but it still doesn't work:

1. **Delete the old API key:**
   - Find your current API key
   - Click **Delete** or **Revoke**
   - Confirm deletion

2. **Create a new API key:**
   - Click **Create New API Key** or **Generate API Key**
   - Give it a name (e.g., "Customer Portal API")
   - **IMPORTANT:** When setting permissions, ensure:
     - ✅ Jobs - Read
     - ✅ API Access - Enabled
   - Click **Create** or **Generate**

3. **Copy the new API key:**
   - Copy the ENTIRE key (it will look like: `smk-xxxxx-xxxxx-xxxxx`)
   - ⚠️ **This is the only time you'll see it** - save it immediately!

### Step 6: Update Your Backend .env File
1. Open `backend/.env` file
2. Find the line: `SERVICEM8_API_KEY=...`
3. Replace with your new API key:
   ```
   SERVICEM8_API_KEY=smk-your-new-api-key-here
   ```
4. Save the file

### Step 7: Restart Backend Server
1. Stop your backend server (Ctrl+C in the terminal)
2. Restart it:
   ```bash
   cd backend
   npm run dev
   ```

### Step 8: Test the Connection
1. Refresh your browser on the bookings page
2. Check the backend terminal - you should see successful API calls
3. If it works, you'll see bookings (or "No bookings found" if none match your email/phone)

## Common Issues & Solutions

### Issue: "I don't see API Keys option"
**Solution:** 
- Your ServiceM8 plan might not include API access
- Contact ServiceM8 support to enable API access
- Some plans require upgrading

### Issue: "I see API Keys but can't set permissions"
**Solution:**
- Some ServiceM8 accounts have all permissions enabled by default
- Try regenerating the key anyway
- Contact ServiceM8 support if permissions are locked

### Issue: "API key works but returns empty results"
**Solution:**
- This is normal if no jobs match your customer email/phone
- The API is working, just no matching data
- Try logging in with an email/phone that matches a job in ServiceM8

### Issue: "Still getting access_denied after regenerating"
**Solution:**
1. Double-check you copied the ENTIRE API key (no spaces, no truncation)
2. Verify the key in `.env` file matches exactly
3. Restart the backend server after updating `.env`
4. Check ServiceM8 account type - some require special API access
5. Contact ServiceM8 support for API access verification

## Verify API Key Format
Your API key should:
- Start with `smk-`
- Be about 40-50 characters long
- Have no spaces or line breaks
- Match exactly what's shown in ServiceM8 dashboard

## Test Your API Key Manually
You can test if your API key works using this command (replace YOUR_API_KEY):

```bash
curl -X GET "https://api.servicem8.com/api/job.json" \
  -H "Authorization: Basic $(echo -n 'YOUR_API_KEY:' | base64)" \
  -H "Content-Type: application/json"
```

If it works, you'll get JSON data. If not, you'll see an error.

## Still Having Issues?
1. Check ServiceM8 API documentation: https://developer.servicem8.com/docs/
2. Contact ServiceM8 support - they can verify your API access
3. Verify your ServiceM8 subscription includes API features

