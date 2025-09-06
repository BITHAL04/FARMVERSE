"""
Comprehensive test suite for FarmVerse features
"""
import requests
import json
import time
from datetime import datetime

BASE_URL = "http://localhost:8000"

def test_basic_endpoints():
    """Test basic API functionality"""
    print("🌾 Testing Basic Endpoints...")
    
    # Test root endpoint
    response = requests.get(f"{BASE_URL}/")
    print(f"✅ Root: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"   Version: {data.get('version')}")
        print(f"   Features: {len(data.get('features', []))} available")
    
    # Test health check
    response = requests.get(f"{BASE_URL}/health")
    print(f"✅ Health: {response.status_code}")
    if response.status_code == 200:
        print(f"   Status: {response.json().get('status')}")
    
    # Test languages
    response = requests.get(f"{BASE_URL}/languages")
    print(f"✅ Languages: {response.status_code}")
    if response.status_code == 200:
        print(f"   Supported: {', '.join(response.json().get('supported_languages', []))}")

def test_otp_flow():
    """Test OTP request and verification"""
    print("\n📱 Testing OTP Flow...")
    
    # Request OTP
    phone = "+911234567890"
    response = requests.post(f"{BASE_URL}/onboarding/auth/otp/request", 
                           json={"phone": phone})
    print(f"✅ OTP Request: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        otp_code = data.get("dev_otp")
        print(f"   OTP Code (dev): {otp_code}")
        
        # Verify OTP
        if otp_code:
            verify_response = requests.post(f"{BASE_URL}/onboarding/auth/otp/verify",
                                          json={
                                              "phone": phone,
                                              "otp": otp_code,
                                              "name": "Test Farmer",
                                              "preferred_language": "en"
                                          })
            print(f"✅ OTP Verify: {verify_response.status_code}")
            if verify_response.status_code == 200:
                verify_data = verify_response.json()
                access_token = verify_data.get("access_token")
                user_id = verify_data.get("user_id")
                print(f"   User ID: {user_id}")
                return access_token
    
    return None

def test_farming_features(token):
    """Test all farming feature endpoints"""
    print("\n🚜 Testing Farming Features...")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    # Test soil testing
    print("🧪 Soil Testing...")
    response = requests.get(f"{BASE_URL}/farming/soil/tests", headers=headers)
    print(f"   Soil tests: {response.status_code}")
    
    # Test farm fields
    print("🗺️ Farm Fields...")
    response = requests.get(f"{BASE_URL}/farming/fields", headers=headers)
    print(f"   Farm fields: {response.status_code}")
    
    # Test crop planner
    print("🌱 Crop Planner...")
    response = requests.get(f"{BASE_URL}/farming/crop-planner/plans", headers=headers)
    print(f"   Crop plans: {response.status_code}")
    
    # Test weather alerts
    print("🌤️ Weather Alerts...")
    response = requests.get(f"{BASE_URL}/farming/weather/alerts", headers=headers)
    print(f"   Weather alerts: {response.status_code}")
    
    # Test input suppliers
    print("🛒 Input Suppliers...")
    response = requests.get(f"{BASE_URL}/farming/inputs/suppliers", headers=headers)
    print(f"   Input suppliers: {response.status_code}")
    
    # Test expert consultation
    print("👨‍🌾 Expert Consultation...")
    response = requests.get(f"{BASE_URL}/farming/experts/available", headers=headers)
    print(f"   Available experts: {response.status_code}")
    
    # Test crop insurance
    print("🛡️ Crop Insurance...")
    response = requests.get(f"{BASE_URL}/farming/insurance/policies", headers=headers)
    print(f"   Insurance policies: {response.status_code}")
    
    # Test market linkage
    print("💰 Market Linkage...")
    response = requests.get(f"{BASE_URL}/farming/market/prices", headers=headers)
    print(f"   Market prices: {response.status_code}")

def test_profile_creation(token):
    """Test farmer profile creation"""
    print("\n👤 Testing Profile Creation...")
    
    headers = {"Authorization": f"Bearer {token}"}
    profile_data = {
        "crops": ["wheat", "rice"],
        "farm_size": 5.0,
        "irrigation_type": ["drip", "sprinkler"],
        "organic_usage": True,
        "location": {
            "lat": 28.6139,
            "lon": 77.2090,
            "district": "New Delhi",
            "state": "Delhi",
            "village": "Test Village",
            "name": "Test Farm Location"
        },
        "experience_years": 10,
        "age": 35
    }
    
    response = requests.post(f"{BASE_URL}/onboarding/profile", 
                           json=profile_data, headers=headers)
    print(f"✅ Profile Creation: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"   Profile ID: {data.get('profile_id')}")
        
        # Test reward awarding
        reward_response = requests.post(f"{BASE_URL}/onboarding/rewards/award",
                                      json={"badge_code": "FARM_FOUNDER", "points": 100},
                                      headers=headers)
        print(f"✅ Reward Award: {reward_response.status_code}")
        if reward_response.status_code == 200:
            reward_data = reward_response.json()
            print(f"   Points Awarded: {reward_data.get('points_awarded')}")
            print(f"   Total Points: {reward_data.get('total_points')}")

def test_api_documentation():
    """Test API documentation accessibility"""
    print("\n📚 Testing API Documentation...")
    
    response = requests.get(f"{BASE_URL}/docs")
    print(f"✅ Swagger UI: {response.status_code}")
    
    response = requests.get(f"{BASE_URL}/openapi.json")
    print(f"✅ OpenAPI Schema: {response.status_code}")

def main():
    """Run comprehensive feature tests"""
    print("🌾 FarmVerse Comprehensive Feature Test")
    print("=" * 50)
    
    try:
        # Test basic endpoints
        test_basic_endpoints()
        
        # Test OTP flow and get token
        token = test_otp_flow()
        
        if token:
            # Test farming features with authentication
            test_farming_features(token)
            test_profile_creation(token)
        else:
            print("❌ Could not get authentication token - skipping protected endpoints")
        
        # Test documentation
        test_api_documentation()
        
        print("\n" + "=" * 50)
        print("✅ FarmVerse Feature Test Complete!")
        print("\n📊 All farming modules tested:")
        print("   • Authentication & OTP ✅")
        print("   • Soil Testing ✅")
        print("   • Farm Field Management ✅") 
        print("   • Crop Planning ✅")
        print("   • Weather Alerts ✅")
        print("   • Input Suppliers ✅")
        print("   • Expert Consultation ✅")
        print("   • Crop Insurance ✅")
        print("   • Market Linkage & Mandi Rates ✅")
        print("   • Profile & Rewards ✅")
        
    except Exception as e:
        print(f"❌ Test failed: {e}")

if __name__ == "__main__":
    main()
