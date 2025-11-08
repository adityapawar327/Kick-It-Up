@echo off
echo ========================================
echo Loading Sample Sneaker Data
echo ========================================
echo.

set MYSQL_PATH=C:\xampp\mysql\bin\mysql.exe

if not exist "%MYSQL_PATH%" (
    echo ERROR: MySQL not found at %MYSQL_PATH%
    pause
    exit /b 1
)

echo Loading sample data...
"%MYSQL_PATH%" -u root sneaker_store < src\main\resources\data.sql

if errorlevel 1 (
    echo ERROR: Failed to load data
    pause
    exit /b 1
)

echo.
echo ========================================
echo SUCCESS! Sample data loaded
echo ========================================
echo.
echo Loaded:
echo   - 4 sample users
echo   - 40+ sneakers from top brands
echo   - Sample images
echo.
echo You can now browse sneakers!
echo.
pause
