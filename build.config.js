/**
 * Build Configuration for Server Management Console
 * Supports multiple executable generation tools
 */

const path = require('path');
const os = require('os');

module.exports = {
  // PKG Configuration
  pkg: {
    scripts: ['server.js'],
    assets: [
      'public/**/*',
      'node_modules/express/**/*',
      'node_modules/socket.io/**/*',
      'node_modules/cors/**/*'
    ],
    targets: [
      'node18-win-x64',
      'node18-macos-x64', 
      'node18-linux-x64'
    ],
    outputPath: 'dist/',
    compress: 'GZip'
  },

  // Nexe Configuration
  nexe: {
    input: 'server.js',
    output: path.join('dist', `server-console${os.platform() === 'win32' ? '.exe' : ''}`),
    target: 'windows-x64-18.0.0',
    resources: ['public/**/*']
  },

  // Build info
  info: {
    name: 'Server Management Console',
    version: '2.0.0',
    description: 'Platform-independent web-based terminal interface',
    author: 'Your Name',
    platforms: ['Windows', 'macOS', 'Linux']
  }
};
