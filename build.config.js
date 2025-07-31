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
      'node18-linux-x64',
      'node18-linux-arm64',
      'node18-linux-armv7'
    ],
    outputPath: 'dist/',
    compress: 'GZip'
  },

  // Nexe Configuration
  nexe: {
    input: 'server.js',
    // Output will be set per-platform in build scripts
    output: path.join('dist', `server-console${os.platform() === 'win32' ? '.exe' : ''}`),
    // Example targets for cross-platform builds
    targets: [
      'windows-x64-18.0.0',
      'linux-x64-18.0.0',
      'linux-arm64-18.0.0',
      'linux-armv7-18.0.0'
    ],
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
