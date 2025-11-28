# ServiceM8 API Access Denied - Account Level Issue

## The Problem
Your API key is being rejected by ServiceM8 with "access_denied" even though you created a valid "Read Only" key. This indicates an **account-level** restriction, not a key problem.

## Why This Happens
ServiceM8 sometimes requires:
1. **Account-level API access** to be enabled (separate from creating API keys)
2. **Support ticket** to activate API features
3. **Account upgrade** or specific plan that includes API access
4. **API access approval** from ServiceM8 support team

## What You Need to Do

### Option 1: Contact ServiceM8 Support (Recommended)
1. **Log into ServiceM8**
2. **Go to Help/Support** or create a support ticket
3. **Request API Access** - Tell them:
   - "I need API access enabled for my account"
   - "I've created a Read Only API key but getting 'access_denied' errors"
   - "I need to access the Jobs API endpoint: /api/job.json"
4. **Wait for their response** - They may need to enable it on their end

### Option 2: Check Account Settings
1. Go to **Settings** → **Account** or **Billing**
2. Look for **API Access** or **Developer Features**
3. Check if there's a toggle or setting to enable API access
4. Some accounts have this disabled by default

### Option 3: Check Your ServiceM8 Plan
1. Go to **Settings** → **Billing** or **Subscription**
2. Check if your plan includes **API Access**
3. Some plans require upgrading to access APIs
4. Contact sales if you need to upgrade

### Option 4: Use MyCustomerPortal Addon
Since you have "MyCustomerPortal" enabled:
- This addon might provide a different way to access customer data
- Check if it has its own API or integration method
- This might be ServiceM8's preferred way for customer portals

## For Now: POC Still Works
The good news is your POC is already set up to work without ServiceM8:
- ✅ Login works
- ✅ Customer management works
- ✅ Messages work
- ✅ UI is functional
- ⚠️ Just shows "No bookings" when ServiceM8 isn't connected

## Next Steps
1. **Contact ServiceM8 Support** to enable API access
2. **While waiting**, the POC demonstrates all other features
3. **Once API access is enabled**, it will automatically work

## Testing After Support Enables Access
Once ServiceM8 enables API access:
1. Your existing API key should work
2. Restart your backend server
3. Refresh the bookings page
4. It should work immediately

