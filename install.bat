@echo off
setlocal DisableDelayedExpansion
cd /d "%~dp0"

echo Checking Python...
python --version || goto error

echo Checking Node.js...
node --version || goto error

echo Checking Gemini API key...
rem Preserve existing settings and add a key only when needed.
powershell -NoProfile -Command "$ErrorActionPreference = 'Stop'; $path = 'backend/.env'; $lines = @(); if (Test-Path -LiteralPath $path) { $lines = @(Get-Content -LiteralPath $path) }; if ($lines -match '^\s*GEMINI_API_KEY\s*=\s*[^\s#]+') { Write-Host 'Existing API key preserved.'; exit 0 }; Write-Host 'Get your Gemini API key at https://aistudio.google.com/apikey'; do { $key = (Read-Host 'Enter your Gemini API key').Trim() } while ($key -notmatch '^[A-Za-z0-9_-]+$'); $lines = @($lines | Where-Object { $_ -notmatch '^\s*GEMINI_API_KEY\s*=' }); $lines += ('GEMINI_API_KEY=' + $key); [System.IO.File]::WriteAllLines((Join-Path (Get-Location).Path $path), [string[]]$lines, (New-Object System.Text.UTF8Encoding($false))); Write-Host 'API key saved locally.'"
if errorlevel 1 goto error

echo Installing backend dependencies...
python -m venv backend\venv
if errorlevel 1 goto error
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
echo Installation failed. Check the error above, your internet connection, and your Python and Node.js installations.
pause
exit /b 1
