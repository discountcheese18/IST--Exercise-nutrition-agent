
@echo off
cd /d "%~dp0"

echo Checking Python...
python --version || goto error

echo Checking Node.js...
node --version || goto error

echo Installing backend dependencies...
python -m venv backend\venv
call backend\venv\Scripts\python.exe -m pip install -r backend\requirements.txt
if errorlevel 1 goto error

echo Installing frontend dependencies...
cd frontend
call npm install
if errorlevel 1 goto error

echo.
echo Installation complete!
pause
exit /b 0

:error
echo.
echo Installation failed. Check that Python and Node.js are installed.
pause
exit /b 1
