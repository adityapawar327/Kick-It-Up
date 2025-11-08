@echo off
echo ========================================
echo   Sneaker Store - Stopping Application
echo ========================================
echo.

echo Stopping backend server...
taskkill /FI "WINDOWTITLE eq Sneaker Store Backend*" /F > nul 2>&1
echo Backend stopped ✓

echo Stopping frontend server...
taskkill /FI "WINDOWTITLE eq Sneaker Store Frontend*" /F > nul 2>&1
echo Frontend stopped ✓

echo.
echo ========================================
echo   Application Stopped Successfully!
echo ========================================
echo.
pause
