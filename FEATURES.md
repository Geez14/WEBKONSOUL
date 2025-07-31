# Web Terminal - Features Guide

## Quick Start Guide

### 1. Installation and Setup

```bash
# Clone or download the project
cd web-terminal-project

# Install dependencies
npm install

# Start the server
npm start

# Open browser to http://localhost:3000
```

### 2. Basic Usage

1. **Connect**: The terminal automatically connects when you open the page
2. **Execute Commands**: Type any PowerShell command and press Enter
3. **View Output**: See real-time command output in the terminal window
4. **Navigate History**: Use ↑/↓ arrow keys to browse command history

## Feature Breakdown

### 🖥️ View Modes

#### Desktop Mode (Default)

- **Purpose**: Standard computer interface
- **Best For**: Laptop/desktop usage
- **Features**: Full functionality, optimal spacing
- **Activation**: Select "🖥️ Desktop" from view dropdown

#### Mobile Mode

- **Purpose**: Touch-friendly interface for phones/tablets  
- **Best For**: Mobile devices, touch screens
- **Features**:
  - Larger touch targets
  - Optimized layouts for small screens
  - Prevents zoom on iOS input
  - Responsive button sizing
- **Activation**: Select "📱 Mobile" from view dropdown

#### TV Mode

- **Purpose**: Large screen display with enhanced visuals
- **Best For**: TV displays, presentations, large monitors
- **Features**:
  - Glowing text effects
  - Large fonts and buttons
  - High contrast colors
  - Animated visual elements
- **Activation**: Select "📺 TV Mode" from view dropdown

#### Fullscreen Mode

- **Purpose**: Immersive terminal experience
- **Best For**: Distraction-free work, demonstrations
- **Features**:
  - Full browser window usage
  - Hidden browser UI
  - Maximum terminal space
  - Press F11 to toggle
- **Activation**: Select "🔳 Fullscreen" from view dropdown or press F11

### 🎨 Theme System

#### Dark Theme (Default)

```css
/* Dark theme color scheme */
Background: #1e1e1e (dark gray)
Text: #ffffff (white)
Accent: #4CAF50 (green)
```

- **Best For**: Low-light environments, reduced eye strain
- **Classic terminal appearance**

#### Light Theme

```css
/* Light theme color scheme */
Background: #ffffff (white)
Text: #000000 (black)  
Accent: #2E7D32 (dark green)
```

- **Best For**: Bright environments, printing, accessibility
- **Clean, professional appearance**

#### Matrix Theme

```css
/* Matrix theme color scheme */
Background: #000000 (black)
Text: #00ff00 (bright green)
Accent: #00ff00 (bright green)
```

- **Best For**: Hacker aesthetic, demonstrations, fun usage
- **Classic "Matrix movie" look with glowing green text**

#### Retro Theme

```css
/* Retro theme color scheme */
Background: #2e1065 (deep purple)
Text: #ffd700 (gold)
Accent: #ff6b9d (pink)
```

- **Best For**: 80s cyberpunk aesthetic, creative work
- **Neon colors with retro-futuristic styling**

### 🎤 Voice Input

#### How It Works

```javascript
// Voice recognition setup
const recognition = new SpeechRecognition();
recognition.lang = 'en-US';
recognition.continuous = false;

// Usage
recognition.onresult = (event) => {
    const command = event.results[0][0].transcript;
    // Command automatically inserted into input field
};
```

#### Usage Steps

1. Click the 🎤 microphone button
2. Button turns red (🔴) indicating listening
3. Speak your command clearly
4. Command appears in input field
5. Press Enter to execute

#### Supported Commands

- All PowerShell commands
- Natural language (e.g., "list files", "show processes")
- System commands (e.g., "ping google", "check services")

#### Browser Support

- ✅ Chrome/Chromium (recommended)
- ✅ Edge
- ❌ Firefox (limited support)
- ❌ Safari (limited support)

### 📝 Command Suggestions

#### Auto-Complete Feature

```javascript
// Common PowerShell commands database
const commonCommands = [
    'Get-Process', 'Get-Service', 'Get-ChildItem',
    'Set-Location', 'Test-Connection', 'Get-Help',
    'dir', 'ls', 'cd', 'ping', 'ipconfig'
];
```

#### How To Use

1. Start typing a command (minimum 2 characters)
2. Suggestion dropdown appears automatically
3. Use Tab key to show all suggestions
4. Click on suggestion or use arrow keys + Enter
5. Press Escape to hide suggestions

#### Available Suggestions

- **File Operations**: `dir`, `ls`, `cd`, `Get-ChildItem`, `Copy-Item`
- **System Info**: `Get-Process`, `Get-Service`, `systeminfo`, `whoami`
- **Network**: `ping`, `ipconfig`, `netstat`, `Test-Connection`
- **PowerShell**: `Get-Help`, `Get-Command`, `Get-Module`

### 💾 Session Management

#### Save Session

```javascript
// Session data structure
const sessionData = {
    name: "My Session",
    data: [
        {type: 'command', content: 'Get-Process', timestamp: '2025-01-01T12:00:00Z'},
        {type: 'output', content: 'Process list...', timestamp: '2025-01-01T12:00:01Z'}
    ],
    view: 'desktop',
    theme: 'dark'
};
```

#### How To Use?

1. **Save**: Click "💾 Save Session" button
2. **Name**: Enter a session name when prompted
3. **Storage**: Session saved to browser localStorage
4. **Load**: Click "📁 Load Session" and enter session name
5. **Restore**: All commands, output, view mode, and theme restored

#### What Gets Saved

- All command history
- All terminal output
- Current view mode (desktop/mobile/TV/fullscreen)
- Current theme selection
- Timestamp of session creation

### 📤 Export Functionality

#### Export Terminal Log

```javascript
// Export format
const logContent = sessionData
    .map(item => `[${item.timestamp}] ${item.type.toUpperCase()}: ${item.content}`)
    .join('\n');

// Example output:
// [2025-01-01T12:00:00.000Z] COMMAND: Get-Process
// [2025-01-01T12:00:01.000Z] OUTPUT: Handles  NPM(K)    PM(K) ...
```

#### Usage

1. Click "📤 Export Log" button
2. Browser downloads `terminal_log_YYYY-MM-DD.txt` file
3. File contains complete session history with timestamps
4. Compatible with text editors, log analyzers

### ⚙️ Settings Panel

#### Customization Options

> Font Settings

```javascript
// Available fonts
fonts = [
    "'Consolas', monospace",     // Windows default
    "'Monaco', monospace",       // macOS default  
    "'Courier New', monospace",  // Cross-platform
    "'Fira Code', monospace"     // Programming font with ligatures
];

// Font size range: 10px - 24px
fontSize: 10-24
```

> Display Settings**

```javascript
// Terminal height range: 300px - 800px
terminalHeight: 300-800

// Auto-scroll to bottom on new output
autoScroll: true/false

// Sound effects for actions
soundEffects: true/false

// Command suggestion system
commandSuggestions: true/false
```

#### Access Settings

1. Click "⚙️ Settings" button
2. Adjust sliders and toggles
3. Click "Save Settings" to persist changes
4. Click "Reset to Default" to restore defaults

### 🔊 Sound System

#### Audio Feedback Types

```javascript
// Sound frequencies and durations
const sounds = {
    'connect': { freq: 800, duration: 0.1 },      // High beep
    'disconnect': { freq: 400, duration: 0.2 },   // Low beep
    'command': { freq: 600, duration: 0.05 },     // Quick click
    'error': { freq: 200, duration: 0.3 },        // Error buzz
    'clear': { freq: 1000, duration: 0.1 },       // Sharp beep
    'save': { freq: 900, duration: 0.15 },        // Success tone
    'load': { freq: 700, duration: 0.15 },        // Load tone
    'export': { freq: 1200, duration: 0.1 },      // Export chime
    'view-change': { freq: 750, duration: 0.1 },  // Mode change
    'theme-change': { freq: 850, duration: 0.1 }, // Theme change
    'voice-input': { freq: 1100, duration: 0.08 }, // Voice feedback
    'reset': { freq: 500, duration: 0.2 }         // Reset tone
};
```

#### Sound Events

- **Connection**: Audio when connecting/disconnecting from server
- **Commands**: Subtle click sound when sending commands
- **Errors**: Distinct error sound for failed operations
- **Success**: Positive tones for successful actions
- **UI Changes**: Feedback for view/theme changes

#### Toggle Sounds

- Enable/disable in Settings panel
- Uses Web Audio API for cross-browser compatibility
- Low volume (10%) to avoid disruption

## Keyboard Shortcuts

### Global Shortcuts

| Shortcut | Action | Description |
|----------|--------|-------------|
| `Enter` | Send Command | Execute the typed command |
| `↑` | History Up | Navigate to previous command |
| `↓` | History Down | Navigate to next command |
| `Tab` | Show Suggestions | Display command suggestions |
| `Esc` | Hide Suggestions | Close suggestion dropdown |
| `Ctrl+L` | Clear Terminal | Clear all terminal output |
| `Ctrl+S` | Save Session | Save current session |
| `Ctrl+O` | Load Session | Load saved session |
| `Ctrl+T` | New Tab | Create new terminal tab |
| `Ctrl+,` | Settings | Open settings panel |
| `F11` | Fullscreen | Toggle fullscreen mode |

### Command Examples

#### File Operations

```powershell
# List files and directories
dir
Get-ChildItem
ls

# Change directory
cd C:\Users
Set-Location "C:\Program Files"

# Create new file
New-Item -ItemType File -Name "test.txt"

# Copy files
Copy-Item "source.txt" "destination.txt"
```

#### System Information

```powershell
# List running processes
Get-Process
tasklist

# System information
systeminfo
Get-ComputerInfo

# Current user
whoami
$env:USERNAME

# Services
Get-Service
Get-Service | Where-Object {$_.Status -eq "Running"}
```

#### Network Commands

```powershell
# Ping test
ping google.com
Test-Connection google.com

# Network configuration
ipconfig
ipconfig /all

# Network connections
netstat -an
Get-NetTCPConnection
```

#### PowerShell Specific

```powershell
# Get help
Get-Help Get-Process
Get-Command *service*

# Variable operations
$myVar = "Hello World"
$myVar

# Pipeline operations
Get-Process | Sort-Object CPU -Descending | Select-Object -First 5
```

## Mobile Usage Guide

### Touch Interface

- **Tap**: Focus input field, select suggestions
- **Double-tap**: Select text in terminal
- **Long-press**: Context menu (browser dependent)
- **Swipe**: Scroll through terminal output

### Mobile-Specific Features

```css
/* Mobile optimizations */
.view-mobile .command-input {
    font-size: 16px; /* Prevents iOS zoom */
}

.view-mobile .control-btn {
    min-height: 44px; /* iOS touch target size */
}
```

### Best Practices for Mobile

1. Use Mobile view mode for better touch targets
2. Enable command suggestions for faster typing
3. Use voice input when available
4. Keep commands short and simple
5. Use landscape mode for better visibility

## TV/Presentation Mode

### Visual Enhancements

```css
/* TV mode styling */
.view-tv .header h1 {
    animation: glow 2s ease-in-out infinite alternate;
    text-shadow: 0 0 30px var(--accent-color);
}

.view-tv .terminal {
    background: radial-gradient(ellipse at center, var(--bg-primary), #000000);
}
```

### Presentation Tips

1. Use TV Mode for large screens
2. Choose high-contrast themes (Matrix or Retro)
3. Increase font size in settings
4. Enable sound effects for audience feedback
5. Use fullscreen mode to hide browser UI

## Troubleshooting

### Common Issues and Solutions

#### Voice Input Not Working

**Symptoms**: Microphone button doesn't respond or no voice recognition
**Solutions**:

1. Use Chrome or Edge browser
2. Allow microphone permissions
3. Check microphone hardware
4. Ensure quiet environment
5. Speak clearly and at normal pace

#### Connection Issues

**Symptoms**: "Disconnected" status, commands not executing
**Solutions**:

1. Check if server is running (`npm start`)
2. Refresh browser page
3. Check network connectivity
4. Verify port 3000 is not blocked
5. Try localhost:3000 directly

#### Performance Issues

**Symptoms**: Slow response, browser lag
**Solutions**:

1. Clear terminal output (Ctrl+L)
2. Reduce terminal height in settings
3. Disable sound effects
4. Close other browser tabs
5. Restart browser

#### Theme/Display Issues

**Symptoms**: Broken styling, missing elements
**Solutions**:

1. Clear browser cache and cookies
2. Disable browser extensions
3. Try incognito/private mode
4. Check browser console for errors
5. Reset settings to default

This comprehensive feature guide provides detailed information about all capabilities of the Web Terminal application, helping users make the most of its powerful features across different devices and use cases.
