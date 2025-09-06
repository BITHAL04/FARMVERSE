"""
Production Authentication Test with Real Clerk Integration
"""
import requests
import json
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

BASE_URL = "http://localhost:8000"
CLERK_PUBLISHABLE_KEY = os.getenv("CLERK_PUBLISHABLE_KEY", "")

def test_with_real_clerk():
    """Test with actual Clerk configuration"""
    print("🔑 FarmVerse Authentication with Real Clerk")
    print("=" * 55)
    
    # Check if Clerk is configured
    if not CLERK_PUBLISHABLE_KEY or CLERK_PUBLISHABLE_KEY == "your-clerk-publishable-key":
        print("⚠️  Using mock authentication mode")
        print("To use real Clerk authentication:")
        print("1. Sign up at https://clerk.dev")
        print("2. Create a new application")
        print("3. Copy your keys to .env file")
        print("4. Restart the server")
        print()
    else:
        print(f"✅ Clerk configured: {CLERK_PUBLISHABLE_KEY[:20]}...")
    
    # Test API health
    try:
        response = requests.get(f"{BASE_URL}/health")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Server Status: {data['status']}")
            print(f"   Version: {data['version']}")
            print(f"   Authentication: {data['authentication']}")
        else:
            print("❌ Server health check failed")
            return
    except requests.ConnectionError:
        print("❌ Server not running! Start with: python main_auth.py")
        return
    
    # Test authentication endpoints
    print("\n🧪 Testing Authentication Flow...")
    
    # Mock login test
    login_data = {"clerk_session_token": "test_session_123"}
    response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
    
    if response.status_code == 200:
        print("✅ Mock authentication working")
        login_result = response.json()
        token = login_result['access_token']
        user = login_result['user']
        
        print(f"   User: {user['name']} ({user['email']})")
        
        # Test protected endpoints
        headers = {"Authorization": f"Bearer {token}"}
        
        # Test profile access
        profile_response = requests.get(f"{BASE_URL}/auth/profile", headers=headers)
        if profile_response.status_code == 200:
            print("✅ Profile access successful")
        
        # Test farmer profile creation
        farmer_data = {
            "farmer_profile": {
                "location": "Gujarat, India",
                "farm_land_capacity": 15.0,
                "farming_type": ["crop_farming", "dairy_farming"],
                "primary_crops": ["cotton", "groundnut"],
                "farming_experience_years": 12,
                "experience_level": "intermediate",
                "age": 40,
                "education_level": "Bachelor's",
                "irrigation_methods": ["drip irrigation", "sprinkler"],
                "equipment_owned": ["tractor", "pump set"],
                "annual_income_range": "₹8,00,000 - ₹12,00,000",
                "preferred_language": "hi",
                "farming_goals": ["increase cotton yield", "water conservation"],
                "challenges_faced": ["irregular rainfall", "market fluctuations"],
                "tech_adoption_level": "intermediate",
                "smartphone_usage": True,
                "internet_access": True
            }
        }
        
        # Check if profile already exists
        profile_check = requests.get(f"{BASE_URL}/auth/profile", headers=headers)
        if profile_check.status_code == 200:
            existing_profile = profile_check.json()
            if existing_profile['user'].get('farmer_profile'):
                print("ℹ️  Farmer profile already exists")
            else:
                # Create new profile
                create_response = requests.post(
                    f"{BASE_URL}/auth/profile/farmer",
                    json=farmer_data,
                    headers=headers
                )
                if create_response.status_code == 200:
                    print("✅ Farmer profile created")
                else:
                    print(f"⚠️  Profile creation: {create_response.status_code}")
        
        # Test personalized chat
        print("\n💬 Testing Personalized Chat...")
        chat_messages = [
            "What is the best time to plant cotton?",
            "कपास के लिए कौन सी मिट्टी सबसे अच्छी है?",
            "How can I improve water efficiency on my farm?",
            "मेरे खेत में कीट प्रबंधन कैसे करें?"
        ]
        
        for i, message in enumerate(chat_messages, 1):
            chat_response = requests.post(
                f"{BASE_URL}/chat/text",
                json={"message": message},
                headers=headers
            )
            if chat_response.status_code == 200:
                chat_result = chat_response.json()
                lang = "🇮🇳" if chat_result['detected_language'] == 'hi' else "🇺🇸"
                context_used = "✅" if chat_result.get('farmer_context_used') else "❌"
                print(f"   {i}. {lang} Context: {context_used} | Response: {len(chat_result['response'])} chars")
        
        # Test farmer recommendations
        print("\n🌱 Testing Farmer Recommendations...")
        rec_response = requests.get(f"{BASE_URL}/farmer/recommendations", headers=headers)
        if rec_response.status_code == 200:
            rec_data = rec_response.json()
            print("✅ Personalized recommendations generated")
            print(f"   Farmer: {rec_data['farmer']}")
            print(f"   Location: {rec_data['location']}")
            print(f"   Season: {rec_data['recommendations']['seasonal_advice']['current_season']}")
        
        # Test profile stats
        stats_response = requests.get(f"{BASE_URL}/auth/profile/stats", headers=headers)
        if stats_response.status_code == 200:
            stats_data = stats_response.json()
            print(f"\n📈 Profile Completion: {stats_data['completion_percentage']}%")
            
    else:
        print(f"❌ Authentication failed: {response.status_code}")
        print(response.text)
    
    print("\n" + "=" * 55)
    print("🎉 Authentication System Demo Complete!")
    print("\n📋 System Features:")
    print("✅ Clerk Authentication Integration")
    print("✅ JWT Token Authorization")
    print("✅ Comprehensive Farmer Profiles")
    print("✅ Personalized Agriculture Chat")
    print("✅ Multilingual Support (Hindi/English)")
    print("✅ Profile Completion Tracking")
    print("✅ Farming Recommendations")
    print("✅ Protected API Endpoints")
    
    print("\n🔗 Useful Links:")
    print("📖 API Documentation: http://localhost:8000/docs")
    print("🏠 Demo Page: http://localhost:8000/static/index.html")
    print("💻 Clerk Dashboard: https://dashboard.clerk.dev")

if __name__ == "__main__":
    test_with_real_clerk()
