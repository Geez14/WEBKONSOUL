#!/usr/bin/env node

/**
 * Cleanup Script for Server Management Console
 * Removes temporary files, build artifacts, logs, and other unnecessary files
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🧹 ====================================');
console.log('🧹 Server Management Console - Cleanup');
console.log('🧹 ====================================\n');

// Configuration
const config = {
    // Directories to clean (will be removed entirely)
    dirsToClean: [
        'node_modules',
        'dist',
        'build',
        'out',
        '.cache',
        '.tmp',
        'temp',
        'logs',
        '.nyc_output',
        'coverage',
        '.vscode/settings.json'
    ],
    
    // File patterns to delete
    filesToClean: [
        '*.log',
        '*.tmp',
        '*.temp',
        '*.cache',
        '*.pid',
        '*.lock',
        '.DS_Store',
        'Thumbs.db',
        'desktop.ini',
        '*.stackdump',
        '*.dmp',
        'npm-debug.log*',
        'yarn-debug.log*',
        'yarn-error.log*',
        'lerna-debug.log*',
        '.npm',
        '.eslintcache',
        '.stylelintcache',
        '*.tsbuildinfo',
        '.env.local',
        '.env.development.local',
        '.env.test.local',
        '.env.production.local'
    ],
    
    // Files to keep (even if they match patterns above)
    keepFiles: [
        'package-lock.json',
        '.env.example',
        '.gitignore',
        '.gitkeep'
    ]
};

// Statistics
let stats = {
    dirsRemoved: 0,
    filesRemoved: 0,
    bytesFreed: 0,
    errors: 0
};

/**
 * Get file size safely
 */
function getFileSize(filePath) {
    try {
        return fs.statSync(filePath).size;
    } catch (error) {
        return 0;
    }
}

/**
 * Get directory size recursively
 */
function getDirSize(dirPath) {
    let size = 0;
    try {
        const files = fs.readdirSync(dirPath);
        for (const file of files) {
            const filePath = path.join(dirPath, file);
            const stat = fs.statSync(filePath);
            if (stat.isDirectory()) {
                size += getDirSize(filePath);
            } else {
                size += stat.size;
            }
        }
    } catch (error) {
        // Directory might not exist or be inaccessible
    }
    return size;
}

/**
 * Remove directory recursively
 */
function removeDir(dirPath) {
    try {
        if (fs.existsSync(dirPath)) {
            const size = getDirSize(dirPath);
            fs.rmSync(dirPath, { recursive: true, force: true });
            console.log(`🗂️  Removed directory: ${dirPath}`);
            stats.dirsRemoved++;
            stats.bytesFreed += size;
            return true;
        }
    } catch (error) {
        console.error(`❌ Failed to remove directory ${dirPath}:`, error.message);
        stats.errors++;
        return false;
    }
    return false;
}

/**
 * Remove file
 */
function removeFile(filePath) {
    try {
        if (fs.existsSync(filePath)) {
            const size = getFileSize(filePath);
            fs.unlinkSync(filePath);
            console.log(`📄 Removed file: ${filePath}`);
            stats.filesRemoved++;
            stats.bytesFreed += size;
            return true;
        }
    } catch (error) {
        console.error(`❌ Failed to remove file ${filePath}:`, error.message);
        stats.errors++;
        return false;
    }
    return false;
}

/**
 * Find files matching pattern
 */
function findFiles(pattern, dir = '.') {
    const files = [];
    try {
        const items = fs.readdirSync(dir);
        for (const item of items) {
            const itemPath = path.join(dir, item);
            const stat = fs.statSync(itemPath);
            
            if (stat.isDirectory() && !config.dirsToClean.includes(item)) {
                // Recursively search subdirectories (except ones we're going to delete)
                files.push(...findFiles(pattern, itemPath));
            } else if (stat.isFile()) {
                // Check if file matches pattern
                const regex = new RegExp(pattern.replace(/\*/g, '.*'));
                if (regex.test(item) && !config.keepFiles.includes(item)) {
                    files.push(itemPath);
                }
            }
        }
    } catch (error) {
        // Directory might not be accessible
    }
    return files;
}

/**
 * Format bytes to human readable
 */
function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Clean npm cache
 */
function cleanNpmCache() {
    try {
        console.log('🧽 Cleaning npm cache...');
        execSync('npm cache clean --force', { stdio: 'pipe' });
        console.log('✅ npm cache cleaned');
    } catch (error) {
        console.log('⚠️  npm cache clean failed (this is often normal)');
    }
}

/**
 * Main cleanup function
 */
function cleanup() {
    const startTime = Date.now();
    
    console.log('🔍 Scanning for files to clean...\n');
    
    // Clean directories
    console.log('📁 Cleaning directories...');
    for (const dir of config.dirsToClean) {
        if (removeDir(dir)) {
            // Directory was removed
        }
    }
    
    // Clean files by pattern
    console.log('\n📄 Cleaning files...');
    for (const pattern of config.filesToClean) {
        const files = findFiles(pattern);
        for (const file of files) {
            removeFile(file);
        }
    }
    
    // Clean npm cache
    console.log('\n🧽 Cleaning caches...');
    cleanNpmCache();
    
    // Clean git if it exists
    if (fs.existsSync('.git')) {
        try {
            console.log('🗂️  Cleaning git garbage...');
            execSync('git gc --prune=now', { stdio: 'pipe' });
            console.log('✅ Git garbage collection completed');
        } catch (error) {
            console.log('⚠️  Git cleanup failed (this is often normal)');
        }
    }
    
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;
    
    // Show summary
    console.log('\n🎉 ====================================');
    console.log('🎉 Cleanup Summary');
    console.log('🎉 ====================================');
    console.log(`📁 Directories removed: ${stats.dirsRemoved}`);
    console.log(`📄 Files removed: ${stats.filesRemoved}`);
    console.log(`💾 Space freed: ${formatBytes(stats.bytesFreed)}`);
    console.log(`❌ Errors: ${stats.errors}`);
    console.log(`⏱️  Time taken: ${duration.toFixed(2)}s`);
    
    if (stats.errors > 0) {
        console.log('\n⚠️  Some files could not be removed (they might be in use)');
    }
    
    console.log('\n✨ Cleanup completed!');
    
    // Suggestions
    console.log('\n💡 Next steps:');
    console.log('   • Run "npm install" to reinstall dependencies');
    console.log('   • Run "npm run build" to rebuild executables');
    console.log('   • Check git status with "git status"');
}

// Run cleanup if called directly
if (require.main === module) {
    // Ask for confirmation
    const readline = require('readline');
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    
    rl.question('⚠️  This will remove node_modules, dist, logs, and temporary files. Continue? (y/N): ', (answer) => {
        if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
            cleanup();
        } else {
            console.log('🚫 Cleanup cancelled');
        }
        rl.close();
    });
}

module.exports = { cleanup, config, stats };
