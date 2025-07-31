# Running the Server Management Console

This document explains all the different ways you can run the Server Management Console application.

## 🚀 Quick Start Options

### Option 1: Simple Launchers (Easiest)

**Just double-click and run!**

| Platform | File | Action |
|----------|------|--------|
| Windows | `runmyprogram.bat` | Double-click or run in Command Prompt |
| Windows (PowerShell) | `runmyprogram.ps1` | Right-click → "Run with PowerShell" |
| macOS/Linux | `runmyprogram.sh` | Make executable with `chmod +x` then run |

**What these do:**

- ✅ Check if Node.js is installed
- ✅ Install dependencies automatically if missing
- ✅ Start the server
- ✅ Show clear instructions and status

### Option 2: Traditional Node.js

```bash
# Install dependencies (first time only)
npm install

# Start the server
npm start
# or
node server.js
```

### Option 3: Using the Runner Script

```bash
# Use the custom runner
node run.js
```

## 🔨 Building Executables

### Quick Build

```bash
# Build for your current platform
npm run build:current

# This creates a standalone .exe file that doesn't need Node.js
```

### Full Build (All Platforms)

```bash
# Build for Windows, macOS, and Linux
npm run build

# Or use individual commands:
npm run build:win     # Windows .exe
npm run build:mac     # macOS binary
npm run build:linux   # Linux binary
```

### Custom Build Script

```bash
# Use the custom build script for more control
node build.js
```

**Output Files:**

```
dist/
├── server-console-win.exe    # Windows executable (~80MB)
├── server-console-mac        # macOS executable (~85MB)
└── server-console-linux      # Linux executable (~75MB)
```

## 📁 File Overview

| File | Purpose | Best For |
|------|---------|----------|
| `runmyprogram.bat` | Windows batch launcher | Windows users, beginners |
| `runmyprogram.ps1` | PowerShell launcher | Windows PowerShell users |
| `runmyprogram.sh` | Unix shell launcher | macOS/Linux users |
| `run.js` | Node.js launcher script | Developers |
| `server.js` | Main application | Direct execution |
| `build.js` | Custom build script | Creating executables |

## 🎯 Which Method Should You Use?

### For End Users (Non-Technical)

1. **Use the launcher scripts** (`runmyprogram.bat`, etc.)
2. They handle everything automatically
3. No need to know Node.js commands

### For Developers

1. **Use npm commands** (`npm start`, `npm run dev`)
2. More control over the process
3. Better for development and debugging

### For Distribution

1. **Build executables** with `npm run build`
2. No Node.js required on target machines
3. Single file distribution

## 📋 Prerequisites

### For Launcher Scripts & npm Commands

- **Node.js** (v14 or higher) - Download from [nodejs.org](https://nodejs.org/)
- **npm** (comes with Node.js)

### For Executables

- **No prerequisites** - they're standalone
- Just run the .exe file on Windows or binary on macOS/Linux

## 🔧 Troubleshooting

### "Node.js not found"

- Install Node.js from [nodejs.org](https://nodejs.org/)
- Restart your terminal/command prompt after installation

### "npm command not found"

- npm comes with Node.js - reinstall Node.js if missing
- Make sure Node.js is in your system PATH

### "Dependencies failed to install"

- Run `npm install` manually
- Check internet connection
- Try `npm install --force` if needed

### "Port 3000 already in use"

- Stop other applications using port 3000
- Or set a different port: `PORT=3001 npm start`

### Executable won't run

- Check if you have the right architecture (x64)
- On macOS: May need to allow in Security & Privacy settings
- On Linux: Make sure file has execute permissions

## 💡 Tips

### Development

- Use `npm run dev` for auto-restart during development
- Use `Ctrl+C` to stop the server gracefully

### Production

- Build executables for distribution
- Use launcher scripts for internal deployment
- Consider setting up as a system service for always-on usage

### Performance

- Executables are larger but faster to start
- Source code is smaller but requires Node.js
- Choose based on your deployment needs

## 🌐 After Starting

Once the server is running (any method), you can:

1. **Open your browser** to `http://localhost:3000`
2. **Use the web terminal** interface
3. **Execute commands** on your system
4. **Manage multiple terminal tabs**
5. **Customize themes and settings**

The application provides a full web-based terminal interface with platform-specific features for Windows, macOS, and Linux!
