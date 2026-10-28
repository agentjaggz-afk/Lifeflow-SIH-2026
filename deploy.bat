@echo off
title LifeFlow Cloudflare Deployment
echo =====================================================
echo    Deploying LifeFlow to https://lifeflow.lifeflow-hub.workers.dev/
echo =====================================================
echo.
cd /d "%~dp0"
echo [1/2] Building latest optimized assets...
call npm run build
if %ERRORLEVEL% neq 0 (
    echo.
    echo [ERROR] Build failed!
    pause
    exit /b 1
)

echo.
echo [2/2] Uploading to Cloudflare Workers...
call npx wrangler deploy
if %ERRORLEVEL% neq 0 (
    echo.
    echo [NOTE] If prompted to log in, complete the browser login and re-run deploy.
    pause
    exit /b 1
)

echo.
echo =====================================================
echo    Successfully deployed to https://lifeflow.lifeflow-hub.workers.dev/!
echo =====================================================
pause
