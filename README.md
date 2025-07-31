# Web Terminal

A comprehensive web interface that provides browser-based access to the Windows PowerShell command prompt with advanced features, multiple viewing modes, and extensive customization options.

## 🚀 Features

- 🖥️ **Multiple View Modes**: Desktop, Mobile, TV, and Fullscreen interfaces
- 🎨 **Theme System**: Dark, Light, Matrix, and Retro themes
- 🎤 **Voice Input**: Speech-to-text command entry
- 📝 **Auto-complete**: PowerShell command suggestions
- 💾 **Session Management**: Save/load terminal sessions
- 🔊 **Audio Feedback**: Sound effects for user actions
- ⚙️ **Customizable Settings**: Font, size, height, and behavior options
- 📱 **Mobile Optimized**: Touch-friendly interface for mobile devices
- 🔒 **Secure**: Input validation and output sanitization

## 📋 Quick Start

### Installation

1. Ensure you have Node.js installed on your system
2. Navigate to the project directory
3. Install dependencies:

```bash
npm install
```

### Usage

1. Start the server:

```bash
npm start
```

2. Open your web browser and navigate to:

```bash
http://localhost:3000
```

3. Start executing PowerShell commands through the web interface!

### Development

For development with auto-restart:

```bash
npm run dev
```

## 📖 Documentation

This project includes comprehensive documentation:

- **[APPLICATION_SUMMARY.md](APPLICATION_SUMMARY.md)** - Complete overview of the entire application
- **[DOCUMENTATION.md](DOCUMENTATION.md)** - Detailed technical documentation with code examples
- **[FEATURES.md](FEATURES.md)** - Comprehensive guide to all features and how to use them
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Technical architecture and implementation details

## 🎯 Key Features Overview

### View Modes

- **Desktop**: Standard computer interface
- **Mobile**: Touch-optimized for phones/tablets  
- **TV**: Large screen with enhanced visuals
- **Fullscreen**: Immersive browser experience

### Themes

- **Dark**: Classic terminal appearance (default)
- **Light**: Clean professional interface
- **Matrix**: Green-on-black hacker aesthetic  
- **Retro**: 80s cyberpunk styling

### Advanced Capabilities

- Real-time command execution via WebSocket
- Voice recognition for hands-free input
- Command history with arrow key navigation
- Auto-completion for PowerShell commands
- Session save/load functionality
- Terminal output export
- Customizable fonts and sizing
- Audio feedback system

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Enter` | Execute command |
| `↑/↓` | Navigate command history |
| `Tab` | Show command suggestions |
| `Ctrl+L` | Clear terminal |
| `Ctrl+S` | Save session |
| `Ctrl+O` | Load session |
| `F11` | Toggle fullscreen |

## 🛡️ Security Warning

⚠️ **IMPORTANT**: This application provides direct access to your system's command prompt through a web interface.

- Only run this on trusted networks
- Do not expose this server to the internet
- Be careful with the commands you execute
- Use only for development and testing purposes

## 🔧 How it Works

- **Backend**: Node.js server with Express.js and Socket.IO
- **Frontend**: HTML/CSS/JavaScript with real-time WebSocket communication
- **Terminal**: Spawns individual PowerShell processes for each client connection
- **Communication**: Bidirectional real-time communication using WebSockets

## 📱 Platform Support

### Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Core Terminal | ✅ | ✅ | ✅ | ✅ |
| Voice Input | ✅ | ❌ | ❌ | ✅ |
| Audio Effects | ✅ | ✅ | ✅ | ✅ |
| All Themes | ✅ | ✅ | ✅ | ✅ |

### Device Support

- **Desktop/Laptop**: Full feature set
- **Mobile Devices**: Touch-optimized interface
- **Tablets**: Responsive design
- **TV Displays**: Enhanced visual mode

## 🎮 Example Commands

Since this uses PowerShell as the backend, you can execute any PowerShell command:

```powershell
# File operations
dir
Get-ChildItem
cd C:\Users

# System information  
Get-Process
Get-Service
systeminfo

# Network operations
ping google.com
ipconfig
Test-Connection

# PowerShell specific
Get-Help Get-Process
Get-Command *service*
```

## 🏗️ Project Structure

```
├── server.js              # Node.js backend server
├── package.json           # Project dependencies
├── public/
│   ├── index.html         # Main web interface
│   ├── styles.css         # CSS styling and themes
│   └── script.js          # Client-side JavaScript
├── README.md              # This file
├── DOCUMENTATION.md       # Technical documentation
├── FEATURES.md            # Feature guide
├── ARCHITECTURE.md        # Architecture overview
└── APPLICATION_SUMMARY.md # Complete application summary
```

## 🚧 Troubleshooting

### Common Issues

**Connection Failed**

- Ensure server is running (`npm start`)
- Check if port 3000 is available
- Verify firewall settings

**Voice Input Not Working**

- Use Chrome or Edge browser
- Allow microphone permissions
- Check microphone hardware

**Commands Not Executing**

- Verify PowerShell is installed
- Check PowerShell execution policy
- Try simpler commands first

For detailed troubleshooting, see [FEATURES.md](FEATURES.md#troubleshooting-guide).

## 🔮 Future Enhancements

- Multiple terminal tabs
- File upload/download
- Syntax highlighting  
- User authentication
- Remote server connections
- Plugin system

## 📄 License

MIT License - Feel free to use and modify for your projects.

## 🤝 Contributing

Contributions are welcome! Please refer to the documentation files for technical details and architecture information.

---

**Note**: This is a powerful tool that provides direct system access. Please use responsibly and follow security best practices.
