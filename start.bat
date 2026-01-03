@echo off
REM Explore Ida - Start Script for Windows
REM This script starts the development environment

echo.
echo ========================================
echo   Starting Explore Ida Dev Environment
echo ========================================
echo.

REM Check if .env files exist
if not exist "backend\.env" (
    echo [ERROR] backend\.env not found!
    echo Copying from .env.example...
    copy backend\.env.example backend\.env
    echo [WARNING] Please edit backend\.env with your API keys
    echo.
)

if not exist "frontend\.env" (
    echo [ERROR] frontend\.env not found!
    echo Copying from .env.example...
    copy frontend\.env.example frontend\.env
    echo.
)

REM Start Backend
echo [INFO] Starting Backend...
cd backend

if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

call venv\Scripts\activate.bat

echo Installing backend dependencies...
pip install -r requirements.txt >nul 2>&1

echo [SUCCESS] Starting FastAPI server on http://localhost:8000
start /B cmd /c "uvicorn app.main:app --reload --port 8000 > backend.log 2>&1"

REM Start Frontend
cd ..\frontend
echo [INFO] Starting Frontend...

if not exist "node_modules" (
    echo Installing frontend dependencies...
    npm install >nul 2>&1
)

echo [SUCCESS] Starting React app on http://localhost:5173
start /B cmd /c "npm run dev > frontend.log 2>&1"

REM Wait for servers to start
timeout /t 5 /nobreak >nul

echo.
echo ========================================
echo   Explore Ida is running!
echo ========================================
echo.
echo Frontend:  http://localhost:5173
echo Backend:   http://localhost:8000
echo API Docs:  http://localhost:8000/docs
echo.
echo Press Ctrl+C to stop all servers
echo.

REM Keep window open
pause
