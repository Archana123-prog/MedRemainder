@echo off
title MedRemind - Smart Prescription Manager
color 0A

echo.
echo  ============================================
echo   💊  MedRemind - Smart Prescription Manager
echo  ============================================
echo.
echo  Starting backend and frontend servers...
echo.

:: Check Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo  ❌ Node.js not found! Please install from https://nodejs.org
    pause
    exit /b 1
)

:: Install dependencies if needed
if not exist "backend\node_modules" (
    echo  📦 Installing backend dependencies...
    cd backend && npm install && cd ..
)

if not exist "frontend\node_modules" (
    echo  📦 Installing frontend dependencies...
    cd frontend && npm install && cd ..
)

:: Start backend in new window
echo  🚀 Starting backend on http://localhost:5000
start "MedRemind Backend" cmd /k "cd backend && npm run dev"

:: Wait a moment
timeout /t 3 /nobreak >nul

:: Start frontend in new window
echo  🌐 Starting frontend on http://localhost:5173
start "MedRemind Frontend" cmd /k "cd frontend && npm run dev"

:: Wait then open browser
timeout /t 5 /nobreak >nul
echo.
echo  ✅ MedRemind is running!
echo  📱 Open your browser at: http://localhost:5173
echo.
start http://localhost:5173

pause
