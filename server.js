/**
 * Server Management Console - Clean Implementation
 * Multi-tab terminal with separate process isolation
 */

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { spawn } = require('child_process');
const path = require('path');
const cors = require('cors');
const os = require('os');

// Configuration
const PORT = process.env.PORT || 3000;
const IS_WINDOWS = os.platform() === 'win32';
const IS_MAC = os.platform() === 'darwin';
const IS_LINUX = os.platform() === 'linux';

// Shell configuration for different platforms
let SHELL, SHELL_ARGS;
if (IS_WINDOWS) {
    SHELL = 'powershell.exe';
    SHELL_ARGS = ['-NoProfile', '-Command', '-'];
} else if (IS_MAC) {
    SHELL = '/bin/zsh'; // macOS default shell
    SHELL_ARGS = [];
} else {
    SHELL = '/bin/bash'; // Linux default
    SHELL_ARGS = [];
}

// Initialize Express and Socket.IO
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: { origin: "*", methods: ["GET", "POST"] }
});

// Middleware
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Storage for terminal processes and client data
const terminalProcesses = new Map(); // clientId-tabId -> process info
const clientTabs = new Map(); // clientId -> Set of tab IDs

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Terminal process management
function createTerminalProcess(tabId, clientId) {
    console.log(`🔧 Creating terminal process for tab: ${tabId}, client: ${clientId}`);

    const terminal = spawn(SHELL, SHELL_ARGS, {
        cwd: process.cwd(),
        env: process.env,
        stdio: ['pipe', 'pipe', 'pipe']
    });

    const processKey = `${clientId}-${tabId}`;
    terminalProcesses.set(processKey, {
        process: terminal,
        tabId,
        clientId,
        created: new Date(),
        cwd: process.cwd()
    });

    // Handle terminal output
    terminal.stdout.on('data', (data) => {
        io.to(clientId).emit('terminal-output', {
            tabId,
            output: data.toString(),
            type: 'stdout'
        });
    });

    terminal.stderr.on('data', (data) => {
        io.to(clientId).emit('terminal-output', {
            tabId,
            output: data.toString(),
            type: 'stderr'
        });
    });

    terminal.on('close', (code) => {
        console.log(`🔴 Terminal process for tab ${tabId} closed with code ${code}`);
        terminalProcesses.delete(processKey);

        // Clean up event listeners
        terminal.removeAllListeners();

        io.to(clientId).emit('terminal-closed', { tabId, code });
    });

    terminal.on('error', (err) => {
        console.error(`❌ Terminal process error for tab ${tabId}:`, err);
        terminalProcesses.delete(processKey);

        // Clean up event listeners
        terminal.removeAllListeners();

        io.to(clientId).emit('terminal-error', { tabId, error: err.message });
    });

    // Send welcome message
    setTimeout(() => {
        let welcomeMsg;
        if (IS_WINDOWS) {
            welcomeMsg = `Server Management Console - Tab: ${tabId}\nPowerShell ${process.cwd()}\nPS> `;
        } else if (IS_MAC) {
            welcomeMsg = `Server Management Console - Tab: ${tabId}\nzsh ${process.cwd()}\n$ `;
        } else {
            welcomeMsg = `Server Management Console - Tab: ${tabId}\nbash ${process.cwd()}\n$ `;
        }

        io.to(clientId).emit('terminal-output', {
            tabId,
            output: welcomeMsg,
            type: 'welcome'
        });
    }, 300);

    return terminal;
}

function getTerminalProcess(tabId, clientId) {
    const processKey = `${clientId}-${tabId}`;
    const terminalInfo = terminalProcesses.get(processKey);
    return terminalInfo?.process || null;
}

function killTerminalProcess(tabId, clientId) {
    const processKey = `${clientId}-${tabId}`;
    const terminalInfo = terminalProcesses.get(processKey);

    if (terminalInfo?.process) {
        try {
            // Remove event listeners to prevent memory leaks
            terminalInfo.process.removeAllListeners();

            if (!terminalInfo.process.killed) {
                terminalInfo.process.kill('SIGTERM');
                console.log(`🗑️ Killed terminal process for tab: ${tabId}`);
            }
        } catch (error) {
            console.error(`❌ Error killing process for tab ${tabId}:`, error);
        } finally {
            terminalProcesses.delete(processKey);
        }
    }
}

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log(`🔗 Client connected: ${socket.id}`);

    // Initialize client with main tab
    clientTabs.set(socket.id, new Set(['main']));
    createTerminalProcess('main', socket.id);

    // Handle command execution
    socket.on('execute-command', (data) => {
        const { command, tabId } = data;
        console.log(`⚡ Executing in tab ${tabId}: ${command}`);

        const terminal = getTerminalProcess(tabId, socket.id);
        if (terminal?.stdin) {
            try {
                terminal.stdin.write(command + '\n');
            } catch (error) {
                console.error(`❌ Error writing to terminal ${tabId}:`, error);
                socket.emit('terminal-error', { tabId, error: 'Failed to execute command' });
            }
        } else {
            console.error(`❌ No terminal process found for tab: ${tabId}`);
            socket.emit('terminal-error', { tabId, error: 'Terminal process not found' });
        }
    });

    // Handle new tab creation
    socket.on('create-tab', (data) => {
        const { tabId } = data;
        console.log(`📂 Creating new tab: ${tabId} for client: ${socket.id}`);

        const tabs = clientTabs.get(socket.id) || new Set();
        tabs.add(tabId);
        clientTabs.set(socket.id, tabs);

        createTerminalProcess(tabId, socket.id);
        socket.emit('tab-created', { tabId });
    });

    // Handle tab closing
    socket.on('close-tab', (data) => {
        const { tabId } = data;
        console.log(`❌ Closing tab: ${tabId} for client: ${socket.id}`);

        killTerminalProcess(tabId, socket.id);

        const tabs = clientTabs.get(socket.id);
        if (tabs) tabs.delete(tabId);

        socket.emit('tab-closed', { tabId });
    });

    // Handle tab switching
    socket.on('switch-tab', (data) => {
        const { tabId } = data;
        const terminal = getTerminalProcess(tabId, socket.id);

        if (!terminal) {
            console.log(`🔧 Creating missing terminal process for tab: ${tabId}`);
            createTerminalProcess(tabId, socket.id);
        }

        socket.emit('tab-switched', { tabId });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
        console.log(`🔌 Client disconnected: ${socket.id}`);

        // Clean up all processes for this client
        const tabs = clientTabs.get(socket.id) || new Set();
        tabs.forEach(tabId => killTerminalProcess(tabId, socket.id));
        clientTabs.delete(socket.id);
    });
});

// Set max listeners to prevent memory leak warnings
server.setMaxListeners(20);
process.setMaxListeners(20);

// Flag to prevent multiple shutdown handlers
let shutdownInProgress = false;

// Graceful shutdown function
function gracefulShutdown(signal) {
    if (shutdownInProgress) {
        return;
    }
    shutdownInProgress = true;

    console.log(`\n🛑 Shutting down server... (${signal})`);

    // Close all terminal processes
    terminalProcesses.forEach((terminalInfo, key) => {
        try {
            if (terminalInfo.process && !terminalInfo.process.killed) {
                terminalInfo.process.kill('SIGTERM');
            }
        } catch (error) {
            console.error(`❌ Error killing process ${key}:`, error);
        }
    });

    // Clear the maps
    terminalProcesses.clear();
    clientTabs.clear();

    // Close the server
    server.close((err) => {
        if (err) {
            console.error('❌ Error closing server:', err);
            process.exit(1);
        } else {
            console.log('✅ Server closed');
            process.exit(0);
        }
    });

    // Force exit after 5 seconds if graceful shutdown fails
    setTimeout(() => {
        console.log('⚠️ Force exit after timeout');
        process.exit(1);
    }, 5000);
}

// Remove any existing listeners to prevent duplicates
process.removeAllListeners('SIGINT');
process.removeAllListeners('SIGTERM');
process.removeAllListeners('SIGHUP');

// Add shutdown handlers
process.once('SIGINT', () => gracefulShutdown('SIGINT'));
process.once('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.once('SIGHUP', () => gracefulShutdown('SIGHUP'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
    gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
    gracefulShutdown('unhandledRejection');
});

// Start server
server.listen(PORT, () => {
    console.log(`🚀 ====================================`);
    console.log(`🚀 Server Management Console Started`);
    console.log(`🚀 ====================================`);
    console.log(`🌐 URL: http://localhost:${PORT}`);
    console.log(`📊 Multi-tab terminal support: ✅`);
    console.log(`💻 Platform: ${os.platform()}`);
    console.log(`🔧 Shell: ${IS_WINDOWS ? 'PowerShell' : IS_MAC ? 'Zsh' : 'Bash'}`);
    console.log(`⚡ Process isolation: ✅`);
    console.log(`🛑 Press Ctrl+C to stop`);
    console.log(`🚀 ====================================`);
});
