# Start FarmVerse Backend Detached
# This script starts the backend server in the background

$venvPath = ".\.venv\Scripts\Activate.ps1"
$pythonCmd = "uvicorn main:app --host 127.0.0.1 --port 8789 --log-level info"

# Activate venv and start uvicorn detached
Start-Process powershell -ArgumentList "-NoExit", "-Command", "& '$venvPath'; $pythonCmd" -WindowStyle Hidden

Write-Host "Backend started detached on http://127.0.0.1:8789"
