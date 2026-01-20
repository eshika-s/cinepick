@echo off
echo Starting YMovies Development Environment...
echo.

echo [1/3] Starting Backend Server...
cd backend
start "Backend Server" cmd /k "npm run dev"
timeout /t 3 /nobreak > nul

echo [2/3] Starting Frontend Server...
cd ..
start "Frontend Server" cmd /k "npm run dev"
timeout /t 2 /nobreak > nul

echo [3/3] Opening Browser...
start http://localhost:3005

echo.
echo ✅ All servers started!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3005
echo.
echo Press any key to exit...
pause > nul
