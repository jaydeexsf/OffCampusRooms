# Google Maps API Setup Guide

## 🚨 Current Issue: Invalid API Key

Your Google Maps API key is being detected but is invalid. Here's how to fix it:

## Step 1: Get a Valid Google Maps API Key

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Create a new project** or select an existing one
3. **Enable the required APIs**:
   - Maps JavaScript API
   - Geocoding API
   - Directions API
   - Places API (if needed)
4. **Create credentials**:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy the generated API key

## Step 2: Configure API Key Restrictions

1. **Set up HTTP referrers** (recommended for security):
   - Click on your API key
   - Under "Application restrictions" select "HTTP referrers"
   - Add your domains:
     ```
     localhost:*
     *.vercel.app
     *.netlify.app
     yourdomain.com/*
     ```

2. **Enable billing** (required for Google Maps API):
   - Go to "Billing" in Google Cloud Console
   - Link a billing account to your project
   - Google Maps API requires billing to be enabled

## Step 3: Update Your Environment Variables

### Option A: Using .env file (Recommended)

Create a `.env` file in your `FrontEnd` directory:

```env
VITE_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
VITE_API_BASE_URL=https://offcampusrooms.onrender.com
```

### Option B: Update env.js file

Update `FrontEnd/src/config/env.js`:

```javascript
export const GOOGLE_MAPS_API_KEY = 'your_actual_api_key_here';
```

## Step 4: Verify Setup

1. **Restart your development server**
2. **Check the console** for these messages:
   ```
   ✅ Using VITE_GOOGLE_MAPS_API_KEY from environment
   🔑 RideBooking - Google Maps API Key Status: {hasKey: true, keyLength: 39, keyPreview: 'AIzaSy...'}
   ```

## Step 5: Deploy to Production

### For Vercel:
1. Go to your Vercel project settings
2. Add environment variable:
   - Name: `VITE_GOOGLE_MAPS_API_KEY`
   - Value: Your actual API key
3. Redeploy

### For Netlify:
1. Go to Site settings > Environment variables
2. Add:
   - Key: `VITE_GOOGLE_MAPS_API_KEY`
   - Value: Your actual API key
3. Redeploy

## Troubleshooting

### Common Issues:

1. **"InvalidKeyMapError"**:
   - Check if billing is enabled
   - Verify API key is correct
   - Ensure required APIs are enabled

2. **"ReferrerNotAllowedError"**:
   - Add your domain to HTTP referrers
   - Include both `www` and non-`www` versions

3. **"QuotaExceededError"**:
   - Check your billing account
   - Monitor usage in Google Cloud Console

### Testing Your API Key:

You can test your API key by visiting:
```
https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap
```

If it loads without errors, your key is working.

## Security Notes

- Never commit your API key to version control
- Use environment variables for production
- Set up proper HTTP referrer restrictions
- Monitor your API usage regularly

## Cost Information

Google Maps API has a generous free tier:
- $200 monthly credit
- Typically covers thousands of map loads
- Monitor usage in Google Cloud Console
