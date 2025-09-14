@echo off
echo Starting GoalSchoolApp Web Application
echo ======================================

echo Starting web server on port 3000...
start "" cmd /c "node launch-web-app.js & pause"

timeout /t 3 /nobreak >nul

echo.
echo Now starting Expo development server...
echo Please wait for the Expo server to start...
echo.
start "" cmd /c "npx expo start --web & pause"

echo.
echo Setup complete!
echo ===============
echo 1. Check the first terminal window for the web server (port 3000)
echo 2. Check the second terminal window for Expo development server
echo 3. Open your browser and go to http://localhost:3000
echo.
echo Press any key to exit...
pause >nul