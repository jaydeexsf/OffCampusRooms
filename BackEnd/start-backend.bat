@echo off
REM Backend Startup Script for Windows Command Prompt
REM This script helps start the backend server

echo 🚀 Starting OffCampusRooms Backend Server...
echo.

REM Check if Node.js is installed
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/ (version 18 or higher)
    pause
    exit /b 1
)

REM Check if .env file exists
if not exist ".env" (
    echo ⚠️  .env file not found
    echo Creating .env file template...
    (
        echo MONGO_URI=your_mongodb_connection_string_here
        echo CLERK_SECRET_KEY=your_clerk_secret_key_here
        echo GOOGLE_API_KEY=your_google_maps_api_key_here
        echo PORT=5000
    ) > .env
    echo ⚠️  Please edit .env file with your actual values before running the server
    pause
    exit /b 1
)

REM Check if node_modules exists
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ Failed to install dependencies
        pause
        exit /b 1
    )
)

echo.
echo 🌟 Starting server...
echo.

REM Start the server
npm start

pause

