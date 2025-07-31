@echo off
REM Server Management Console - Windows Launcher
REM This batch file starts the server without needing to type 'node server.js'

echo.
echo 🚀 ===============================================
echo 🚀 Server Management Console - Windows Launcher
echo 🚀 ===============================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed or not in PATH
    echo 💡 Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if server.js exists
if not exist "server.js" (
    echo ❌ server.js not found in current directory
    echo 💡 Please run this from the project root directory
    pause
    exit /b 1
)

REM Check if node_modules exists
if not exist "node_modules" (
    echo 📦 Dependencies not found, installing...
    npm install
    if errorlevel 1 (
        echo ❌ Failed to install dependencies
        pause
        exit /b 1
    )
)

echo 🌟 Starting Server Management Console...
echo 🌐 Open http://localhost:3000 in your browser
echo 🛑 Press Ctrl+C to stop the server
echo.

REM Start the server
node server.js

echo.
echo 👋 Server Management Console stopped
pause
