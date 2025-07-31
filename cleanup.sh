#!/bin/bash

# Server Management Console - Unix/Linux/macOS Cleanup Script
# Removes temporary files, build artifacts, and cleans the project

echo ""
echo "🧹 ============================================="
echo "🧹 Server Management Console - Unix Cleanup"
echo "🧹 ============================================="
echo ""

# Ask for confirmation
read -p "⚠️  This will remove node_modules, dist, logs, and temp files. Continue? (y/N): " confirm
if [[ ! $confirm =~ ^[Yy]([Ee][Ss])?$ ]]; then
    echo "🚫 Cleanup cancelled"
    exit 0
fi

echo ""
echo "🔍 Starting cleanup process..."
echo ""

# Initialize counters
dirs_removed=0
files_removed=0
bytes_freed=0

# Function to get directory size
get_dir_size() {
    if [ -d "$1" ]; then
        if command -v du >/dev/null 2>&1; then
            du -sb "$1" 2>/dev/null | cut -f1
        else
            echo "0"
        fi
    else
        echo "0"
    fi
}

# Function to format bytes
format_bytes() {
    local bytes=$1
    local units=("Bytes" "KB" "MB" "GB" "TB")
    local unit=0
    
    while [ $bytes -ge 1024 ] && [ $unit -lt 4 ]; do
        bytes=$((bytes / 1024))
        unit=$((unit + 1))
    done
    
    echo "$bytes ${units[$unit]}"
}

# Directories to clean
dirs_to_clean=(
    "node_modules"
    "dist"
    "build" 
    "out"
    "logs"
    "temp"
    ".cache"
    ".tmp"
    "coverage"
    ".nyc_output"
)

echo "📁 Cleaning directories..."

for dir in "${dirs_to_clean[@]}"; do
    if [ -d "$dir" ]; then
        echo "🗂️  Removing directory: $dir"
        size=$(get_dir_size "$dir")
        if rm -rf "$dir" 2>/dev/null; then
            dirs_removed=$((dirs_removed + 1))
            bytes_freed=$((bytes_freed + size))
            echo "✅ $dir removed"
        else
            echo "❌ Failed to remove $dir"
        fi
    fi
done

echo ""
echo "📄 Cleaning files..."

# File patterns to clean
file_patterns=(
    "*.log"
    "*.tmp"
    "*.temp" 
    "*.cache"
    "*.pid"
    ".DS_Store"
    "npm-debug.log*"
    "yarn-debug.log*"
    "yarn-error.log*"
    "*.stackdump"
    "*.dmp"
)

for pattern in "${file_patterns[@]}"; do
    # Find and remove files matching pattern
    find . -name "$pattern" -type f 2>/dev/null | while read -r file; do
        if [ -f "$file" ]; then
            echo "📄 Removing file: $file"
            size=$(stat -c%s "$file" 2>/dev/null || echo "0")
            if rm "$file" 2>/dev/null; then
                files_removed=$((files_removed + 1))
                bytes_freed=$((bytes_freed + size))
                echo "✅ $file removed"
            else
                echo "❌ Failed to remove $file"
            fi
        fi
    done
done

echo ""
echo "🧽 Cleaning npm cache..."
if npm cache clean --force >/dev/null 2>&1; then
    echo "✅ npm cache cleaned"
else
    echo "⚠️  npm cache clean failed (this is often normal)"
fi

# Clean git if available
if [ -d ".git" ]; then
    echo ""
    echo "🗂️  Cleaning git garbage..."
    if git gc --prune=now >/dev/null 2>&1; then
        echo "✅ Git garbage collection completed"
    else
        echo "⚠️  Git cleanup failed (this is often normal)"
    fi
fi

# Clean system-specific temporary files
echo ""
echo "🧹 Cleaning system temp files..."

# macOS specific
if [[ "$OSTYPE" == "darwin"* ]]; then
    find . -name ".DS_Store" -type f -delete 2>/dev/null && echo "✅ .DS_Store files removed"
fi

# Linux specific
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    find . -name "*.swp" -type f -delete 2>/dev/null && echo "✅ Vim swap files removed"
    find . -name "*~" -type f -delete 2>/dev/null && echo "✅ Backup files removed"
fi

echo ""
echo "🎉 ====================================="
echo "🎉 Cleanup Summary"
echo "🎉 ====================================="
echo "📁 Directories removed: $dirs_removed"
echo "📄 Files removed: $files_removed"
echo "💾 Space freed: $(format_bytes $bytes_freed)"
echo ""
echo "✨ Cleanup completed!"
echo ""
echo "💡 Next steps:"
echo "   • Run 'npm install' to reinstall dependencies"
echo "   • Run 'npm run build' to rebuild executables"
echo "   • Run 'npm start' to start the server"
echo ""
