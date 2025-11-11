# 🚀 How to Start the Backend Server

## Step 1: Check if Node.js is Installed

Open PowerShell and run:
```powershell
node --version
npm --version
```

If you see version numbers, Node.js is installed! ✅
If you get an error, Node.js is NOT installed. ❌

## Step 2: Install Node.js (If Needed)

1. **Download Node.js**: Go to https://nodejs.org/
2. **Download LTS version** (recommended, version 18 or higher)
3. **Run the installer** and follow the setup wizard
4. **IMPORTANT**: Restart your PowerShell/terminal after installation

## Step 3: Verify Installation

After restarting your terminal, run again:
```powershell
node --version
npm --version
```

You should see version numbers now! ✅

## Step 4: Set Up Environment Variables

1. **Navigate to BackEnd folder**:
   ```powershell
   cd C:\Users\202219525\Desktop\OffCampusRooms\BackEnd
   ```

2. **Create .env file** (if it doesn't exist):
   Create a file named `.env` in the `BackEnd` folder with this content:
   ```
   MONGO_URI=your_mongodb_connection_string_here
   CLERK_SECRET_KEY=your_clerk_secret_key_here
   GOOGLE_API_KEY=your_google_maps_api_key_here
   PORT=5000
   ```

3. **Replace the placeholder values** with your actual:
   - MongoDB connection string
   - Clerk secret key
   - Google Maps API key (optional)

## Step 5: Install Dependencies

Run this command in the BackEnd folder:
```powershell
npm install
```

This will install all required packages. Wait for it to complete.

## Step 6: Start the Server

Run this command:
```powershell
npm start
```

Or for development with auto-reload:
```powershell
npm run dev
```

## ✅ Success!

You should see:
```
Server running on port 5000
Connected to MongoDB
```

The backend is now running! 🎉

## 🔧 Quick Commands Reference

```powershell
# Navigate to BackEnd folder
cd C:\Users\202219525\Desktop\OffCampusRooms\BackEnd

# Install dependencies (first time only)
npm install

# Start server
npm start

# Start server with auto-reload (development)
npm run dev
```

## 🐛 Troubleshooting

### "Node.js is not recognized"
- Install Node.js from https://nodejs.org/
- **Restart your terminal** after installation
- Verify with `node --version`

### "Cannot find module" errors
- Run `npm install` in the BackEnd folder
- Make sure you're in the correct directory

### MongoDB connection error
- Check your `MONGO_URI` in the `.env` file
- Ensure MongoDB is running (if local) or accessible (if cloud)

### Port already in use
- Change `PORT` in `.env` to a different number (e.g., 5001)
- Or stop the process using port 5000

## 📞 Need Help?

1. Make sure Node.js is installed: `node --version`
2. Make sure you're in the BackEnd folder
3. Make sure `.env` file exists with correct values
4. Make sure dependencies are installed: `npm install`
5. Check the error messages in the terminal

