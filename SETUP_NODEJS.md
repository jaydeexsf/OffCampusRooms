# Node.js Setup Instructions (No Admin Rights Required)

## Quick Start (Automated)

Run the PowerShell script:
```powershell
.\setup-node-and-run.ps1
```

This script will:
1. Download Node.js portable version
2. Extract it to your user directory
3. Install frontend dependencies
4. Start the development server

## Manual Setup (If Automated Fails)

### Step 1: Download Node.js Portable

1. Visit: https://nodejs.org/en/download
2. Download **Windows Binary (.zip)** for x64 (64-bit) or x86 (32-bit)
3. Extract the ZIP file to: `C:\Users\YourUsername\nodejs-portable`

### Step 2: Add Node.js to PATH (Current Session Only)

Open PowerShell in your project directory and run:
```powershell
$env:PATH = "C:\Users\YourUsername\nodejs-portable;$env:PATH"
```

### Step 3: Verify Installation

```powershell
node --version
npm --version
```

### Step 4: Install Dependencies

```powershell
cd FrontEnd
npm install
```

### Step 5: Run the Frontend

```powershell
npm run dev
```

## Running the Project After Setup

Once Node.js is set up, you can use the simple run script:
```powershell
.\run-frontend.ps1
```

Or manually:
```powershell
cd FrontEnd
npm run dev
```

## Permanent PATH Setup (Optional)

If you want Node.js available in all PowerShell sessions:

1. Press `Win + R`
2. Type: `rundll32 sysdm.cpl,EditEnvironmentVariables`
3. In "User variables", select `Path` and click "Edit"
4. Click "New" and add: `C:\Users\YourUsername\nodejs-portable`
5. Click "OK" to save

## Troubleshooting

- **"Node.js not found"**: Make sure you've added Node.js to PATH or run the setup script
- **"npm install fails"**: Check your internet connection and try again
- **"Permission denied"**: Make sure you're running PowerShell in a directory you have write access to

