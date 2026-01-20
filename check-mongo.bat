@echo off
echo Checking MongoDB Connection...
echo.

echo Testing MongoDB Atlas connection...
cd backend
node -e "
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://smakhija140_db_user:Vof2Dh3HvkV4wMHo@cluster0.5vcicdf.mongodb.net/movie-recommendar?retryWrites=true&w=majority')
  .then(() => {
    console.log('✅ MongoDB Atlas connection successful!');
    process.exit(0);
  })
  .catch((err) => {
    console.log('❌ MongoDB Atlas connection failed:', err.message);
    console.log('💡 Make sure your IP is whitelisted in MongoDB Atlas');
    process.exit(1);
  });
"

if %errorlevel% equ 0 (
    echo.
    echo ✅ MongoDB is ready! You can start the application.
    echo.
    set /p continue="Start the application now? (y/n): "
    if /i "%continue%"=="y" (
        cd ..
        call start-quick.bat
    )
) else (
    echo.
    echo ❌ Please fix MongoDB connection before starting the application.
    echo.
    echo 🔧 Steps to fix:
    echo   1. Go to https://cloud.mongodb.com/
    echo   2. Navigate to Network Access
    echo   3. Add your current IP address
    echo   4. Wait 2-3 minutes for changes
    echo.
    pause
)
