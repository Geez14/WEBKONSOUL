# Web Terminal Documentation

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Features](#features)
4. [Code Structure](#code-structure)
5. [API Reference](#api-reference)
6. [Configuration](#configuration)
7. [Troubleshooting](#troubleshooting)

## Overview

The Web Terminal is a feature-rich web application that provides a browser-based interface to access the Windows PowerShell command prompt. It offers multiple viewing modes, themes, voice input, session management, and various customization options.

### Key Components

- **Backend**: Node.js server with Express.js and Socket.IO
- **Frontend**: HTML5, CSS3, and vanilla JavaScript
- **Communication**: Real-time WebSocket connections
- **Shell Integration**: PowerShell process spawning and management

## Architecture

### System Architecture Diagram

```text
┌─────────────────┐    WebSocket     ┌─────────────────┐
│   Web Browser   │ ←──────────────→ │   Node.js       │
│                 │                  │   Server        │
│ - HTML/CSS/JS   │                  │                 │
│ - Socket.IO     │                  │ - Express.js    │
│ - WebRTC Audio  │                  │ - Socket.IO     │
└─────────────────┘                  │ - Child Process │
                                     └─────────────────┘
                                              │
                                              ▼
                                     ┌─────────────────┐
                                     │   PowerShell    │
                                     │   Process       │
                                     │                 │
                                     │ - Command Exec  │
                                     │ - Output Stream │
                                     └─────────────────┘
```

### Data Flow

1. User types command in web interface
2. Command sent via WebSocket to Node.js server
3. Server spawns/uses PowerShell process
4. Command executed in PowerShell
5. Output streamed back to browser via WebSocket
6. Browser displays formatted output

## Features

### 1. Multiple View Modes

#### Desktop View (Default)

Standard computer interface optimized for desktop/laptop usage.

**Code Implementation:**

```javascript
changeView(view) {
    // Remove existing view classes
    document.body.classList.remove('view-desktop', 'view-mobile', 'view-tv', 'view-fullscreen');
    
    // Add new view class
    document.body.classList.add(`view-${view}`);
    this.currentView = view;
    
    // Update terminal title
    const titles = {
        desktop: '🖥️ Web Terminal',
        mobile: '📱 Mobile Terminal',
        tv: '📺 TV Terminal',
        fullscreen: '🔳 Fullscreen Terminal'
    };
    
    document.getElementById('terminalTitle').textContent = titles[view];
    
    // Save preference
    localStorage.setItem('terminalView', view);
    
    this.playSound('view-change');
}
```

**CSS Styling:**

```css
/* Desktop View - Default styling */
.container {
    max-width: 1200px;
    margin: 0 auto;
    background-color: var(--bg-secondary);
    border-radius: 8px;
}
```

#### Mobile View

Optimized for smartphones and tablets with touch-friendly interface.

**CSS Implementation:**

```css
.view-mobile {
    padding: 10px;
}

.view-mobile .container {
    border-radius: 0;
    height: 100vh;
    max-width: none;
    margin: 0;
}

.view-mobile .command-input {
    font-size: 16px; /* Prevents zoom on iOS */
    min-width: 0;
}

.view-mobile .control-btn {
    padding: 10px 15px;
    font-size: 12px;
}
```

#### TV Mode

Large screen interface with glowing effects for TV displays.

**CSS Implementation:**

```css
.view-tv .container {
    border-radius: 20px;
    border: 5px solid var(--accent-color);
    box-shadow: 
        0 0 50px rgba(76, 175, 80, 0.3),
        inset 0 0 50px rgba(0, 0, 0, 0.2);
}

.view-tv .header h1 {
    font-size: 32px;
    text-shadow: 0 0 20px var(--accent-color);
    animation: glow 2s ease-in-out infinite alternate;
}

@keyframes glow {
    from { text-shadow: 0 0 20px var(--accent-color); }
    to { text-shadow: 0 0 30px var(--accent-color), 0 0 40px var(--accent-color); }
}
```

#### Fullscreen Mode

Immersive full-screen experience.

**CSS Implementation:**

```css
.view-fullscreen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 9999;
    background-color: var(--bg-primary);
}
```

### 2. Theme System

The application supports multiple themes using CSS custom properties (variables).

**Theme Implementation:**

```javascript
changeTheme(theme) {
    // Remove existing theme classes
    document.body.classList.remove('theme-dark', 'theme-light', 'theme-matrix', 'theme-retro');
    
    // Add new theme class
    if (theme !== 'dark') {
        document.body.classList.add(`theme-${theme}`);
    }
    
    this.currentTheme = theme;
    
    // Save preference
    localStorage.setItem('terminalTheme', theme);
    
    this.playSound('theme-change');
}
```

**CSS Theme Variables:**

```css
:root {
    --bg-primary: #1e1e1e;
    --bg-secondary: #2d2d2d;
    --bg-tertiary: #333333;
    --text-primary: #ffffff;
    --accent-color: #4CAF50;
    /* ... other variables */
}

.theme-matrix {
    --bg-primary: #000000;
    --bg-secondary: #001100;
    --text-primary: #00ff00;
    --accent-color: #00ff00;
    /* Matrix theme colors */
}

.theme-retro {
    --bg-primary: #2e1065;
    --text-primary: #ffd700;
    --accent-color: #ff6b9d;
    /* Retro theme colors */
}
```

### 3. Voice Input Feature

Implements Web Speech API for voice command input.

**Voice Recognition Setup:**

```javascript
setupVoiceRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-US';
        
        this.recognition.onresult = (event) => {
            const command = event.results[0][0].transcript;
            this.commandInput.value = command;
            this.playSound('voice-input');
        };
        
        this.recognition.onerror = (event) => {
            console.error('Voice recognition error:', event.error);
            this.playSound('error');
        };
        
        this.recognition.onend = () => {
            this.isListening = false;
            this.voiceBtn.textContent = '🎤';
            this.voiceBtn.style.backgroundColor = '';
        };
    }
}

toggleVoiceInput() {
    if (!this.recognition) return;
    
    if (this.isListening) {
        this.recognition.stop();
    } else {
        this.recognition.start();
        this.isListening = true;
        this.voiceBtn.textContent = '🔴';
        this.voiceBtn.style.backgroundColor = 'var(--error-color)';
    }
}
```

### 4. Command Suggestions

Auto-completion system for PowerShell commands.

**Suggestion Implementation:**

```javascript
updateSuggestions() {
    const input = this.commandInput.value.toLowerCase();
    if (input.length < 2) {
        this.hideSuggestions();
        return;
    }
    
    const matches = this.commonCommands.filter(cmd => 
        cmd.toLowerCase().startsWith(input)
    );
    
    if (matches.length > 0) {
        this.showSuggestionsBox(matches.slice(0, 5));
    } else {
        this.hideSuggestions();
    }
}

showSuggestionsBox(suggestions) {
    this.suggestions.innerHTML = '';
    this.suggestions.style.display = 'block';
    
    suggestions.forEach((suggestion, index) => {
        const item = document.createElement('div');
        item.className = 'suggestion-item';
        item.textContent = suggestion;
        item.addEventListener('click', () => {
            this.commandInput.value = suggestion;
            this.hideSuggestions();
            this.commandInput.focus();
        });
        this.suggestions.appendChild(item);
    });
    
    // Position suggestions
    const rect = this.commandInput.getBoundingClientRect();
    this.suggestions.style.position = 'absolute';
    this.suggestions.style.left = rect.left + 'px';
    this.suggestions.style.top = (rect.top - this.suggestions.offsetHeight - 5) + 'px';
    this.suggestions.style.width = rect.width + 'px';
}
```

**Common Commands Array:**

```javascript
this.commonCommands = [
    'dir', 'ls', 'cd', 'pwd', 'Get-Location', 'Get-Process', 'Get-Service',
    'ping', 'ipconfig', 'netstat', 'tasklist', 'systeminfo', 'whoami',
    'Get-ChildItem', 'Set-Location', 'Clear-Host', 'Get-Help',
    'Get-EventLog', 'Get-WmiObject', 'Test-Connection', 'Get-Content',
    'Set-Content', 'Copy-Item', 'Move-Item', 'Remove-Item', 'New-Item'
];
```

### 5. Session Management

Save and load terminal sessions for later use.

**Save Session:**

```javascript
saveSession() {
    const sessionName = prompt('Enter session name:', `Session_${new Date().toLocaleDateString()}`);
    if (sessionName) {
        const sessionData = {
            name: sessionName,
            data: this.sessionData,
            timestamp: new Date().toISOString(),
            view: this.currentView,
            theme: this.currentTheme
        };
        
        localStorage.setItem(`terminal_session_${sessionName}`, JSON.stringify(sessionData));
        this.appendOutput(`✅ Session saved as: ${sessionName}\n`);
        this.playSound('save');
    }
}
```

**Load Session:**

```javascript
loadSession() {
    const sessionName = prompt('Enter session name to load:');
    if (sessionName) {
        const sessionData = localStorage.getItem(`terminal_session_${sessionName}`);
        if (sessionData) {
            const session = JSON.parse(sessionData);
            
            // Clear current terminal
            this.clearTerminal();
            
            // Restore session data
            session.data.forEach(item => {
                if (item.type === 'output') {
                    this.appendOutput(item.content);
                }
            });
            
            // Restore view and theme
            this.viewMode.value = session.view || 'desktop';
            this.themeMode.value = session.theme || 'dark';
            this.changeView(session.view || 'desktop');
            this.changeTheme(session.theme || 'dark');
            
            this.appendOutput(`📁 Session loaded: ${sessionName}\n`);
            this.playSound('load');
        } else {
            this.appendOutput(`❌ Session not found: ${sessionName}\n`);
            this.playSound('error');
        }
    }
}
```

### 6. Sound Effects System

Audio feedback using Web Audio API.

**Sound Implementation:**

```javascript
playSound(type) {
    if (!this.settings.soundEffects) return;
    
    // Create audio context for sound effects
    if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    const sounds = {
        'connect': { freq: 800, duration: 0.1 },
        'disconnect': { freq: 400, duration: 0.2 },
        'command': { freq: 600, duration: 0.05 },
        'error': { freq: 200, duration: 0.3 },
        'clear': { freq: 1000, duration: 0.1 },
        'save': { freq: 900, duration: 0.15 },
        'load': { freq: 700, duration: 0.15 },
        'export': { freq: 1200, duration: 0.1 },
        'view-change': { freq: 750, duration: 0.1 },
        'theme-change': { freq: 850, duration: 0.1 },
        'voice-input': { freq: 1100, duration: 0.08 },
        'reset': { freq: 500, duration: 0.2 }
    };
    
    const sound = sounds[type];
    if (!sound) return;
    
    try {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(sound.freq, this.audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + sound.duration);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + sound.duration);
    } catch (error) {
        console.warn('Audio playback failed:', error);
    }
}
```

### 7. Settings System

Persistent user preferences management.

**Settings Management:**

```javascript
loadSettings() {
    const saved = localStorage.getItem('terminalSettings');
    return saved ? JSON.parse(saved) : {
        fontSize: 14,
        fontFamily: "'Consolas', monospace",
        terminalHeight: 500,
        autoScroll: true,
        soundEffects: true,
        commandSuggestions: true
    };
}

saveSettings() {
    this.settings = {
        fontSize: parseInt(document.getElementById('fontSizeRange').value),
        fontFamily: document.getElementById('fontFamily').value,
        terminalHeight: parseInt(document.getElementById('terminalHeight').value),
        autoScroll: document.getElementById('autoScroll').checked,
        soundEffects: document.getElementById('soundEffects').checked,
        commandSuggestions: document.getElementById('commandSuggestions').checked
    };
    
    localStorage.setItem('terminalSettings', JSON.stringify(this.settings));
    this.applySettings();
    this.closeSettings();
    this.playSound('save');
}

applySettings() {
    // Apply font settings
    this.terminal.style.fontSize = this.settings.fontSize + 'px';
    this.terminal.style.fontFamily = this.settings.fontFamily;
    this.commandInput.style.fontFamily = this.settings.fontFamily;
    
    // Apply terminal height
    const container = document.querySelector('.terminal-container');
    container.style.minHeight = this.settings.terminalHeight + 'px';
    container.style.maxHeight = this.settings.terminalHeight + 'px';
    
    // Load saved view and theme
    const savedView = localStorage.getItem('terminalView') || 'desktop';
    const savedTheme = localStorage.getItem('terminalTheme') || 'dark';
    
    this.viewMode.value = savedView;
    this.themeMode.value = savedTheme;
    this.changeView(savedView);
    this.changeTheme(savedTheme);
}
```

## Code Structure

### File Organization

```bash
├── server.js              # Node.js backend server
├── package.json           # Project dependencies and scripts
├── public/
│   ├── index.html         # Main web interface
│   ├── styles.css         # CSS styling and themes
│   └── script.js          # Client-side JavaScript
├── README.md              # Basic project information
└── DOCUMENTATION.md       # This documentation file
```

### Backend Server Architecture

**Server Setup:**

```javascript
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { spawn } = require('child_process');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Store active shells for each client
const clientShells = new Map();
```

**Client Connection Handling:**

```javascript
io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);
    
    // Create a new PowerShell process for this client
    const shell = spawn('powershell.exe', ['-NoProfile', '-Command', '-'], {
        stdio: ['pipe', 'pipe', 'pipe'],
        shell: false,
        cwd: process.cwd()
    });

    // Store the shell for this client
    clientShells.set(socket.id, shell);

    // Handle shell output
    shell.stdout.on('data', (data) => {
        socket.emit('output', data.toString());
    });

    shell.stderr.on('data', (data) => {
        socket.emit('output', data.toString());
    });

    // Handle command input from client
    socket.on('command', (command) => {
        if (shell && !shell.killed) {
            console.log(`Executing command: ${command}`);
            shell.stdin.write(command + '\n');
        }
    });

    // Handle client disconnect
    socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
        const shell = clientShells.get(socket.id);
        if (shell && !shell.killed) {
            shell.kill();
        }
        clientShells.delete(socket.id);
    });
});
```

### Frontend Class Structure

**Main WebTerminal Class:**

```javascript
class WebTerminal {
    constructor() {
        // DOM elements
        this.terminal = document.getElementById('terminal');
        this.commandInput = document.getElementById('commandInput');
        // ... other elements
        
        // State management
        this.commandHistory = [];
        this.sessionData = [];
        this.settings = this.loadSettings();
        this.currentTheme = 'dark';
        this.currentView = 'desktop';
        
        // Initialize
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.applySettings();
        this.updateClock();
        this.setupVoiceRecognition();
        this.connect();
    }
    
    // ... method implementations
}
```

## API Reference

### WebSocket Events

#### Client to Server Events

> **command**

- **Description**: Send a command to be executed in PowerShell
- **Payload**: `string` - The command to execute
- **Example**:

```javascript
socket.emit('command', 'Get-Process');
```

#### Server to Client Events

> **output**

- **Description**: Receive output from PowerShell command execution
- **Payload**: `string` - The output text
- **Example**:

```javascript
socket.on('output', (data) => {
    console.log('Received output:', data);
});
```

> **connect**

- **Description**: Connection established with server
- **Payload**: None
- **Example**:

```javascript
socket.on('connect', () => {
    console.log('Connected to server');
});
```

> **disconnect**

- **Description**: Connection lost with server
- **Payload**: None
- **Example**:

```javascript
socket.on('disconnect', () => {
    console.log('Disconnected from server');
});
```

### Client-Side Methods

#### Core Methods

> **sendCommand()**

```javascript
sendCommand() {
    const command = this.commandInput.value.trim();
    if (command && this.socket && this.socket.connected) {
        this.socket.emit('command', command);
        // Add to history and clear input
    }
}
```

> **appendOutput(text)**

```javascript
appendOutput(text) {
    // Escape HTML and add color coding
    const escapedText = this.escapeHtml(text);
    this.terminal.innerHTML += escapedText;
    this.scrollToBottom();
}
```

> **clearTerminal()**

```javascript
clearTerminal() {
    this.terminal.innerHTML = '';
    this.sessionData = [];
    this.playSound('clear');
}
```

#### View Management

> **changeView(view)**

```javascript
changeView(view) {
    document.body.classList.remove('view-desktop', 'view-mobile', 'view-tv', 'view-fullscreen');
    document.body.classList.add(`view-${view}`);
    this.currentView = view;
    localStorage.setItem('terminalView', view);
}
```

> **changeTheme(theme)**

```javascript
changeTheme(theme) {
    document.body.classList.remove('theme-dark', 'theme-light', 'theme-matrix', 'theme-retro');
    if (theme !== 'dark') {
        document.body.classList.add(`theme-${theme}`);
    }
    this.currentTheme = theme;
    localStorage.setItem('terminalTheme', theme);
}
```

## Configuration

### Environment Variables

- `PORT` - Server port (default: 3000)

### Client Configuration

Settings are stored in localStorage and include:

- `fontSize` - Terminal font size (10-24px)
- `fontFamily` - Font family selection
- `terminalHeight` - Terminal height (300-800px)
- `autoScroll` - Auto-scroll to bottom
- `soundEffects` - Enable/disable audio feedback
- `commandSuggestions` - Enable/disable command suggestions

### Server Configuration

```javascript
const PORT = process.env.PORT || 3000;

// CORS configuration
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
```

## Troubleshooting

### Common Issues

#### 1. Connection Failed

**Problem**: Browser cannot connect to server
**Solutions**:

- Ensure server is running (`npm start`)
- Check if port 3000 is available
- Verify firewall settings
- Try refreshing the browser

#### 2. Voice Input Not Working

**Problem**: Voice recognition button not responding
**Solutions**:

- Ensure browser supports Web Speech API (Chrome recommended)
- Check microphone permissions
- Verify HTTPS connection (required for some browsers)

#### 3. Commands Not Executing

**Problem**: Commands sent but no response
**Solutions**:

- Check PowerShell execution policy
- Verify PowerShell is installed
- Check server console for errors
- Try simpler commands first (e.g., `dir`)

#### 4. Styling Issues

**Problem**: Interface looks broken or themes not working
**Solutions**:

- Clear browser cache
- Check browser console for CSS errors
- Ensure all CSS files are loaded
- Try different browser

#### 5. Session Data Not Saving

**Problem**: Settings or sessions not persisting
**Solutions**:

- Check if localStorage is enabled
- Verify browser storage limits
- Clear corrupted localStorage data
- Check browser privacy settings

### Performance Optimization

#### 1. Terminal Output Buffering

For large outputs, implement buffering:

```javascript
let outputBuffer = '';
let bufferTimeout;

socket.on('output', (data) => {
    outputBuffer += data;
    
    if (bufferTimeout) {
        clearTimeout(bufferTimeout);
    }
    
    bufferTimeout = setTimeout(() => {
        this.appendOutput(outputBuffer);
        outputBuffer = '';
    }, 100);
});
```

#### 2. Memory Management

Limit terminal history to prevent memory leaks:

```javascript
appendOutput(text) {
    this.terminal.innerHTML += text;
    
    // Limit terminal output length
    const maxLines = 1000;
    const lines = this.terminal.innerHTML.split('\n');
    if (lines.length > maxLines) {
        this.terminal.innerHTML = lines.slice(-maxLines).join('\n');
    }
}
```

#### 3. Event Listener Cleanup

Properly cleanup event listeners:

```javascript
disconnect() {
    if (this.socket) {
        this.socket.removeAllListeners();
        this.socket.disconnect();
    }
    
    if (this.recognition) {
        this.recognition.stop();
    }
}
```

### Security Considerations

#### 1. Input Validation

Always validate and sanitize user input:

```javascript
sendCommand() {
    const command = this.commandInput.value.trim();
    
    // Basic validation
    if (!command || command.length > 1000) {
        return;
    }
    
    // Escape HTML to prevent XSS
    const sanitizedCommand = this.escapeHtml(command);
    
    // Send command
    this.socket.emit('command', sanitizedCommand);
}
```

#### 2. Output Sanitization

Sanitize all output to prevent XSS:

```javascript
escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
```

#### 3. Network Security

- Use HTTPS in production
- Implement proper CORS policies
- Consider authentication for multi-user environments
- Limit command execution scope

This documentation provides a comprehensive guide to understanding, using, and extending the Web Terminal application. For additional support or feature requests, please refer to the project repository or contact the development team.
