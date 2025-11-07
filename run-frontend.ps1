# Simple script to run the frontend after Node.js is set up
# Make sure Node.js is in your PATH or run setup-node-and-run.ps1 first

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Running Frontend Development Server" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is available in PATH
$nodeFound = $false
try {
    $nodeVersion = node --version
    $npmVersion = npm --version
    $nodeFound = $true
    Write-Host "Node.js version: $nodeVersion" -ForegroundColor Green
    Write-Host "npm version: $npmVersion" -ForegroundColor Green
} catch {
    # Try to find portable Node.js installation
    $portableNodePath = "$env:USERPROFILE\nodejs-portable"
    if (Test-Path "$portableNodePath\node.exe") {
        Write-Host "Found portable Node.js installation. Adding to PATH..." -ForegroundColor Yellow
        $env:PATH = "$portableNodePath;$env:PATH"
        try {
            $nodeVersion = node --version
            $npmVersion = npm --version
            $nodeFound = $true
            Write-Host "Node.js version: $nodeVersion" -ForegroundColor Green
            Write-Host "npm version: $npmVersion" -ForegroundColor Green
        } catch {
            $nodeFound = $false
        }
    }
    
    if (-not $nodeFound) {
        Write-Host "Error: Node.js not found!" -ForegroundColor Red
        Write-Host "Please run setup-node-and-run.ps1 first or install Node.js manually" -ForegroundColor Yellow
        exit 1
    }
}

# Navigate to frontend directory
$frontendDir = Join-Path $PSScriptRoot "FrontEnd"
if (-not (Test-Path $frontendDir)) {
    Write-Host "Error: FrontEnd directory not found at: $frontendDir" -ForegroundColor Red
    exit 1
}

Set-Location $frontendDir

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "Node modules not found. Installing..." -ForegroundColor Yellow
    npm install
}

# Run the frontend
Write-Host ""
Write-Host "Starting development server..." -ForegroundColor Yellow
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

npm run dev

