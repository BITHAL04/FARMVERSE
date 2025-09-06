#!/usr/bin/env python3
"""
FarmVerse Application Runner
This script initializes the database and starts the FastAPI server
"""

import os
import sys
import subprocess
from pathlib import Path

def setup_database():
    """Initialize the database with tables"""
    print("🗄️  Setting up database...")
    try:
        from app.database.database import engine, Base
        from app.database.models import User, SoilTest, FarmField, CropPlan, WeatherAlert, InputSupplier, ExpertConsultation, InsurancePolicy, MarketPrice, Badge, UserBadge
        
        # Create all tables
        Base.metadata.create_all(bind=engine)
        print("✅ Database tables created successfully!")
        
        # Add some sample data
        from sqlalchemy.orm import sessionmaker
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        db = SessionLocal()
        
        # Check if we already have sample data
        # Skip weather alerts seeding if model has user_id NOT NULL constraint issues in some environments
        try:
            if not db.query(WeatherAlert).first():
                sample_alerts = [
                    WeatherAlert(
                        title="Heavy Rain Alert",
                        severity="high",
                        message="Heavy rainfall expected in the next 24 hours. Ensure proper drainage."
                    ),
                    WeatherAlert(
                        title="High Temperature Warning",
                        severity="medium",
                        message="Temperature may exceed 35°C. Increase irrigation frequency."
                    )
                ]
                for alert in sample_alerts:
                    db.add(alert)
        except Exception as e:
            print(f"⚠️  Skipping weather alerts seed: {e}")
        
        # Add sample badges
        if not db.query(Badge).first():
            sample_badges = [
                Badge(code="FIRST_SOIL_TEST", name="Soil Expert", description="Completed first soil test"),
                Badge(code="FIELD_MAPPER", name="Field Mapper", description="Tagged first farm field"),
                Badge(code="CROP_PLANNER", name="Smart Farmer", description="Created first crop plan"),
                Badge(code="MARKET_SAVVY", name="Market Savvy", description="Listed produce for sale")
            ]
            for badge in sample_badges:
                db.add(badge)
        
        try:
            db.commit()
            print("✅ Sample data added successfully!")
        except Exception as e:
            db.rollback()
            print(f"⚠️  Sample data already exists or error occurred: {e}")
        finally:
            db.close()
            
    except Exception as e:
        print(f"❌ Database setup failed: {e}")
        return False
    
    return True

def check_requirements():
    """Check if required packages are installed"""
    print("📦 Checking requirements...")
    
    required_packages = [
        'fastapi', 'uvicorn', 'sqlalchemy', 'python-multipart', 
        'python-dotenv', 'pydantic', 'bcrypt'
    ]
    
    missing_packages = []
    
    for package in required_packages:
        try:
            __import__(package.replace('-', '_'))
        except ImportError:
            missing_packages.append(package)
    
    if missing_packages:
        print(f"❌ Missing packages: {', '.join(missing_packages)}")
        print("Installing missing packages...")
        try:
            subprocess.check_call([sys.executable, '-m', 'pip', 'install'] + missing_packages)
            print("✅ Packages installed successfully!")
        except subprocess.CalledProcessError as e:
            print(f"❌ Failed to install packages: {e}")
            return False
    else:
        print("✅ All required packages are installed!")
    
    return True

def start_server():
    """Start the FastAPI server without auto-reload (stability for Windows)"""
    print("🚀 Starting FarmVerse server (no reload)...")

    port = os.getenv("BACKEND_PORT", "8789")
    host = os.getenv("BACKEND_HOST", "127.0.0.1")
    try:
        os.chdir(Path(__file__).parent)
        subprocess.run([
            sys.executable, '-m', 'uvicorn',
            'main:app',
            '--host', host,
            '--port', port,
            '--log-level', 'info'
        ])
    except KeyboardInterrupt:
        print("\n👋 Server stopped by user")
    except Exception as e:
        print(f"❌ Failed to start server: {e}")

def main():
    """Main function to set up and run the application"""
    print("🌾 Welcome to FarmVerse!")
    print("=" * 50)
    
    # Check requirements
    if not check_requirements():
        return
    
    # Setup database
    if not setup_database():
        return
    
    print("\n📊 Backend setup complete!")
    print("🌐 Frontend can be found in the 'frontend' directory")
    backend_port = os.getenv("BACKEND_PORT", "8789")
    print(f"📖 API docs: http://localhost:{backend_port}/docs")
    print("🔗 Frontend dev (Vite) default: http://localhost:5173")
    print("\n" + "=" * 50)
    
    # Start the server
    start_server()

if __name__ == "__main__":
    main()
