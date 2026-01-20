@echo off
title YMovies Development Environment
color 0A
echo.
echo ========================================
echo    YMovies Development Environment
echo ========================================
echo.

echo [1/4] Checking MongoDB Connection...
echo.

:: Check if MongoDB is installed locally
mongod --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ MongoDB is installed locally
    echo.
    set /p choice="Do you want to start local MongoDB? (y/n): "
    if /i "%choice%"=="y" (
        echo 🚀 Starting local MongoDB...
        start "MongoDB" cmd /k "mongod --dbpath C:\data\db"
        timeout /t 3 /nobreak > nul
        echo ✅ Local MongoDB started
    ) else (
        echo 📡 Using MongoDB Atlas (cloud)
    )
) else (
    echo 📡 MongoDB not found locally, using MongoDB Atlas
)

echo.
echo [2/4] Starting Backend Server...
cd backend
start "Backend Server" cmd /k "echo 🚀 Starting Backend... && npm run dev"
timeout /t 5 /nobreak > nul

echo.
echo [3/4] Starting Frontend Server...
cd ..
start "Frontend Server" cmd /k "echo 🚀 Starting Frontend... && npm run dev"
timeout /t 3 /nobreak > nul

echo.
echo [4/4] Opening Browser...
start http://localhost:3005

echo.
echo ========================================
echo ✅ All Services Started Successfully!
echo ========================================
echo.
echo 📍 URLs:
echo    Frontend: http://localhost:3005
echo    Backend:  http://localhost:5000
echo.
echo 💡 Tips:
echo    - Backend will auto-connect to MongoDB Atlas
echo    - If using local MongoDB, ensure it's running
echo    - Check console for connection status
echo.
echo Press any key to exit...
pause > nul
