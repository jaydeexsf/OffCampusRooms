# Quick Start Guide - Running the Frontend

## Method 1: Using the Run Script (Recommended)

Simply run:
```powershell
.\run-frontend.ps1
```

This script will:
- Automatically detect and use the portable Node.js installation
- Navigate to the FrontEnd directory
- Install dependencies if needed
- Start the development server

## Method 2: Manual Commands

If you prefer to run commands manually:

```powershell
# Add Node.js to PATH for this session
$env:PATH = "$env:USERPROFILE\nodejs-portable;$env:PATH"

# Navigate to FrontEnd directory
cd FrontEnd

# Install dependencies (first time only)
npm install

# Start the development server
npm run dev
```

## What to Expect

After running the script, you should see:
- Node.js and npm version information
- Installation progress (if dependencies are being installed)
- Vite development server starting
- A local URL (usually `http://localhost:5173`)

## Stopping the Server

Press `Ctrl+C` in the terminal to stop the development server.

## Troubleshooting

- **"Node.js not found"**: Make sure you've run `setup-node-and-run.ps1` at least once
- **"Port already in use"**: Another instance might be running. Close it or use a different port
- **"npm install fails"**: Check your internet connection and try again

