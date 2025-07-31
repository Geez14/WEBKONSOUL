# Server Management Console - PowerShell Cleanup Script
# Removes temporary files, build artifacts, and cleans the project

Write-Host ""
Write-Host "Server Management Console - PowerShell Cleanup" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

# Ask for confirmation
$confirm = Read-Host "This will remove node_modules, dist, logs, and temp files. Continue? (y/N)"
if ($confirm -notmatch '^(y|yes)$') {
    Write-Host "Cleanup cancelled" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit
}

Write-Host ""
Write-Host "Starting cleanup process..." -ForegroundColor Green
Write-Host ""

# Initialize counters
$dirsRemoved = 0
$filesRemoved = 0
$bytesFreed = 0

# Function to get directory size
function Get-DirectorySize($path) {
    if (Test-Path $path) {
        try {
            $size = (Get-ChildItem $path -Recurse | Measure-Object -Property Length -Sum).Sum
            if ($null -eq $size) { return 0 }
            return $size
        } catch {
            return 0
        }
    }
    return 0
}

# Function to format bytes
function Format-Bytes($bytes) {
    $sizes = @('Bytes', 'KB', 'MB', 'GB', 'TB')
    $index = 0
    while ($bytes -ge 1024 -and $index -lt $sizes.Length - 1) {
        $bytes = $bytes / 1024
        $index++
    }
    return "{0:N2} {1}" -f $bytes, $sizes[$index]
}

# Directories to clean
$dirsToClean = @(
    'node_modules',
    'dist', 
    'build',
    'out',
    'logs',
    'temp',
    '.cache',
    '.tmp',
    'coverage',
    '.nyc_output'
)

Write-Host "Cleaning directories..." -ForegroundColor Yellow

foreach ($dir in $dirsToClean) {
    if (Test-Path $dir) {
        Write-Host "Removing directory: $dir" -ForegroundColor Gray
        $size = Get-DirectorySize $dir
        try {
            Remove-Item $dir -Recurse -Force -ErrorAction Stop
            $dirsRemoved++
            $bytesFreed += $size
            Write-Host "✓ $dir removed" -ForegroundColor Green
        } catch {
            Write-Host "✗ Failed to remove $dir`: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
}

Write-Host ""
Write-Host "Cleaning files..." -ForegroundColor Yellow

# File patterns to clean
$filePatterns = @(
    '*.log',
    '*.tmp', 
    '*.temp',
    '*.cache',
    '*.pid',
    'Thumbs.db',
    'desktop.ini',
    '.DS_Store',
    'npm-debug.log*',
    'yarn-debug.log*',
    'yarn-error.log*',
    '*.stackdump',
    '*.dmp'
)

foreach ($pattern in $filePatterns) {
    $files = Get-ChildItem -Path . -Name $pattern -Recurse -ErrorAction SilentlyContinue
    foreach ($file in $files) {
        if (Test-Path $file) {
            Write-Host "Removing file: $file" -ForegroundColor Gray
            try {
                $size = (Get-Item $file).Length
                Remove-Item $file -Force -ErrorAction Stop
                $filesRemoved++
                $bytesFreed += $size
                Write-Host "✓ $file removed" -ForegroundColor Green
            } catch {
                Write-Host "✗ Failed to remove $file`: $($_.Exception.Message)" -ForegroundColor Red
            }
        }
    }
}

Write-Host ""
Write-Host "Cleaning npm cache..." -ForegroundColor Yellow
try {
    & npm cache clean --force 2>$null
    Write-Host "✓ npm cache cleaned" -ForegroundColor Green
} catch {
    Write-Host "⚠ npm cache clean failed (this is often normal)" -ForegroundColor Yellow
}

# Clean git if available
if (Test-Path '.git') {
    Write-Host ""
    Write-Host "Cleaning git garbage..." -ForegroundColor Yellow
    try {
        & git gc --prune=now 2>$null
        Write-Host "✓ Git garbage collection completed" -ForegroundColor Green
    } catch {
        Write-Host "⚠ Git cleanup failed (this is often normal)" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Cleanup Summary" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Directories removed: $dirsRemoved" -ForegroundColor White
Write-Host "Files removed: $filesRemoved" -ForegroundColor White
Write-Host "Space freed: $(Format-Bytes $bytesFreed)" -ForegroundColor White
Write-Host ""
Write-Host "Cleanup completed!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  • Run 'npm install' to reinstall dependencies" -ForegroundColor Gray
Write-Host "  • Run 'npm run build' to rebuild executables" -ForegroundColor Gray
Write-Host "  • Run 'npm start' to start the server" -ForegroundColor Gray
Write-Host ""
Read-Host "Press Enter to exit"
