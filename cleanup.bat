@echo off
REM Server Management Console - Windows Cleanup Script
REM Removes temporary files, build artifacts, and cleans the project

echo.
echo 🧹 ============================================
echo 🧹 Server Management Console - Windows Cleanup
echo 🧹 ============================================
echo.

REM Ask for confirmation
set /p confirm="⚠️  This will remove node_modules, dist, logs, and temp files. Continue? (y/N): "
if /i not "%confirm%"=="y" if /i not "%confirm%"=="yes" (
    echo 🚫 Cleanup cancelled
    pause
    exit /b 0
)

echo.
echo 🔍 Starting cleanup process...
echo.

REM Initialize counters
set /a dirs_removed=0
set /a files_removed=0

REM Remove directories
echo 📁 Cleaning directories...

if exist "node_modules" (
    echo 🗂️  Removing node_modules...
    rmdir /s /q "node_modules" 2>nul
    if not exist "node_modules" (
        set /a dirs_removed+=1
        echo ✅ node_modules removed
    ) else (
        echo ❌ Failed to remove node_modules
    )
)

if exist "dist" (
    echo 🗂️  Removing dist...
    rmdir /s /q "dist" 2>nul
    if not exist "dist" (
        set /a dirs_removed+=1
        echo ✅ dist removed
    )
)

if exist "build" (
    echo 🗂️  Removing build...
    rmdir /s /q "build" 2>nul
    if not exist "build" (
        set /a dirs_removed+=1
        echo ✅ build removed
    )
)

if exist "logs" (
    echo 🗂️  Removing logs...
    rmdir /s /q "logs" 2>nul
    if not exist "logs" (
        set /a dirs_removed+=1
        echo ✅ logs removed
    )
)

if exist ".cache" (
    echo 🗂️  Removing .cache...
    rmdir /s /q ".cache" 2>nul
    if not exist ".cache" (
        set /a dirs_removed+=1
        echo ✅ .cache removed
    )
)

if exist "temp" (
    echo 🗂️  Removing temp...
    rmdir /s /q "temp" 2>nul
    if not exist "temp" (
        set /a dirs_removed+=1
        echo ✅ temp removed
    )
)

if exist "coverage" (
    echo 🗂️  Removing coverage...
    rmdir /s /q "coverage" 2>nul
    if not exist "coverage" (
        set /a dirs_removed+=1
        echo ✅ coverage removed
    )
)

echo.
echo 📄 Cleaning files...

REM Remove log files
for %%f in (*.log) do (
    echo 📄 Removing %%f
    del "%%f" 2>nul
    if not exist "%%f" set /a files_removed+=1
)

REM Remove temporary files
for %%f in (*.tmp *.temp *.cache) do (
    echo 📄 Removing %%f
    del "%%f" 2>nul
    if not exist "%%f" set /a files_removed+=1
)

REM Remove Windows specific files
for %%f in (Thumbs.db desktop.ini) do (
    if exist "%%f" (
        echo 📄 Removing %%f
        del "%%f" 2>nul
        if not exist "%%f" set /a files_removed+=1
    )
)

REM Remove npm debug files
for %%f in (npm-debug.log* yarn-debug.log* yarn-error.log*) do (
    if exist "%%f" (
        echo 📄 Removing %%f
        del "%%f" 2>nul
        if not exist "%%f" set /a files_removed+=1
    )
)

REM Remove process files
for %%f in (*.pid) do (
    if exist "%%f" (
        echo 📄 Removing %%f
        del "%%f" 2>nul
        if not exist "%%f" set /a files_removed+=1
    )
)

echo.
echo 🧽 Cleaning npm cache...
npm cache clean --force >nul 2>&1
if %errorlevel%==0 (
    echo ✅ npm cache cleaned
) else (
    echo ⚠️  npm cache clean failed ^(this is often normal^)
)

echo.
echo 🎉 ====================================
echo 🎉 Cleanup Summary
echo 🎉 ====================================
echo 📁 Directories removed: %dirs_removed%
echo 📄 Files removed: %files_removed%
echo.
echo ✨ Cleanup completed!
echo.
echo 💡 Next steps:
echo    • Run "npm install" to reinstall dependencies
echo    • Run "npm run build" to rebuild executables
echo    • Run "npm start" to start the server
echo.
pause
