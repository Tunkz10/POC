# ServiceM8 API Setup Guide

## Steps to Fix the 404 Error

### 1. Verify Your ServiceM8 API Key

**In ServiceM8 Dashboard:**
1. Log in to your ServiceM8 account
2. Go to **Settings** → **API Keys** (or **Integrations** → **API**)
3. Verify your API key exists and is active
4. Copy the full API key (it should look like: `smk-xxxxx-xxxxx-xxxxx`)

### 2. Check API Key Permissions

**Ensure your API key has access to:**
- ✅ **Jobs** (required for `/job.json` endpoint)
- ✅ **Read** permissions for jobs
- ✅ API access is enabled

### 3. Verify API Endpoint Format

The current endpoint being used is:
```
https://api.servicem8.com/api/job.json
```

**Possible issues:**
- Some ServiceM8 accounts might need a versioned endpoint like:
  - `https://api.servicem8.com/api/1.0/job.json`
  - Or just `/api/job` (without `.json`)

### 4. Test Your API Key Directly

You can test your API key using curl or Postman:

```bash
curl -X GET "https://api.servicem8.com/api/job.json" \
  -H "Authorization: Basic $(echo -n 'YOUR_API_KEY:' | base64)" \
  -H "Content-Type: application/json"
```

Replace `YOUR_API_KEY` with your actual API key.

### 5. Check ServiceM8 API Documentation

Visit: https://developer.servicem8.com/docs/

Look for:
- Correct endpoint format for jobs
- Authentication requirements
- API version requirements

### 6. Common Issues

**Issue: API Key Format**
- Make sure you're using the full API key
- Some keys might need to be prefixed differently
- Check if your ServiceM8 plan includes API access

**Issue: Endpoint Version**
- Try: `https://api.servicem8.com/api/1.0/job.json`
- Or: `https://api.servicem8.com/api/job` (without .json)

**Issue: Account Type**
- Some ServiceM8 account types might not have API access
- Verify your subscription includes API features

### 7. Alternative: Use ServiceM8 Webhook/Integration

If direct API access isn't working, you might need to:
- Set up a ServiceM8 webhook
- Use ServiceM8's integration platform
- Contact ServiceM8 support for API access

## Next Steps

1. Check your backend terminal for detailed error logs
2. Verify the API key in your `.env` file matches ServiceM8 dashboard
3. Test the API key using the curl command above
4. Check ServiceM8 API documentation for your account type

