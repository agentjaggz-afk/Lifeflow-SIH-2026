@echo off
title LifeFlow Platform Launcher
echo ===================================================
echo     Starting LifeFlow Blood Network Platform
echo ===================================================
echo.
if exist "%~dp0Site\package.json" (
    cd /d "%~dp0Site"
) else if exist "%~dp0hospital&ngo\package.json" (
    cd /d "%~dp0hospital&ngo"
) else (
    echo [ERROR] Could not find Site folder with package.json!
    pause
    exit /b 1
)

echo Starting unified platform on http://localhost:5173...
start http://localhost:5173
npm run dev
if %ERRORLEVEL% neq 0 (
    echo.
    echo [!] Server stopped with error code %ERRORLEVEL%.
    pause
)
