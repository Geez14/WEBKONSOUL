#!/usr/bin/env node

/**
 * Custom Build Script for Server Management Console
 * Generates platform-specific executables
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

console.log('🚀 Building Server Management Console Executables...\n');

// Ensure dist directory exists
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
    console.log('📁 Created dist directory');
}

// Build configuration
const builds = [
    {
        name: 'Windows (x64)',
        target: 'node18-win-x64',
        output: 'server-console-win.exe',
        icon: '🪟'
    },
    {
        name: 'macOS (x64)',
        target: 'node18-macos-x64', 
        output: 'server-console-mac',
        icon: '🍎'
    },
    {
        name: 'Linux (x64)',
        target: 'node18-linux-x64',
        output: 'server-console-linux',
        icon: '🐧'
    }
];

// Function to build executable
function buildExecutable(build) {
    try {
        console.log(`${build.icon} Building ${build.name}...`);
        
        const command = `npx pkg server.js --targets ${build.target} --output dist/${build.output}`;
        execSync(command, { stdio: 'inherit' });
        
        console.log(`✅ ${build.name} build completed: dist/${build.output}\n`);
        return true;
    } catch (error) {
        console.error(`❌ Failed to build ${build.name}:`, error.message);
        return false;
    }
}

// Main build process
async function main() {
    console.log('📦 Installing build dependencies...');
    try {
        execSync('npm install pkg nexe --save-dev', { stdio: 'inherit' });
        console.log('✅ Dependencies installed\n');
    } catch (error) {
        console.error('❌ Failed to install dependencies:', error.message);
        process.exit(1);
    }

    console.log('🔨 Starting build process...\n');
    
    let successCount = 0;
    const startTime = Date.now();

    // Build for all platforms
    for (const build of builds) {
        if (buildExecutable(build)) {
            successCount++;
        }
    }

    // Build summary
    const endTime = Date.now();
    const duration = Math.round((endTime - startTime) / 1000);
    
    console.log('🎉 Build Summary:');
    console.log(`✅ Successful builds: ${successCount}/${builds.length}`);
    console.log(`⏱️  Total time: ${duration}s`);
    console.log(`📁 Output directory: ${distDir}\n`);

    if (successCount === builds.length) {
        console.log('🚀 All builds completed successfully!');
        console.log('💡 Usage examples:');
        console.log('   Windows: ./dist/server-console-win.exe');
        console.log('   macOS:   ./dist/server-console-mac');
        console.log('   Linux:   ./dist/server-console-linux');
    } else {
        console.log('⚠️  Some builds failed. Check the output above for details.');
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    main().catch(console.error);
}

module.exports = { buildExecutable, builds };
