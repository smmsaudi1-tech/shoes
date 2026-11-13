@echo off
title YOUSSEF - Push to GitHub
cd /d "%~dp0"

echo.
echo ====================================================
echo        YOUSSEF - PUSH PROJECT TO GITHUB
echo ====================================================
echo  Repo: https://github.com/smmsaudi1-tech/shoes.git
echo.

where git >nul 2>nul
if errorlevel 1 (
    echo [!] Error: Git is not installed or not in PATH.
    echo     Download Git from https://git-scm.com/
    pause
    exit /b 1
)

if not exist ".git\" (
    echo [*] Initializing Git repository...
    git init
    git branch -M main
)

git remote get-url origin >nul 2>nul
if errorlevel 1 (
    echo [*] Adding remote origin...
    git remote add origin https://github.com/smmsaudi1-tech/shoes.git
) else (
    echo [*] Updating remote origin...
    git remote set-url origin https://github.com/smmsaudi1-tech/shoes.git
)

echo.
echo [*] Staging files...
git add .

set "COMMIT_MSG="
set /p COMMIT_MSG="[?] Enter commit message (or press Enter for default): "
if "%COMMIT_MSG%"=="" set "COMMIT_MSG=Update YOUSSEF Footwear Studio"

echo.
echo [*] Committing changes...
git commit -m "%COMMIT_MSG%"

echo.
echo [*] Pushing to GitHub (select your GitHub account if prompted)...
git push -u origin main

if errorlevel 1 (
    echo.
    echo [!] Push failed. If the repo already has commits on GitHub,
    echo     try pulling first or check your GitHub account permissions.
    pause
    exit /b 1
)

echo.
echo [+] Successfully pushed to https://github.com/smmsaudi1-tech/shoes.git
echo.
pause
