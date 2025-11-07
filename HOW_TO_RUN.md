# How to Run the Frontend - Step by Step Guide

## What is a PowerShell Script (.ps1 file)?

A `.ps1` file is a PowerShell script - it's like a batch file that contains commands to run automatically. Instead of typing commands one by one, the script does it for you.

## The File You Need to Run

**File name:** `run-frontend.ps1`  
**Location:** `C:\Users\202219525\Desktop\OffCampusRooms\run-frontend.ps1`

## How to Run It (3 Simple Steps)

### Step 1: Open PowerShell
- Press `Windows Key + X`
- Click on "Windows PowerShell" or "Terminal"
- OR right-click on the project folder and select "Open in Terminal"

### Step 2: Navigate to Your Project Folder
If you're not already there, type:
```powershell
cd C:\Users\202219525\Desktop\OffCampusRooms
```

### Step 3: Run the Script
Type this command and press Enter:
```powershell
.\run-frontend.ps1
```

**Note:** The `.\` at the beginning means "run the script in the current folder"

## What the Script Does

The `run-frontend.ps1` script automatically:
1. ✅ Checks if Node.js is installed
2. ✅ Finds the portable Node.js installation if needed
3. ✅ Navigates to the FrontEnd folder
4. ✅ Installs dependencies (if needed)
5. ✅ Starts the development server

## Alternative: Manual Commands (If Script Doesn't Work)

If you prefer to run commands manually, type these one by one:

```powershell
# Add Node.js to PATH
$env:PATH = "$env:USERPROFILE\nodejs-portable;$env:PATH"

# Go to FrontEnd folder
cd FrontEnd

# Install dependencies (first time only)
npm install

# Start the server
npm run dev
```

## What You'll See

After running the script, you should see:
```
========================================
Running Frontend Development Server
========================================

Node.js version: v20.11.0
npm version: 10.2.4

Starting development server...
Press Ctrl+C to stop the server

VITE v4.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

Then open your browser and go to: **http://localhost:5173/**

## To Stop the Server

Press `Ctrl + C` in the PowerShell window.

