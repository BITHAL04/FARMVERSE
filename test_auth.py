"""
Test script for authentication and farmer profile features
"""
import httpx
import asyncio
import json
from datetime import datetime

# Test configuration
BASE_URL = "http://localhost:8000"
TEST_USER_DATA = {
    "clerk_session_token": "test_session_123"  # Mock token for testing
}

TEST_FARMER_PROFILE = {
    "farmer_profile": {
        "location": "Punjab, India",
        "latitude": 30.7333,
        "longitude": 76.7794,
        "farm_land_capacity": 25.5,
        "farming_type": ["crop_farming", "dairy_farming"],
        "primary_crops": ["wheat", "rice"],
        "farming_experience_years": 15,
        "experience_level": "intermediate",
        "previous_work": "Started as farm laborer, managed family farm for 10 years",
        "age": 45,
        "education_level": "High School",
        "irrigation_methods": ["drip irrigation", "flood irrigation"],
        "equipment_owned": ["tractor", "harvester", "thresher"],
        "annual_income_range": "₹5,00,000 - ₹10,00,000",
        "preferred_language": "hi",
        "farming_goals": ["increase crop yield", "adopt organic farming"],
        "challenges_faced": ["water scarcity", "pest management"],
        "tech_adoption_level": "basic",
        "smartphone_usage": True,
        "internet_access": True
    }
}

async def test_authentication():
    """Test authentication endpoints"""
    print("🔐 Testing Authentication System...")
    
    async with httpx.AsyncClient() as client:
        # Test health check
        print("\n1. Testing health check...")
        response = await client.get(f"{BASE_URL}/health")
        print(f"Health: {response.status_code} - {response.json()}")
        
        # Test login
        print("\n2. Testing login...")
        try:
            login_response = await client.post(
                f"{BASE_URL}/auth/login",
                json=TEST_USER_DATA
            )
            if login_response.status_code == 200:
                login_data = login_response.json()
                print(f"✅ Login successful: {login_data['message']}")
                access_token = login_data["access_token"]
                user_id = login_data["user"]["user_id"]
                
                # Set authorization header for subsequent requests
                headers = {"Authorization": f"Bearer {access_token}"}
                
                # Test protected profile endpoint
                print("\n3. Testing profile retrieval...")
                profile_response = await client.get(
                    f"{BASE_URL}/auth/profile",
                    headers=headers
                )
                if profile_response.status_code == 200:
                    print("✅ Profile retrieved successfully")
                    profile_data = profile_response.json()
                    print(f"User: {profile_data['user']['name']} ({profile_data['user']['email']})")
                else:
                    print(f"❌ Profile retrieval failed: {profile_response.status_code}")
                
                # Test farmer profile creation
                print("\n4. Testing farmer profile creation...")
                farmer_response = await client.post(
                    f"{BASE_URL}/auth/profile/farmer",
                    json=TEST_FARMER_PROFILE,
                    headers=headers
                )
                if farmer_response.status_code == 200:
                    print("✅ Farmer profile created successfully")
                    farmer_data = farmer_response.json()
                    farmer_profile = farmer_data["user"]["farmer_profile"]
                    print(f"Farm Location: {farmer_profile['location']}")
                    print(f"Farm Size: {farmer_profile['farm_land_capacity']} acres")
                    print(f"Experience: {farmer_profile['farming_experience_years']} years")
                else:
                    print(f"❌ Farmer profile creation failed: {farmer_response.status_code}")
                    print(farmer_response.text)
                
                # Test authenticated chat
                print("\n5. Testing authenticated chat...")
                chat_response = await client.post(
                    f"{BASE_URL}/chat/text",
                    json={"message": "What fertilizer should I use for wheat?"},
                    headers=headers
                )
                if chat_response.status_code == 200:
                    chat_data = chat_response.json()
                    print("✅ Authenticated chat successful")
                    print(f"Response: {chat_data['response'][:100]}...")
                    print(f"Farmer context used: {chat_data.get('farmer_context_used', False)}")
                else:
                    print(f"❌ Authenticated chat failed: {chat_response.status_code}")
                
                # Test farmer recommendations
                print("\n6. Testing farmer recommendations...")
                rec_response = await client.get(
                    f"{BASE_URL}/farmer/recommendations",
                    headers=headers
                )
                if rec_response.status_code == 200:
                    rec_data = rec_response.json()
                    print("✅ Farmer recommendations retrieved")
                    print(f"Seasonal advice: {rec_data['recommendations']['seasonal_advice']['current_season']}")
                    print(f"Crop suggestions: {rec_data['recommendations']['crop_suggestions'][:3]}")
                else:
                    print(f"❌ Farmer recommendations failed: {rec_response.status_code}")
                
                # Test profile stats
                print("\n7. Testing profile stats...")
                stats_response = await client.get(
                    f"{BASE_URL}/auth/profile/stats",
                    headers=headers
                )
                if stats_response.status_code == 200:
                    stats_data = stats_response.json()
                    print("✅ Profile stats retrieved")
                    print(f"Profile completion: {stats_data['completion_percentage']}%")
                    print(f"Recommendations: {stats_data['recommendations']}")
                else:
                    print(f"❌ Profile stats failed: {stats_response.status_code}")
                
            else:
                print(f"❌ Login failed: {login_response.status_code}")
                print(login_response.text)
                
        except Exception as e:
            print(f"❌ Authentication test error: {e}")

async def test_unauthorized_access():
    """Test unauthorized access to protected endpoints"""
    print("\n🚫 Testing Unauthorized Access...")
    
    async with httpx.AsyncClient() as client:
        # Test accessing protected endpoint without token
        response = await client.get(f"{BASE_URL}/auth/profile")
        if response.status_code == 403:
            print("✅ Unauthorized access properly blocked")
        else:
            print(f"❌ Unauthorized access test failed: {response.status_code}")
        
        # Test invalid token
        headers = {"Authorization": "Bearer invalid_token_123"}
        response = await client.get(f"{BASE_URL}/auth/profile", headers=headers)
        if response.status_code == 401:
            print("✅ Invalid token properly rejected")
        else:
            print(f"❌ Invalid token test failed: {response.status_code}")

def main():
    """Run all authentication tests"""
    print("🌾 FarmVerse Authentication Test Suite")
    print("=" * 50)
    
    try:
        # Run async tests
        asyncio.run(test_authentication())
        asyncio.run(test_unauthorized_access())
        
        print("\n" + "=" * 50)
        print("✅ Authentication test suite completed!")
        print("\n📋 Test Summary:")
        print("- User authentication with mock Clerk integration")
        print("- Farmer profile creation and management")
        print("- Protected endpoint access control")
        print("- Personalized chat with farmer context")
        print("- Profile completion tracking")
        print("- Farmer recommendations system")
        
    except Exception as e:
        print(f"\n❌ Test suite failed: {e}")

if __name__ == "__main__":
    main()
