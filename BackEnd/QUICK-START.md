# Quick Start Guide - Running the Backend

## 🚀 Option 1: Use Batch File (Easiest - No Execution Policy Issues)

Simply double-click or run:
```cmd
start-backend.bat
```

Or in PowerShell:
```powershell
.\start-backend.bat
```

## 🚀 Option 2: Bypass PowerShell Execution Policy

Run this command in PowerShell:
```powershell
powershell -ExecutionPolicy Bypass -File .\start-backend.ps1
```

Or:
```powershell
.\run-backend.ps1
```

## 🚀 Option 3: Run Commands Manually

1. **Install dependencies** (if not already installed):
   ```powershell
   npm install
   ```

2. **Check/create .env file**:
   Create a `.env` file with:
   ```
   MONGO_URI=your_mongodb_connection_string_here
   CLERK_SECRET_KEY=your_clerk_secret_key_here
   GOOGLE_API_KEY=your_google_maps_api_key_here
   PORT=5000
   ```

3. **Start the server**:
   ```powershell
   npm start
   ```

   Or for development with auto-reload:
   ```powershell
   npm run dev
   ```

## 🔧 Fix PowerShell Execution Policy (Optional)

If you want to enable scripts permanently (requires admin):

1. **Open PowerShell as Administrator**
2. **Run one of these commands**:

   For Current User only (recommended):
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

   For all users (requires admin):
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope LocalMachine
   ```

## ✅ What You Need

Before running, make sure you have:

1. ✅ **Node.js installed** (version 18 or higher)
   - Check: `node --version`
   - Download: https://nodejs.org/

2. ✅ **.env file** with:
   - `MONGO_URI` - MongoDB connection string
   - `CLERK_SECRET_KEY` - Clerk authentication key
   - `GOOGLE_API_KEY` - (optional) Google Maps API key
   - `PORT` - (optional) Server port (default: 5000)

3. ✅ **Dependencies installed**
   - Run `npm install` if `node_modules` doesn't exist

## 🎯 Server Will Run On

- **Default**: `http://localhost:5000`
- **Or**: The port specified in your `.env` file

## 📝 Troubleshooting

### Execution Policy Error
- Use Option 1 (batch file) or Option 2 (bypass)
- Or fix execution policy (see above)

### Node.js Not Found
- Install Node.js from https://nodejs.org/
- Restart your terminal after installation

### Missing .env File
- The scripts will create a template for you
- Fill in your actual values before running

### MongoDB Connection Error
- Check your `MONGO_URI` in `.env`
- Ensure MongoDB is accessible (local or cloud)

