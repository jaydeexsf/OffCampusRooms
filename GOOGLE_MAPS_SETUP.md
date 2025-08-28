# Google Maps API Setup Guide

## Overview
The OffCampusRooms project uses Google Maps API for:
- Ride booking with distance calculation
- Location-based services
- Interactive maps for room locations

## Prerequisites
1. Google Cloud Console account
2. Billing enabled on your Google Cloud project
3. Google Maps JavaScript API and Distance Matrix API enabled

## Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable billing for the project

## Step 2: Enable Required APIs
Enable these APIs in your Google Cloud project:
1. **Google Maps JavaScript API** - For interactive maps
2. **Distance Matrix API** - For calculating ride distances and prices
3. **Geocoding API** - For converting coordinates to addresses

## Step 3: Create API Key
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy the generated API key
4. **Important**: Restrict the API key to only the required APIs

## Step 4: Configure Environment Variables

### Frontend (.env file in FrontEnd directory)
```bash
VITE_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

### Backend (.env file in BackEnd directory)
```bash
GOOGLE_API_KEY=your_actual_api_key_here
```

## Step 5: API Key Restrictions (Security)
1. Go to "APIs & Services" > "Credentials"
2. Click on your API key
3. Under "Application restrictions", select "HTTP referrers (websites)"
4. Add your domain(s):
   - `http://localhost:3000/*` (for development)
   - `http://localhost:5173/*` (for Vite dev server)
   - `https://off-campus-rooms.vercel.app/*` (for production)
5. Under "API restrictions", select "Restrict key"
6. Select only these APIs:
   - Google Maps JavaScript API
   - Distance Matrix API
   - Geocoding API

## Step 6: Billing and Quotas
1. Monitor your API usage in Google Cloud Console
2. Set up billing alerts
3. Default quotas are usually sufficient for development
4. For production, consider increasing quotas if needed

## Troubleshooting

### Common Errors

#### 1. "InvalidKeyMapError"
- **Cause**: API key is missing, invalid, or restricted
- **Solution**: Check environment variables and API key restrictions

#### 2. "Quota Exceeded"
- **Cause**: API usage limit reached
- **Solution**: Check billing status and increase quotas if needed

#### 3. "RefererNotAllowedMapError"
- **Cause**: Domain not in API key restrictions
- **Solution**: Add your domain to HTTP referrer restrictions

### Testing
1. Check if environment variables are loaded:
   ```javascript
   console.log('Frontend API Key:', import.meta.env.VITE_GOOGLE_MAPS_API_KEY);
   console.log('Backend API Key:', process.env.GOOGLE_API_KEY);
   ```

2. Test API endpoints:
   - Frontend: Check browser console for Google Maps loading
   - Backend: Test distance calculation endpoint

## Cost Considerations
- **Google Maps JavaScript API**: $7 per 1000 map loads
- **Distance Matrix API**: $5 per 1000 elements
- **Geocoding API**: $5 per 1000 requests

## Security Best Practices
1. Never commit API keys to version control
2. Use environment variables
3. Restrict API keys to specific domains and APIs
4. Monitor API usage regularly
5. Set up billing alerts

## Support
If you encounter issues:
1. Check Google Cloud Console for error details
2. Verify API key restrictions
3. Check billing status
4. Review API quotas and usage
