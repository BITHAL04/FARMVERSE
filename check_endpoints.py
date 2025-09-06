"""
Simple endpoint checker for FarmVerse
"""
import requests
import sys
from datetime import datetime

BASE_URL = "http://localhost:8000"

def check_endpoint_availability():
    """Check which endpoints are available"""
    print("🌾 FarmVerse Endpoint Availability Check")
    print("=" * 50)
    print(f"Time: {datetime.now()}")
    print(f"Base URL: {BASE_URL}")
    print()
    
    endpoints_to_check = [
        ("GET", "/", "Root endpoint"),
        ("GET", "/health", "Health check"),
        ("GET", "/languages", "Languages"),
        ("GET", "/docs", "API Documentation"),
        ("GET", "/openapi.json", "OpenAPI Schema"),
        ("POST", "/onboarding/auth/otp/request", "OTP Request"),
        ("GET", "/farming/soil/tests", "Soil Tests"),
        ("GET", "/farming/fields", "Farm Fields"),
        ("GET", "/farming/crop-planner/plans", "Crop Plans"),
        ("GET", "/farming/weather/alerts", "Weather Alerts"),
        ("GET", "/farming/inputs/suppliers", "Input Suppliers"),
        ("GET", "/farming/experts/available", "Experts"),
        ("GET", "/farming/insurance/policies", "Insurance"),
        ("GET", "/farming/market/prices", "Market Prices"),
    ]
    
    available = 0
    protected = 0
    errors = 0
    
    for method, endpoint, description in endpoints_to_check:
        try:
            if method == "GET":
                response = requests.get(f"{BASE_URL}{endpoint}", timeout=2)
            elif method == "POST":
                response = requests.post(f"{BASE_URL}{endpoint}", 
                                       json={"phone": "+911234567890"}, 
                                       timeout=2)
            
            if response.status_code == 200:
                print(f"✅ {description}: {response.status_code}")
                available += 1
            elif response.status_code in [401, 403]:
                print(f"🔒 {description}: {response.status_code} (Protected)")
                protected += 1
            elif response.status_code in [422, 400]:
                print(f"📝 {description}: {response.status_code} (Validation)")
                available += 1  # Still available, just needs correct data
            else:
                print(f"⚠️  {description}: {response.status_code}")
                errors += 1
                
        except requests.exceptions.RequestException as e:
            print(f"❌ {description}: Connection Error - {str(e)[:50]}...")
            errors += 1
    
    print("\n" + "=" * 50)
    print(f"📊 Summary:")
    print(f"   ✅ Available: {available}")
    print(f"   🔒 Protected: {protected}")  
    print(f"   ❌ Errors: {errors}")
    print(f"   📋 Total: {len(endpoints_to_check)}")
    
    if available + protected >= len(endpoints_to_check) - 2:  # Allow for 2 errors
        print("🎉 FarmVerse is running well! All major features accessible.")
        return True
    else:
        print("⚠️  Some features may not be working correctly.")
        return False

if __name__ == "__main__":
    success = check_endpoint_availability()
    sys.exit(0 if success else 1)
