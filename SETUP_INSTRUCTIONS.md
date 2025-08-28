# 🚀 OffCampusRooms Setup Instructions

## 🔧 Current Issues Fixed

✅ **FiNavigation icon error** - Replaced with FiMap  
✅ **API configuration** - Fixed undefined API base URL  
✅ **Google Maps integration** - Added proper error handling  

## 📋 What You Need to Do

### 1. **Set Google Maps API Key**

**Option A: Create .env file (Recommended)**
1. In your `FrontEnd/` directory, create a file called `.env`
2. Add this line:
   ```bash
   VITE_GOOGLE_MAPS_API_KEY=your_actual_google_maps_api_key_here
   ```

**Option B: Edit the config file directly**
1. Open `FrontEnd/src/config/env.js`
2. Replace `'YOUR_GOOGLE_MAPS_API_KEY_HERE'` with your actual API key

### 2. **Get Google Maps API Key**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable these APIs:
   - Google Maps JavaScript API
   - Distance Matrix API
   - Geocoding API
4. Create an API key in "Credentials"
5. Restrict the key to your domains:
   - `http://localhost:3000/*`
   - `http://localhost:5173/*`
   - `https://off-campus-rooms.vercel.app/*`

### 3. **Set Backend API Key**

1. In your `BackEnd/` directory, create a file called `.env`
2. Add this line:
   ```bash
   GOOGLE_API_KEY=your_actual_google_maps_api_key_here
   ```

## 🚨 **IMPORTANT: Replace Placeholder Values**

**In `FrontEnd/src/config/env.js`:**
```javascript
// Change this line:
export const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY_HERE';

// To your actual key:
export const GOOGLE_MAPS_API_KEY = 'AIzaSyC...'; // Your actual key here
```

## 🔍 **Testing the Fix**

1. **Check browser console** - You should see:
   ```
   API Configuration: {
     API_BASE_URL: "https://offcampusrooms.onrender.com",
     VITE_API_BASE_URL: "your_key_here",
     hostname: "off-campus-rooms.vercel.app"
   }
   ```

2. **Test FAQ creation** - Should work without 405 errors
3. **Test driver creation** - Should work without 405 errors
4. **Test Google Maps** - Should load without InvalidKeyMapError

## 🐛 **If You Still Get Errors**

### **405 Method Not Allowed**
- Check that your backend is running
- Verify the API base URL is correct
- Check that the backend routes are properly configured

### **Google Maps InvalidKeyMapError**
- Verify your API key is correct
- Check that the APIs are enabled in Google Cloud Console
- Verify domain restrictions are set correctly

### **FiNavigation Error**
- This should be fixed now
- If you still see it, clear your browser cache and reload

## 📁 **File Structure After Fix**

```
FrontEnd/
├── .env                          ← Create this with VITE_GOOGLE_MAPS_API_KEY
├── src/
│   ├── config/
│   │   ├── api.js               ← Fixed API configuration
│   │   └── env.js               ← New environment config
│   └── pages/
│       └── StudentDashboard.jsx ← Fixed icon imports

BackEnd/
├── .env                         ← Create this with GOOGLE_API_KEY
└── server.js                    ← Already fixed
```

## 🎯 **Quick Test Commands**

1. **Frontend**: Check if API config loads correctly
2. **Backend**: Test if Google Maps API key is loaded
3. **Maps**: Try to load a page with Google Maps
4. **Admin**: Try to create a FAQ or driver

## 📞 **Need Help?**

1. Check the browser console for error messages
2. Verify all environment variables are set
3. Check that your Google Cloud project has billing enabled
4. Ensure the APIs are enabled and the key is restricted properly

## 🚀 **After Setup**

Once everything is working:
- ✅ FAQ creation will work
- ✅ Driver management will work  
- ✅ Google Maps will load properly
- ✅ Student dashboard will work without errors
- ✅ All API calls will use the correct base URL

**Remember**: Never commit your actual API keys to version control!
