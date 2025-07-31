#!/bin/bash

# Server Management Console - Unix/Linux/macOS Launcher
# This script starts the server without needing to type 'node server.js'

echo ""
echo "🚀 ==============================================="
echo "🚀 Server Management Console - Unix Launcher"
echo "🚀 ==============================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed or not in PATH"
    echo "💡 Please install Node.js from https://nodejs.org/"
    echo "   Or use your package manager:"
    echo "   - macOS: brew install node"
    echo "   - Ubuntu/Debian: sudo apt install nodejs npm"
    echo "   - CentOS/RHEL: sudo yum install nodejs npm"
    read -p "Press Enter to exit..."
    exit 1
fi

NODE_VERSION=$(node --version)
echo "✅ Node.js version: $NODE_VERSION"

# Check if server.js exists
if [ ! -f "server.js" ]; then
    echo "❌ server.js not found in current directory"
    echo "💡 Please run this from the project root directory"
    read -p "Press Enter to exit..."
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Dependencies not found, installing..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        read -p "Press Enter to exit..."
        exit 1
    fi
fi

echo "🌟 Starting Server Management Console..."
echo "🌐 Open http://localhost:3000 in your browser"
echo "🛑 Press Ctrl+C to stop the server"
echo ""

# Start the server
node server.js

echo ""
echo "👋 Server Management Console stopped"
read -p "Press Enter to exit..."
