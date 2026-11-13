@echo off
title YOUSSEF Footwear Localhost
cd /d "%~dp0"

echo.
echo ====================================================
echo        YOUSSEF - FORM, LIT FROM WITHIN
echo ====================================================
echo.
echo [*] Starting server on http://localhost:3000 ...
echo [*] Opening default browser...
echo.

start "" "http://localhost:3000"

call npm run dev

if errorlevel 1 (
    echo.
    echo [!] Server encountered an error.
    pause
)
