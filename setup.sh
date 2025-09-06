#!/bin/bash

# FarmVerse Agriculture Chatbot Setup Script
# This script sets up the development environment

echo "Setting up FarmVerse Agriculture Chatbot..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Error: Python 3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi

# Check Python version
python_version=$(python3 -c 'import sys; print(".".join(map(str, sys.version_info[:2])))')
echo "Python version: $python_version"

# Create virtual environment
echo "Creating virtual environment..."
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Upgrade pip
echo "Upgrading pip..."
pip install --upgrade pip

# Install requirements
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Install development dependencies
echo "Installing development dependencies..."
pip install -r test-requirements.txt

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo "Please update the .env file with your API keys and configuration."
fi

# Create necessary directories
echo "Creating directories..."
mkdir -p logs
mkdir -p static/audio
mkdir -p static/images

# Set permissions
chmod 755 static/audio
chmod 755 static/images

echo ""
echo "Setup completed successfully!"
echo ""
echo "Next steps:"
echo "1. Update the .env file with your API keys:"
echo "   - OPENAI_API_KEY: Your OpenAI API key"
echo "   - GOOGLE_APPLICATION_CREDENTIALS: Path to Google Cloud credentials"
echo "   - GOOGLE_CLOUD_PROJECT_ID: Your Google Cloud project ID"
echo ""
echo "2. Activate the virtual environment:"
echo "   source venv/bin/activate"
echo ""
echo "3. Run the application:"
echo "   uvicorn main:app --reload"
echo ""
echo "4. Visit http://localhost:8000/docs for API documentation"
echo ""
echo "For testing, run: pytest tests/ -v"
