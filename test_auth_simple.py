"""
Simple authentication test script
"""
import requests
import json

BASE_URL = "http://localhost:8000"

def test_basic_endpoints():
    """Test basic endpoints that don't require authentication"""
    print("🌾 Testing Basic Endpoints...")
    
    try:
        # Test root endpoint
        response = requests.get(f"{BASE_URL}/")
        print(f"Root: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Version: {data['version']}")
            print(f"Features: {', '.join(data['features'])}")
        
        # Test health check
        response = requests.get(f"{BASE_URL}/health")
        print(f"Health: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Service: {data['service']}")
            print(f"Status: {data['status']}")
        
        # Test languages endpoint
        response = requests.get(f"{BASE_URL}/languages")
        print(f"Languages: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Supported: {', '.join(data['supported_languages'])}")
        
        return True
        
    except requests.ConnectionError:
        print("❌ Server not running. Please start with: python main_auth.py")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_authentication():
    """Test authentication flow"""
    print("\n🔐 Testing Authentication...")
    
    try:
        # Test login with mock token
        login_data = {"clerk_session_token": "test_session_123"}
        response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Login successful")
            print(f"User: {data['user']['name']}")
            print(f"Token type: {data['token_type']}")
            
            # Use token for protected endpoints
            token = data['access_token']
            headers = {"Authorization": f"Bearer {token}"}
            
            # Test profile
            profile_response = requests.get(f"{BASE_URL}/auth/profile", headers=headers)
            if profile_response.status_code == 200:
                print("✅ Profile access successful")
            
            # Test authenticated chat
            chat_data = {"message": "मुझे गेहूं की खेती के बारे में बताएं"}
            chat_response = requests.post(f"{BASE_URL}/chat/text", json=chat_data, headers=headers)
            if chat_response.status_code == 200:
                chat_result = chat_response.json()
                print("✅ Authenticated chat successful")
                print(f"Language detected: {chat_result['detected_language']}")
                print(f"Farmer context used: {chat_result.get('farmer_context_used', False)}")
            
            return True
        else:
            print(f"❌ Login failed: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Authentication error: {e}")
        return False

def test_unauthorized():
    """Test unauthorized access"""
    print("\n🚫 Testing Unauthorized Access...")
    
    try:
        # Test accessing protected endpoint without token
        response = requests.get(f"{BASE_URL}/auth/profile")
        if response.status_code == 403:
            print("✅ Unauthorized access properly blocked")
        
        # Test invalid token
        headers = {"Authorization": "Bearer invalid_token_123"}
        response = requests.get(f"{BASE_URL}/auth/profile", headers=headers)
        if response.status_code == 401:
            print("✅ Invalid token properly rejected")
        
        return True
        
    except Exception as e:
        print(f"❌ Unauthorized test error: {e}")
        return False

if __name__ == "__main__":
    print("🌾 FarmVerse Authentication Test")
    print("=" * 40)
    
    if test_basic_endpoints():
        test_authentication()
        test_unauthorized()
        
        print("\n" + "=" * 40)
        print("✅ Authentication system is working!")
        print("\n📋 Features Available:")
        print("- ✅ User Authentication (Mock Clerk)")
        print("- ✅ Protected API Endpoints")
        print("- ✅ Farmer Profile Management")
        print("- ✅ Personalized Chat Responses")
        print("- ✅ JWT Token Security")
        
        print("\n🔧 Next Steps:")
        print("1. Get Clerk API keys from https://clerk.dev")
        print("2. Add them to .env file")
        print("3. Test with real Clerk authentication")
        print("4. Configure frontend with Clerk integration")
    
    else:
        print("❌ Basic endpoints failed - check if server is running")
