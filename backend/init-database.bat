@echo off
echo ========================================
echo Sneaker Store Database Initialization
echo ========================================
echo.

REM Check if MySQL is running
echo Checking if MySQL is running...
netstat -an | find "3306" > nul
if errorlevel 1 (
    echo ERROR: MySQL is not running on port 3306
    echo Please start XAMPP MySQL and try again
    pause
    exit /b 1
)
echo MySQL is running!
echo.

REM Set MySQL path (adjust if your XAMPP is installed elsewhere)
set MYSQL_PATH=C:\xampp\mysql\bin\mysql.exe

if not exist "%MYSQL_PATH%" (
    echo ERROR: MySQL not found at %MYSQL_PATH%
    echo Please update the MYSQL_PATH in this script
    pause
    exit /b 1
)

echo Creating database and tables...
echo.

REM Execute SQL commands
"%MYSQL_PATH%" -u root -e "CREATE DATABASE IF NOT EXISTS sneaker_store;"
if errorlevel 1 (
    echo ERROR: Failed to create database
    pause
    exit /b 1
)

"%MYSQL_PATH%" -u root sneaker_store < src\main\resources\schema.sql
if errorlevel 1 (
    echo ERROR: Failed to create tables
    pause
    exit /b 1
)

echo.
echo ========================================
echo SUCCESS! Database initialized
echo ========================================
echo.
echo Database: sneaker_store
echo Tables created:
echo   - users
echo   - user_roles
echo   - sneakers
echo   - sneaker_images
echo   - orders
echo   - favorites
echo   - reviews
echo.
echo You can now start the application!
echo.
pause
