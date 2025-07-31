#!/usr/bin/env node

/**
 * Launcher Script for Server Management Console
 * This makes the server.js executable directly
 */

const path = require('path');
const { spawn } = require('child_process');

// Add shebang support for cross-platform execution
const serverPath = path.join(__dirname, 'server.js');

console.log('🚀 Starting Server Management Console...');
console.log('📁 Server path:', serverPath);

// Spawn the server process
const serverProcess = spawn('node', [serverPath], {
    stdio: 'inherit',
    cwd: __dirname
});

// Handle process events
serverProcess.on('close', (code) => {
    console.log(`\n🔚 Server Management Console exited with code ${code}`);
    process.exit(code);
});

serverProcess.on('error', (error) => {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
});

// Handle termination signals
process.on('SIGINT', () => {
    console.log('\n🛑 Received SIGINT, shutting down gracefully...');
    serverProcess.kill('SIGINT');
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
    serverProcess.kill('SIGTERM');
});
