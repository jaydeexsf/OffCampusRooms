# PowerShell script to install Node.js portable and run the frontend
# This script works without admin rights

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Node.js Portable Setup & Project Runner" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Configuration
$nodeVersion = "20.11.0"  # LTS version
$nodeArch = "x64"
$nodeDir = "$env:USERPROFILE\nodejs-portable"
$nodeExe = "$nodeDir\node.exe"
$npmPath = "$nodeDir\node_modules\npm"

# Check if Node.js is already installed
if (Test-Path $nodeExe) {
    Write-Host "Node.js portable found at: $nodeDir" -ForegroundColor Green
    $env:PATH = "$nodeDir;$env:PATH"
} else {
    Write-Host "Downloading Node.js portable..." -ForegroundColor Yellow
    
    # Create directory if it doesn't exist
    if (-not (Test-Path $nodeDir)) {
        New-Item -ItemType Directory -Path $nodeDir -Force | Out-Null
    }
    
    # Download Node.js
    $zipFile = "$env:TEMP\node-v$nodeVersion-win-$nodeArch.zip"
    $downloadUrl = "https://nodejs.org/dist/v$nodeVersion/node-v$nodeVersion-win-$nodeArch.zip"
    
    Write-Host "Downloading from: $downloadUrl" -ForegroundColor Yellow
    try {
        Invoke-WebRequest -Uri $downloadUrl -OutFile $zipFile -UseBasicParsing
        Write-Host "Download complete!" -ForegroundColor Green
    } catch {
        Write-Host "Error downloading Node.js: $_" -ForegroundColor Red
        Write-Host "Please download manually from: https://nodejs.org/dist/v$nodeVersion/node-v$nodeVersion-win-$nodeArch.zip" -ForegroundColor Yellow
        exit 1
    }
    
    # Extract Node.js
    Write-Host "Extracting Node.js..." -ForegroundColor Yellow
    try {
        Expand-Archive -Path $zipFile -DestinationPath $env:TEMP -Force
        $extractedDir = "$env:TEMP\node-v$nodeVersion-win-$nodeArch"
        
        # Move contents to nodeDir
        Copy-Item -Path "$extractedDir\*" -Destination $nodeDir -Recurse -Force
        
        # Cleanup
        Remove-Item -Path $extractedDir -Recurse -Force
        Remove-Item -Path $zipFile -Force
        
        Write-Host "Extraction complete!" -ForegroundColor Green
    } catch {
        Write-Host "Error extracting Node.js: $_" -ForegroundColor Red
        exit 1
    }
    
    # Add to PATH for current session
    $env:PATH = "$nodeDir;$env:PATH"
}

# Verify Node.js installation
Write-Host ""
Write-Host "Verifying Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = & $nodeExe --version
    $npmVersion = & "$nodeDir\npm.cmd" --version
    Write-Host "Node.js version: $nodeVersion" -ForegroundColor Green
    Write-Host "npm version: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "Error verifying Node.js: $_" -ForegroundColor Red
    exit 1
}

# Navigate to frontend directory
$frontendDir = Join-Path $PSScriptRoot "FrontEnd"
if (-not (Test-Path $frontendDir)) {
    Write-Host "Error: FrontEnd directory not found at: $frontendDir" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Navigating to FrontEnd directory..." -ForegroundColor Yellow
Set-Location $frontendDir

# Install node modules
Write-Host ""
Write-Host "Installing node modules..." -ForegroundColor Yellow
Write-Host "This may take a few minutes..." -ForegroundColor Yellow
try {
    & "$nodeDir\npm.cmd" install
    Write-Host "Node modules installed successfully!" -ForegroundColor Green
} catch {
    Write-Host "Error installing node modules: $_" -ForegroundColor Red
    exit 1
}

# Run the frontend
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting Frontend Development Server..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "The server will start shortly..." -ForegroundColor Yellow
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

& "$nodeDir\npm.cmd" run dev

