
@echo off
cd /d "%~dp0"

if not exist "backend\venv\Scripts\python.exe" (
    echo Please run install.bat first.
    pause
    exit /b 1
)

if not exist "frontend\node_modules" (
    echo Please run install.bat first.
    pause
    exit /b 1
)

echo Starting backend...
start "Exercise Agent Backend" cmd /k "cd /d ""%~dp0backend"" && venv\Scripts\python.exe -m uvicorn main:app --reload"

echo Starting frontend...
start "Exercise Agent Frontend" cmd /k "cd /d ""%~dp0frontend"" && npm run dev"

echo.
echo Open http://localhost:5173 in your browser.
pause
