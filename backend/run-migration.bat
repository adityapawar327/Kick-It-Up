@echo off
echo ========================================
echo Running Database Migration for XAMPP
echo ========================================
echo.
echo This will update the image_url column to support Base64 images
echo.

REM Try common XAMPP MySQL paths
set MYSQL_PATH=C:\xampp\mysql\bin\mysql.exe

if not exist "%MYSQL_PATH%" (
    set MYSQL_PATH=C:\XAMPP\mysql\bin\mysql.exe
)

if not exist "%MYSQL_PATH%" (
    echo ERROR: MySQL not found in XAMPP directory!
    echo Please update MYSQL_PATH in this script to your XAMPP MySQL location.
    pause
    exit /b 1
)

echo Using MySQL at: %MYSQL_PATH%
echo.

"%MYSQL_PATH%" -u root sneaker_store < src\main\resources\migration-update-image-column.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo Migration completed successfully!
    echo The database can now store Base64 images.
    echo ========================================
) else (
    echo.
    echo ========================================
    echo Migration failed! Please check the error above.
    echo ========================================
    echo.
    echo Common issues:
    echo - XAMPP MySQL is not running
    echo - Database 'sneaker_marketplace' does not exist
    echo - MySQL path is incorrect
)

echo.
pause
