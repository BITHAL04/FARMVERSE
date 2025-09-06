"""
Advanced installation script for full FarmVerse features
"""

import subprocess
import sys
import os
from pathlib import Path

def install_advanced_features():
    """Install all dependencies for advanced features"""
    
    print("🚀 Installing FarmVerse Advanced Features")
    print("=" * 50)
    
    try:
        # Check if virtual environment is active
        if not hasattr(sys, 'real_prefix') and not (hasattr(sys, 'base_prefix') and sys.base_prefix != sys.prefix):
            print("⚠️  Virtual environment not detected. Please activate it first:")
            print("   .\\venv\\Scripts\\Activate.ps1")
            return False
        
        # Install core ML/AI packages
        print("📦 Installing AI/ML packages...")
        ai_packages = [
            "openai>=1.3.7",
            "langdetect>=1.0.9",
            "googletrans==4.0.0rc1",
            "pillow>=10.1.0",
            "numpy>=1.25.0"
        ]
        
        for package in ai_packages:
            print(f"   Installing {package}...")
            subprocess.run([sys.executable, "-m", "pip", "install", package], check=True)
        
        # Install voice processing packages
        print("\n🎤 Installing voice processing packages...")
        voice_packages = [
            "gtts>=2.4.0",
            "speechrecognition>=3.10.0",
            "pydub>=0.25.1"
        ]
        
        for package in voice_packages:
            print(f"   Installing {package}...")
            try:
                subprocess.run([sys.executable, "-m", "pip", "install", package], check=True)
            except subprocess.CalledProcessError:
                print(f"   ⚠️  {package} installation failed (may require system dependencies)")
        
        # Install image processing packages
        print("\n📸 Installing image processing packages...")
        image_packages = [
            "opencv-python>=4.8.0",
            "scikit-image>=0.20.0"
        ]
        
        for package in image_packages:
            print(f"   Installing {package}...")
            try:
                subprocess.run([sys.executable, "-m", "pip", "install", package], check=True)
            except subprocess.CalledProcessError:
                print(f"   ⚠️  {package} installation failed (may require system libraries)")
        
        # Install remaining packages
        print("\n📋 Installing remaining packages...")
        other_packages = [
            "python-multipart>=0.0.6",
            "aiofiles>=0.24.0",
            "sqlalchemy>=2.0.0",
            "alembic>=1.12.0"
        ]
        
        for package in other_packages:
            print(f"   Installing {package}...")
            subprocess.run([sys.executable, "-m", "pip", "install", package], check=True)
        
        print("\n✅ All packages installed successfully!")
        
        # Create .env file
        if not os.path.exists(".env"):
            print("\n📝 Creating .env file...")
            with open(".env", "w") as f:
                f.write("""# FarmVerse Configuration
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-3.5-turbo
GOOGLE_APPLICATION_CREDENTIALS=path_to_google_credentials.json
GOOGLE_CLOUD_PROJECT_ID=your_project_id
APP_NAME=FarmVerse Agriculture Chatbot
APP_VERSION=1.0.0
DEBUG=True
HOST=0.0.0.0
PORT=8000
""")
            print("   .env file created. Please update with your API keys.")
        
        print("\n🎉 Advanced installation completed!")
        print("\n📋 Next Steps:")
        print("   1. Update .env file with your API keys")
        print("   2. Run: uvicorn main:app --reload")
        print("   3. Test advanced features at http://localhost:8000/docs")
        
        return True
        
    except subprocess.CalledProcessError as e:
        print(f"❌ Installation failed: {e}")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False

if __name__ == "__main__":
    success = install_advanced_features()
    if not success:
        print("\n💡 You can still use the basic version:")
        print("   python main_simple.py")
    
    input("\nPress Enter to continue...")
