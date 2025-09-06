#!/usr/bin/env python3
"""
FarmVerse Feature Testing Script
Tests all the integrated features to ensure they work properly
"""

import requests
import json
from datetime import datetime

BASE_URL = "http://localhost:8000"

def test_endpoint(endpoint, method="GET", data=None, headers=None):
    """Test a single endpoint"""
    url = f"{BASE_URL}{endpoint}"
    try:
        if method == "GET":
            response = requests.get(url, headers=headers, timeout=10)
        elif method == "POST":
            response = requests.post(url, json=data, headers=headers, timeout=10)
        
        if response.status_code in [200, 201]:
            print(f"✅ {method} {endpoint} - Status: {response.status_code}")
            return response.json()
        else:
            print(f"❌ {method} {endpoint} - Status: {response.status_code} - {response.text}")
            return None
    except requests.exceptions.RequestException as e:
        print(f"❌ {method} {endpoint} - Error: {e}")
        return None

def test_features():
    """Test all feature endpoints"""
    print("🧪 Testing FarmVerse Features")
    print("=" * 50)
    
    # Test basic health check
    print("\n📊 Basic Health Check:")
    test_endpoint("/health")
    test_endpoint("/")
    
    # Test feature endpoints (GET requests)
    print("\n🔍 Testing Feature Endpoints:")
    feature_endpoints = [
        "/api/v1/features/soil-testing",
        "/api/v1/features/farm-tagging", 
        "/api/v1/features/crop-planner",
        "/api/v1/features/weather-alerts",
        "/api/v1/features/quality-input",
        "/api/v1/features/connect-experts",
        "/api/v1/features/crop-insurance",
        "/api/v1/features/mandi-rate",
        "/api/v1/features/live-monitoring"
    ]
    
    for endpoint in feature_endpoints:
        test_endpoint(endpoint)
    
    # Test farming API endpoints (public ones)
    print("\n🌾 Testing Farming API Endpoints:")
    farming_endpoints = [
        "/api/v1/farming/weather/alerts",
        "/api/v1/farming/inputs/suppliers",
        "/api/v1/farming/market/prices"
    ]
    
    for endpoint in farming_endpoints:
        test_endpoint(endpoint)
    
    # Test chat endpoint
    print("\n💬 Testing Chat Feature:")
    chat_data = {
        "message": "How to improve soil fertility?",
        "history": []
    }
    test_endpoint("/api/v1/features/chat", method="POST", data=chat_data)
    
    # Test contact endpoint
    print("\n📧 Testing Contact Feature:")
    contact_data = {
        "name": "Test User",
        "email": "test@example.com",
        "message": "This is a test message"
    }
    test_endpoint("/api/v1/features/contact/send", method="POST", data=contact_data)
    
    print("\n" + "=" * 50)
    print("🎉 Feature testing completed!")

def test_database_connection():
    """Test database operations"""
    print("\n🗄️  Testing Database Connection:")
    
    # Try to create a sample market price
    market_data = {
        "crop": "Test Wheat",
        "mandi": "Test Mandi", 
        "price_per_quintal": 2500.0
    }
    
    response = test_endpoint("/api/v1/farming/market/prices", method="POST", data=market_data)
    if response:
        print("✅ Database write operation successful")
    
    # Try to fetch market prices
    response = test_endpoint("/api/v1/farming/market/prices")
    if response and len(response) > 0:
        print(f"✅ Database read operation successful - Found {len(response)} records")

def test_authentication():
    """Test authentication endpoints"""
    print("\n🔐 Testing Authentication:")
    
    # Test registration
    register_data = {
        "email": "test@farmverse.com",
        "password": "testpass123",
        "name": "Test Farmer"
    }
    
    response = test_endpoint("/api/v1/register", method="POST", data=register_data)
    
    # Test login
    login_data = {
        "email": "test@farmverse.com", 
        "password": "testpass123"
    }
    
    response = test_endpoint("/api/v1/login", method="POST", data=login_data)
    
    if response and "token" in response:
        token = response["token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        print("✅ Authentication successful, testing authenticated endpoints:")
        
        # Test authenticated endpoints
        auth_endpoints = [
            "/api/v1/farming/soil/tests",
            "/api/v1/farming/fields", 
            "/api/v1/farming/crop-planner/plans",
            "/api/v1/farming/experts/consultations",
            "/api/v1/farming/insurance/policies"
        ]
        
        for endpoint in auth_endpoints:
            test_endpoint(endpoint, headers=headers)

def main():
    """Main testing function"""
    print("🌾 FarmVerse Integration Testing")
    print(f"⏰ Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)
    
    # Check if server is running
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=5)
        if response.status_code == 200:
            print("✅ Server is running and accessible")
        else:
            print("❌ Server is not responding properly")
            return
    except requests.exceptions.RequestException:
        print("❌ Server is not running or not accessible")
        print("💡 Make sure to start the server with: python run_app.py")
        return
    
    # Run all tests
    test_features()
    test_database_connection()
    test_authentication()
    
    print("\n" + "=" * 60)
    print("🎯 All tests completed!")
    print("💡 If you see any ❌ errors, check the server logs for details")

if __name__ == "__main__":
    main()
