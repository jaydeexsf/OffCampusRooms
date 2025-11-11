# Backend Startup Script for Windows PowerShell
# This script helps start the backend server

Write-Host "🚀 Starting OffCampusRooms Backend Server..." -ForegroundColor Green
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/ (version 18 or higher)" -ForegroundColor Yellow
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = npm --version
    Write-Host "✅ npm found: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm is not installed or not in PATH" -ForegroundColor Red
    exit 1
}

# Check if .env file exists
if (Test-Path ".env") {
    Write-Host "✅ .env file found" -ForegroundColor Green
} else {
    Write-Host "⚠️  .env file not found" -ForegroundColor Yellow
    Write-Host "Creating .env file template..." -ForegroundColor Yellow
    @"
MONGO_URI=your_mongodb_connection_string_here
CLERK_SECRET_KEY=your_clerk_secret_key_here
GOOGLE_API_KEY=your_google_maps_api_key_here
PORT=5000
"@ | Out-File -FilePath ".env" -Encoding UTF8
    Write-Host "⚠️  Please edit .env file with your actual values before running the server" -ForegroundColor Red
    Write-Host "Required variables:" -ForegroundColor Yellow
    Write-Host "  - MONGO_URI: MongoDB connection string" -ForegroundColor Yellow
    Write-Host "  - CLERK_SECRET_KEY: Clerk authentication secret key" -ForegroundColor Yellow
    Write-Host "  - GOOGLE_API_KEY: Google Maps API key (optional but recommended)" -ForegroundColor Yellow
    exit 1
}

# Check if node_modules exists
if (Test-Path "node_modules") {
    Write-Host "✅ Dependencies installed" -ForegroundColor Green
} else {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Dependencies installed successfully" -ForegroundColor Green
}

Write-Host ""
Write-Host "🌟 Starting server..." -ForegroundColor Green
Write-Host ""

# Start the server
npm start

