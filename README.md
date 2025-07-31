# Server Management Console

A comprehensive,### Usage

**🚀 Easy Launchers (Recommended for beginners):**

```cmd
# Windows - Just double-click or run:
runmyprogram.bat

# Or in PowerShell:
.\runmyprogram.ps1

# macOS/Linux:
chmod +x runmyprogram.sh
./runmyprogram.sh
```

**⚡ Traditional Method:**

1. Start the server:

```bash
npm start
```

1. Open your web browser and navigate to:

```
http://localhost:3000
```

**🔨 Build Executable (Advanced):**

```bash
# Build for current platform
npm run build:current

# Build for all platforms  
npm run build

# Run the executable (after building)
./dist/server-management-console.exe  # Windows
./dist/server-management-console      # macOS/Linux
```ependent** web-based terminal interface that provides browser-based access to system command prompts with advanced features, multi-tab support, and extensive customization options.

## 🌍 Platform Independence

**✅ Cross-Platform Support:**

- **🪟 Windows** - PowerShell integration
- **🍎 macOS** - Zsh/Bash support  
- **� Linux** - Bash/Shell support
- **🔄 Auto-Detection** - Automatically detects and adapts to your operating system

## �🚀 Features

- 🖥️ **Multi-Tab Terminals**: Independent terminal sessions with process isolation
- 🌍 **Platform Independent**: Works on Windows, macOS, and Linux
- 🎨 **Theme System**: Dark, Light, Matrix, and Retro themes
- 📱 **Responsive Design**: Desktop, Mobile, and Fullscreen view modes
- 🎤 **Voice Input**: Speech-to-text command entry (Chrome/Edge)
- 📝 **Smart Auto-complete**: Platform-specific command suggestions
- 💾 **Session Management**: Save/load terminal sessions and export logs
- ⚙️ **Customizable Settings**: Font size (10-24px), auto-scroll, sound effects
- � **Audio Feedback**: Sound effects for user interactions
- 📊 **System Monitoring**: Platform-aware system info and performance commands
- 🔒 **Secure**: Input validation, output sanitization, and graceful error handling

## 📋 Quick Start

### Prerequisites

- **Node.js** (v14 or higher)
- **Platform-specific shell:**
  - Windows: PowerShell (pre-installed)
  - macOS: Zsh or Bash (pre-installed)
  - Linux: Bash (pre-installed)

### Installation

1. Ensure you have Node.js installed on your system
1. Navigate to the project directory
1. Install dependencies:

```bash
npm install
```

### Usage

1. Start the server:

```bash
npm start
```

1. Open your web browser and navigate to:

```text
http://localhost:3000
```

1. Start executing commands through the web interface!

### Development

For development with auto-restart:

```bash
npm run dev
```

## � Deployment & Distribution

### 🚀 Quick Run (No Installation)

**For end users who just want to run the application:**

- **Windows**: Double-click `runmyprogram.bat`
- **PowerShell**: Run `.\runmyprogram.ps1`  
- **macOS/Linux**: Run `./runmyprogram.sh`

These launchers automatically:

- ✅ Check if Node.js is installed
- ✅ Install dependencies if missing
- ✅ Start the server
- ✅ Show helpful status messages

### 🔨 Building Executables

**Create standalone executables that don't require Node.js:**

```bash
# Install build tools (one time)
npm install

# Build for your current platform
npm run build:current

# Build for all platforms (Windows, macOS, Linux)
npm run build

# Custom build with more control
node build.js
```

**Output files in `dist/` folder:**

- `server-console-win.exe` - Windows executable
- `server-console-mac` - macOS executable  
- `server-console-linux` - Linux executable

### 📋 Distribution Options

| Method | File Size | Requirements | Best For |
|--------|-----------|--------------|----------|
| **Launcher Scripts** | ~50MB | Node.js required | Development, Internal use |
| **Standalone Executable** | ~80MB | No requirements | Distribution, End users |
| **Source Code** | ~50MB | Node.js + npm | Developers, Customization |

For detailed build instructions, see [BUILD.md](BUILD.md).

- **[APPLICATION_SUMMARY.md](APPLICATION_SUMMARY.md)** - Complete overview of the entire application
- **[DOCUMENTATION.md](DOCUMENTATION.md)** - Detailed technical documentation with code examples
- **[FEATURES.md](FEATURES.md)** - Comprehensive guide to all features and how to use them
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Technical architecture and implementation details

## 🎯 Platform-Specific Features

### Windows Features

- **PowerShell Integration**: Full PowerShell command support
- **System Commands**: `systeminfo`, `tasklist`, `ipconfig`
- **Path Format**: `C:\Users\username\...`
- **Performance**: `Get-Process | Sort-Object CPU -Descending`

### macOS Features  

- **Zsh/Bash Support**: Native shell integration
- **System Commands**: `system_profiler`, `top`, `ifconfig`
- **Path Format**: `/Users/username/...`
- **Performance**: `top -l 1 -n 10 -o cpu`

### Linux Features

- **Bash Integration**: Standard Linux shell
- **System Commands**: `uname -a`, `ps aux`, `free -h`
- **Path Format**: `/home/username/...`
- **Performance**: `ps aux --sort=-%cpu`

## 🎨 Themes & Customization

### Available Themes

- **🌙 Dark**: Classic terminal appearance (default)
- **☀️ Light**: Clean professional interface  
- **💚 Matrix**: Green-on-black hacker aesthetic
- **🕹️ Retro**: 80s cyberpunk styling

### View Modes

- **🖥️ Desktop**: Standard computer interface
- **📱 Mobile**: Touch-optimized for phones/tablets
- **⛶ Fullscreen**: Immersive browser experience

### Settings

- **Font Size**: 10px to 24px with real-time preview
- **Auto Scroll**: Automatic terminal scrolling
- **Sound Effects**: Audio feedback for interactions
- **Command History**: Configurable history size (10-1000 commands)

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Enter` | Execute command |
| `↑/↓` | Navigate command history |
| `Tab` | Show command suggestions |
| `Ctrl+L` | Clear terminal |
| `Ctrl+T` | New tab |
| `Ctrl+W` | Close tab (except main) |

## 🛡️ Security & Best Practices

⚠️ **IMPORTANT**: This application provides direct access to your system's command line through a web interface.

**Security Guidelines:**

- Only run this on trusted networks
- Do not expose this server to the internet
- Be careful with the commands you execute
- Use only for development and testing purposes
- Each tab runs in isolated processes for better security

## 🔧 Technical Architecture

**Backend Technology:**

- **Node.js** server with Express.js framework
- **Socket.IO** for real-time WebSocket communication
- **Platform Detection** using Node.js `os.platform()`
- **Process Spawning** with isolated shell processes per tab

**Frontend Technology:**

- **HTML5/CSS3/JavaScript** with responsive design
- **WebSocket Client** for real-time communication
- **Local Storage** for settings persistence
- **Web Speech API** for voice input (Chrome/Edge)

**Communication Flow:**

1. Browser connects via WebSocket
1. Server detects platform and spawns appropriate shell
1. Commands sent in real-time to isolated shell processes
1. Output streamed back to browser with syntax highlighting

## 📱 Browser & Platform Compatibility

### Browser Support

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Core Terminal | ✅ | ✅ | ✅ | ✅ |
| Multi-Tab Support | ✅ | ✅ | ✅ | ✅ |
| Voice Input | ✅ | ❌ | ❌ | ✅ |
| Audio Effects | ✅ | ✅ | ✅ | ✅ |
| All Themes | ✅ | ✅ | ✅ | ✅ |
| Font Size Control | ✅ | ✅ | ✅ | ✅ |

### Operating System Support

| OS | Shell | Status | Notes |
|----|-------|--------|-------|
| Windows 10/11 | PowerShell | ✅ Full Support | Native integration |
| macOS | Zsh/Bash | ✅ Full Support | Auto-detects default shell |
| Linux (Ubuntu/Debian) | Bash | ✅ Full Support | Standard shell support |
| Linux (Other) | Bash/sh | ✅ Compatible | May require shell config |

### Device Support

- **💻 Desktop/Laptop**: Full feature set with all keyboard shortcuts
- **📱 Mobile Devices**: Touch-optimized interface, virtual keyboard friendly
- **📟 Tablets**: Responsive design adapts to screen size
- **🖥️ Large Displays**: Enhanced visual mode for presentations

## 🎮 Platform-Specific Command Examples

### Windows (PowerShell)

```powershell
# System information
Get-ComputerInfo
systeminfo

# Process management
Get-Process | Sort-Object CPU -Descending
tasklist /svc

# Network operations
Test-Connection google.com
ipconfig /all

# File operations
Get-ChildItem -Recurse *.txt
dir C:\ /s
```

### macOS (Zsh/Bash)

```bash
# System information
system_profiler SPSoftwareDataType
uname -a

# Process management
top -l 1 -n 10 -o cpu
ps aux | head -10

# Network operations
ping google.com
ifconfig

# File operations
find . -name "*.txt"
ls -la ~/Documents
```

### Linux (Bash)

```bash
# System information
uname -a
lsb_release -a
free -h

# Process management
ps aux --sort=-%cpu | head -10
htop

# Network operations
ping google.com
ip addr show

# File operations
find /home -name "*.txt"
ls -la /var/log
```

## 🏗️ Project Structure

```text
├── server.js              # Node.js backend server (platform-independent)
├── package.json           # Project dependencies and scripts
├── public/
│   ├── index.html         # Main web interface
│   ├── styles.css         # CSS styling and themes
│   └── script.js          # Client-side JavaScript (platform-aware)
├── README.md              # This file
├── DOCUMENTATION.md       # Technical documentation
├── FEATURES.md            # Feature guide
├── ARCHITECTURE.md        # Architecture overview
└── APPLICATION_SUMMARY.md # Complete application summary
```

## 🚧 Troubleshooting

### Connection Failed

- Ensure server is running (`npm start`)
- Check if port 3000 is available
- Verify firewall settings
- Try accessing via `127.0.0.1:3000` instead of `localhost:3000`

### Voice Input Not Working

- Use Chrome or Edge browser (Firefox/Safari don't support Web Speech API)
- Allow microphone permissions when prompted
- Check microphone hardware and system settings
- Ensure HTTPS for production deployments (required for microphone access)

### Commands Not Executing

- Verify appropriate shell is installed and accessible
- Check shell execution policy (Windows: `Set-ExecutionPolicy RemoteSigned`)
- Try simpler commands first (`ls`, `dir`, `pwd`)
- Check terminal output for error messages

### Platform Detection Issues

- Server automatically detects platform on startup
- Check server console for platform detection messages
- Restart server if platform detection seems incorrect
- Manual shell configuration available in server.js if needed

For detailed troubleshooting, see [FEATURES.md](FEATURES.md#troubleshooting-guide).

## 🔮 Future Enhancements

- **🔐 User Authentication**: Multi-user support with role-based access
- **📁 File Manager**: Integrated file upload/download interface
- **🎨 Syntax Highlighting**: Enhanced command and output formatting
- **🌐 Remote Connections**: SSH and remote server integration
- **🔌 Plugin System**: Extensible architecture for custom features
- **📊 Advanced Monitoring**: Real-time system metrics dashboard
- **🔍 Search & Filter**: Terminal output search and filtering
- **📱 Mobile App**: Native mobile applications for iOS/Android

## 📄 License

MIT License - Feel free to use and modify for your projects.

## 🤝 Contributing

Contributions are welcome! Please refer to the documentation files for technical details and architecture information.

**Development Guidelines:**

- Follow existing code style and patterns
- Test on multiple platforms when possible
- Update documentation for new features
- Ensure backward compatibility
- Add appropriate error handling

---

**⚠️ Important Note**: This is a powerful tool that provides direct system access through a web interface. Please use responsibly and follow security best practices. Always test in a safe environment before deploying.

**🌟 Star this project** if you find it useful, and feel free to contribute improvements!
