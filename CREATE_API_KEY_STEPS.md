# Steps to Create ServiceM8 API Key

## What You're Seeing
ServiceM8's API key creation only has two options:
- **Read Only** ✅ (This is correct - you need this for reading jobs)
- **Full Access** (Not needed for this POC)

## Steps to Create the Key

### 1. Enter API Key Name
- In the "API Key Name" field, type: `Customer Portal POC` (or any name you prefer)
- This is just a label to help you identify it later

### 2. Keep "Read Only" Selected
- ✅ "Read Only" is already selected (the filled radio button)
- This is correct - it will allow reading jobs from ServiceM8
- **Do NOT** select "Full Access" (you don't need write permissions)

### 3. Click "Create" Button
- Click the green "Create" button
- ServiceM8 will generate the API key

### 4. ⚠️ IMPORTANT: Copy the API Key Immediately
- After clicking "Create", ServiceM8 will show you the API key
- **This is the ONLY time you'll see it!**
- It will look like: `smk-xxxxx-xxxxx-xxxxx`
- Copy the ENTIRE key immediately
- Save it somewhere safe (like a text file)

### 5. Update Your Backend .env File
1. Open `backend/.env` in your code editor
2. Find the line: `SERVICEM8_API_KEY=...`
3. Replace it with:
   ```
   SERVICEM8_API_KEY=smk-your-new-key-here
   ```
   (Replace `smk-your-new-key-here` with the actual key you copied)
4. Save the file

### 6. Restart Your Backend Server
1. Go to your backend terminal
2. Stop the server (press `Ctrl+C`)
3. Restart it:
   ```bash
   cd backend
   npm run dev
   ```

### 7. Test It
1. Refresh your browser on the bookings page
2. Check the backend terminal - you should see successful API calls
3. If it works, you'll see bookings or "No bookings found"

## Why "Read Only" is Correct
- "Read Only" gives access to read data (like jobs)
- "Full Access" would allow creating/editing/deleting (not needed for this POC)
- For reading jobs, "Read Only" is the right choice

## If You Already Have a Key
If you already have the "Customer Portal POC" key:
1. You can use that one (if you have the key value)
2. Or delete it and create a new one
3. Make sure you have the actual key value (the `smk-...` string) to put in `.env`

## Troubleshooting
- **Can't see the key after creating?** You might need to click "Show" or "Reveal"
- **Key doesn't work?** Make sure you copied the ENTIRE key (no spaces, full length)
- **Still getting errors?** Restart the backend server after updating `.env`

