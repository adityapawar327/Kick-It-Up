@echo off
echo ========================================
echo   Sneaker Store - Starting Application
echo ========================================
echo.

REM Check if MySQL is running
echo [1/4] Checking MySQL...
netstat -an | find "3306" > nul
if errorlevel 1 (
    echo ERROR: MySQL is not running!
    echo Please start XAMPP MySQL and try again.
    pause
    exit /b 1
)
echo MySQL is running ✓
echo.

REM Initialize database
echo [2/4] Initializing database...
cd backend
call init-database.bat
cd ..
echo.

REM Start backend
echo [3/4] Starting backend server...
start "Sneaker Store Backend" cmd /k "cd backend && gradlew.bat bootRun"
echo Waiting for backend to start...
timeout /t 10 /nobreak > nul
echo Backend started ✓
echo.

REM Start frontend
echo [4/4] Starting frontend server...
start "Sneaker Store Frontend" cmd /k "cd frontend && npm run dev"
echo Frontend started ✓
echo.

echo ========================================
echo   Application Started Successfully!
echo ========================================
echo.
echo Backend:  http://localhost:8080
echo Frontend: http://localhost:3000
echo.
echo Open your browser and go to:
echo http://localhost:3000
echo.
echo Press any key to open the application...
pause > nul
start http://localhost:3000
