# Build & Deployment Guide

This guide explains how to create executable versions of the Server Management Console.

## 🚀 Quick Run Options

### Option 1: Simple Launchers (No Build Required)

**Windows:**

```cmd
# Double-click or run in Command Prompt
runmyprogram.bat

# Or in PowerShell  
.\runmyprogram.ps1
```

**macOS/Linux:**

```bash
# Make executable and run
chmod +x runmyprogram.sh
./runmyprogram.sh
```

### Option 2: Direct Node.js

```bash
# Traditional method
node server.js

# Using the runner script
node run.js
```

## 🔨 Building Executables

### Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

### Install Build Dependencies

```bash
npm install
```

### Build All Platforms

```bash
# Build for all platforms (Windows, macOS, Linux)
npm run build

# Or build individually
npm run build:win     # Windows executable
npm run build:mac     # macOS executable  
npm run build:linux   # Linux executable
npm run build:current # Current platform only
```

### Custom Build Script

```bash
# Use the custom build script for more control
node build.js
```

## 📁 Output Files

After building, you'll find these files in the `dist/` folder:

```
dist/
├── server-console-win.exe    # Windows executable
├── server-console-mac        # macOS executable
└── server-console-linux      # Linux executable
```

## 🎯 Deployment Options

### Option 1: Standalone Executables

- **Pros**: No Node.js required on target machine
- **Cons**: Larger file size (~50-100MB)
- **Usage**: Just copy the executable and run it

### Option 2: Source Code + Launchers  

- **Pros**: Smaller size, easier to update
- **Cons**: Requires Node.js on target machine
- **Usage**: Copy entire project folder and use launcher scripts

### Option 3: NPM Global Install

```bash
# Install globally
npm install -g .

# Run from anywhere
server-console
```

## 🔧 Build Tools Comparison

### PKG (Recommended)

- **Pros**: Fast, reliable, good compression
- **Cons**: Larger executables
- **Usage**: `npm run build:current`

### Nexe

- **Pros**: Smaller executables
- **Cons**: Can be slower, less reliable with complex apps
- **Usage**: `npm run build:nexe`

## 🚀 Quick Start for End Users

### For Non-Technical Users (Windows)

1. Download the project folder
2. Double-click `runmyprogram.bat`
3. Wait for installation (first time only)
4. Open browser to `http://localhost:3000`

### For Developers

1. Clone the repository
2. Run `npm install`
3. Run `npm start` or use launcher scripts
4. For distribution: `npm run build`

## 🌍 Platform-Specific Notes

### Windows

- `.bat` files work in Command Prompt
- `.ps1` files work in PowerShell (may need execution policy change)
- `.exe` files are fully standalone

### macOS

- May need to allow app in Security & Privacy settings
- Use `chmod +x` to make shell scripts executable
- Gatekeeper may block unsigned executables

### Linux

- Make shell scripts executable with `chmod +x`
- May need to install Node.js through package manager
- Different distributions may have different requirements

## 🔍 Troubleshooting

### Build Issues

- Ensure all dependencies are installed: `npm install`
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version` (should be v14+)

### Runtime Issues

- Port 3000 already in use: Change PORT in environment variables
- Permission denied: Run as administrator/sudo (not recommended for production)
- Missing dependencies: Ensure all files are copied including `node_modules`

### Executable Issues

- File too large: Use source code deployment instead
- Won't run: Check if target machine has correct architecture (x64)
- Security warnings: Code signing may be required for distribution

## 📦 Distribution Recommendations

### For Internal Use

- Use launcher scripts (`runmyprogram.bat/.sh`)
- Include source code for easy updates
- Document Node.js requirement

### For External Distribution

- Use PKG-built executables
- Include README with usage instructions
- Consider code signing for production

### For Enterprise

- Create MSI/DEB/DMG installers
- Use proper versioning and update mechanisms
- Include comprehensive documentation

## 🔐 Security Considerations

- Executables are self-contained but not encrypted
- Source code is still accessible in PKG executables
- Consider obfuscation for sensitive applications
- Always scan executables before distribution

## 📊 File Size Comparison

| Method | Windows | macOS | Linux | Notes |
|--------|---------|--------|-------|-------|
| Source + Node.js | ~50MB | ~50MB | ~50MB | Requires Node.js |
| PKG Executable | ~80MB | ~85MB | ~75MB | Standalone |
| Nexe Executable | ~60MB | ~65MB | ~55MB | Standalone |

Choose the method that best fits your deployment needs!
