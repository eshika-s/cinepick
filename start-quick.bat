@echo off
echo Starting YMovies with MongoDB Atlas...
echo.

echo [1/2] Starting Backend...
cd backend
start "Backend" cmd /k "npm run dev"
timeout /t 3 /nobreak > nul

echo [2/2] Starting Frontend...
cd ..
start "Frontend" cmd /k "npm run dev"
timeout /t 2 /nobreak > nul

echo.
echo ✅ Started! Backend will auto-connect to MongoDB Atlas
echo Frontend: http://localhost:3005
echo Backend:  http://localhost:5000
start http://localhost:3005
