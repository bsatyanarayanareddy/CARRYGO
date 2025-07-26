@echo off
echo CarryGo Development Environment Setup
echo =====================================
echo.

echo Checking if Node.js is installed...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    echo Download the LTS version and run the installer.
    pause
    exit /b 1
)

echo Node.js found!
echo.

echo Installing project dependencies...
npm install

if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies!
    pause
    exit /b 1
)

echo.
echo Setup completed successfully!
echo.
echo ========================================
echo           COMPLETELY FREE SETUP
echo ========================================
echo.
echo ✅ Maps: OpenStreetMap (Leaflet) - 100% FREE
echo ✅ Geocoding: Nominatim - 100% FREE  
echo ✅ Routing: Leaflet Routing Machine - 100% FREE
echo ✅ No API keys required!
echo ✅ No usage limits!
echo.
echo Next steps:
echo 1. Set up Firebase project at https://console.firebase.google.com/
echo 2. Copy .env.example to .env and update with your Firebase config
echo 3. Run 'npm start' to start the development server
echo.
echo 🎉 NO Google Maps API costs - everything is FREE!
echo.
pause
