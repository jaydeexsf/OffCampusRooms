# 🗺️ Google Maps Debugging Guide

## 🚨 Current Issue: Google Maps Not Loading

Your Google Maps component is not loading because of a missing or invalid API key. Here's how to fix it step by step.

## 🔍 Quick Diagnosis

Open your browser's Developer Console (F12) and look for these messages:

### ✅ Good Messages (What you want to see):
```
🔍 Environment Configuration Debug: {GOOGLE_MAPS_API_KEY: 'SET', ...}
✅ Using VITE_GOOGLE_MAPS_API_KEY from environment
🔑 LocationGoogle - Google Maps API Key Status: {hasKey: true, keyLength: 39, ...}
```

### ❌ Bad Messages (What you're seeing now):
```
❌ No valid Google Maps API key found!
🔧 To fix this issue:
   1. Create a .env file in your FrontEnd directory
   2. Add: VITE_GOOGLE_MAPS_API_KEY=your_actual_api_key
```

## 🛠️ Step-by-Step Fix

### Step 1: Create Environment File

**IMPORTANT**: Since I can't create the .env file directly, you need to do this manually:

1. **Navigate to your FrontEnd directory** in File Explorer
2. **Create a new file** called `.env` (exactly this name, no extension)
3. **Add this content** to the file:

```env
VITE_GOOGLE_MAPS_API_KEY=YOUR_ACTUAL_GOOGLE_MAPS_API_KEY_HERE
VITE_API_BASE_URL=https://offcampusrooms.onrender.com
NODE_ENV=development
VITE_DEBUG=true
```

### Step 2: Get a Valid Google Maps API Key

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Create a new project** or select existing one
3. **Enable these APIs**:
   - Maps JavaScript API
   - Geocoding API
   - Directions API
4. **Create credentials**:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy the generated key
5. **Enable billing** (required for Google Maps API)

### Step 3: Update Your .env File

Replace `YOUR_ACTUAL_GOOGLE_MAPS_API_KEY_HERE` with your real API key:

```env
VITE_GOOGLE_MAPS_API_KEY=AIzaSyC...your_actual_key_here
```

### Step 4: Restart Development Server

1. **Stop your current dev server** (Ctrl+C in terminal)
2. **Start it again**: `npm run dev`
3. **Check the console** for success messages

## 🔧 Alternative: Update Config File

If you prefer not to use .env files, you can update `FrontEnd/src/config/env.js`:

```javascript
export const GOOGLE_MAPS_API_KEY = 'your_actual_api_key_here';
```

## 🧪 Testing Your Fix

1. **Open your app** in the browser
2. **Open Developer Console** (F12)
3. **Navigate to a page with the map** (like clicking "View Location" on a room)
4. **Look for these success messages**:

```
✅ Using VITE_GOOGLE_MAPS_API_KEY from environment
🔑 LocationGoogle - Google Maps API Key Status: {hasKey: true, keyLength: 39, keyPreview: 'AIzaSyC...'}
📍 LocationGoogle - Coordinates set: {lat: -29.4518, lng: 29.9718}
```

## 🚫 Common Issues & Solutions

### Issue 1: "InvalidKeyMapError"
- **Cause**: API key is invalid or billing not enabled
- **Solution**: Check your API key and enable billing in Google Cloud Console

### Issue 2: "ReferrerNotAllowedError"
- **Cause**: Your domain isn't allowed in API key restrictions
- **Solution**: Add your domain to HTTP referrers in Google Cloud Console

### Issue 3: "QuotaExceededError"
- **Cause**: You've exceeded your API quota
- **Solution**: Check billing account and monitor usage

### Issue 4: Still showing "API Key Required" message
- **Cause**: .env file not created or server not restarted
- **Solution**: Create .env file and restart dev server

## 📱 Mobile/Production Setup

### For Vercel:
1. Go to project settings
2. Add environment variable: `VITE_GOOGLE_MAPS_API_KEY`
3. Set value to your API key
4. Redeploy

### For Netlify:
1. Go to Site settings > Environment variables
2. Add: `VITE_GOOGLE_MAPS_API_KEY` = your API key
3. Redeploy

## 🔒 Security Notes

- ✅ **DO**: Use environment variables
- ✅ **DO**: Set up HTTP referrer restrictions
- ❌ **DON'T**: Commit API keys to git
- ❌ **DON'T**: Share API keys publicly

## 📞 Need Help?

If you're still having issues after following these steps:

1. **Check the console** for specific error messages
2. **Verify your API key** is working at: https://maps.googleapis.com/maps/api/js?key=YOUR_KEY&callback=initMap
3. **Check Google Cloud Console** for any error messages
4. **Ensure billing is enabled** for your project

## 🎯 Expected Result

After fixing the API key, you should see:
- A beautiful Google Map with your location marker
- No error messages in the console
- The map loads within 2-3 seconds
- You can interact with the map (zoom, pan, etc.)
