@echo off
REM 🚀 Quick Deployment Script for Explore Ida (Windows)

echo 🚀 Deploying Explore Ida...
echo.

REM Check if git is initialized
if not exist .git (
    echo ❌ Git not initialized. Run: git init
    exit /b 1
)

REM Check for uncommitted changes
git status --short > nul 2>&1
if %errorlevel% equ 0 (
    echo 📝 Checking for uncommitted changes...
    git add .
    set /p commit_msg="Enter commit message: "
    git commit -m "%commit_msg%"
)

REM Push to GitHub
echo 📤 Pushing to GitHub...
git push origin main

echo.
echo ✅ Code pushed to GitHub!
echo.
echo 📋 Next Steps:
echo.
echo 1. Deploy Backend to Render:
echo    → Visit: https://render.com
echo    → New Web Service → Connect your repo
echo    → Root directory: backend
echo    → Add environment variables (see DEPLOYMENT.md)
echo.
echo 2. Deploy Frontend to Vercel:
echo    → Visit: https://vercel.com
echo    → Import your repo
echo    → Root directory: frontend
echo    → Add VITE_API_BASE_URL env var
echo.
echo 📚 Full instructions: See DEPLOYMENT.md
echo.
echo 🎉 Happy deploying!
pause
