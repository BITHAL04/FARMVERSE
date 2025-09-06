@echo off
REM FarmVerse Agriculture Chatbot Setup Script for Windows
REM This script sets up the development environment on Windows

echo Setting up FarmVerse Agriculture Chatbot...

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python is not installed or not in PATH.
    echo Please install Python 3.8 or higher from https://python.org
    pause
    exit /b 1
)

REM Show Python version
echo Python version:
python --version

REM Create virtual environment
echo Creating virtual environment...
python -m venv venv

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Upgrade pip
echo Upgrading pip...
python -m pip install --upgrade pip

REM Install requirements
echo Installing Python dependencies...
pip install -r requirements.txt

REM Install development dependencies
echo Installing development dependencies...
pip install -r test-requirements.txt

REM Create .env file if it doesn't exist
if not exist .env (
    echo Creating .env file...
    copy .env.example .env
    echo Please update the .env file with your API keys and configuration.
)

REM Create necessary directories
echo Creating directories...
if not exist logs mkdir logs
if not exist static\audio mkdir static\audio
if not exist static\images mkdir static\images

echo.
echo Setup completed successfully!
echo.
echo Next steps:
echo 1. Update the .env file with your API keys:
echo    - OPENAI_API_KEY: Your OpenAI API key
echo    - GOOGLE_APPLICATION_CREDENTIALS: Path to Google Cloud credentials
echo    - GOOGLE_CLOUD_PROJECT_ID: Your Google Cloud project ID
echo.
echo 2. Activate the virtual environment:
echo    venv\Scripts\activate
echo.
echo 3. Run the application:
echo    uvicorn main:app --reload
echo.
echo 4. Visit http://localhost:8000/docs for API documentation
echo.
echo For testing, run: pytest tests/ -v
echo.
pause
