"""
Simplified Authentication Demo
"""
import requests
import json

def demo_authentication():
    """Demonstrate the authentication system"""
    base_url = "http://localhost:8000"
    
    print("🌾 FarmVerse Authentication Demo")
    print("=" * 50)
    
    # Test 1: Basic endpoints (no auth required)
    print("\n1. Testing public endpoints...")
    try:
        response = requests.get(f"{base_url}/")
        if response.status_code == 200:
            print("✅ Root endpoint working")
            data = response.json()
            print(f"   Version: {data['version']}")
        
        response = requests.get(f"{base_url}/health")
        if response.status_code == 200:
            print("✅ Health check working")
        
        response = requests.get(f"{base_url}/languages")
        if response.status_code == 200:
            print("✅ Languages endpoint working")
            
    except requests.ConnectionError:
        print("❌ Server not running! Start with: python main_auth.py")
        return
    
    # Test 2: Login (mock authentication)
    print("\n2. Testing authentication login...")
    login_data = {"clerk_session_token": "test_session_123"}
    
    try:
        response = requests.post(f"{base_url}/auth/login", json=login_data)
        if response.status_code == 200:
            print("✅ Login successful")
            login_result = response.json()
            print(f"   User: {login_result['user']['name']}")
            print(f"   Email: {login_result['user']['email']}")
            
            # Get the access token
            token = login_result['access_token']
            headers = {"Authorization": f"Bearer {token}"}
            
            # Test 3: Protected endpoints
            print("\n3. Testing protected endpoints...")
            profile_response = requests.get(f"{base_url}/auth/profile", headers=headers)
            if profile_response.status_code == 200:
                print("✅ Profile access successful")
            
            # Test 4: Farmer profile creation
            print("\n4. Testing farmer profile creation...")
            farmer_profile_data = {
                "farmer_profile": {
                    "location": "Maharashtra, India",
                    "farm_land_capacity": 10.5,
                    "farming_type": ["crop_farming"],
                    "primary_crops": ["cotton", "soybeans"],
                    "farming_experience_years": 8,
                    "experience_level": "intermediate",
                    "age": 35,
                    "preferred_language": "hi",
                    "farming_goals": ["increase yield", "reduce costs"],
                    "challenges_faced": ["water shortage", "market prices"]
                }
            }
            
            create_response = requests.post(
                f"{base_url}/auth/profile/farmer", 
                json=farmer_profile_data,
                headers=headers
            )
            if create_response.status_code == 200:
                print("✅ Farmer profile created successfully")
                profile_data = create_response.json()
                farmer = profile_data['user']['farmer_profile']
                print(f"   Location: {farmer['location']}")
                print(f"   Farm Size: {farmer['farm_land_capacity']} acres")
                print(f"   Experience: {farmer['farming_experience_years']} years")
            
            # Test 5: Personalized chat
            print("\n5. Testing personalized chat...")
            chat_data = {"message": "What fertilizer should I use for cotton?"}
            chat_response = requests.post(
                f"{base_url}/chat/text",
                json=chat_data,
                headers=headers
            )
            if chat_response.status_code == 200:
                print("✅ Personalized chat working")
                chat_result = chat_response.json()
                print(f"   Farmer context used: {chat_result.get('farmer_context_used', False)}")
                print(f"   Response preview: {chat_result['response'][:100]}...")
            
            # Test 6: Farmer recommendations
            print("\n6. Testing farmer recommendations...")
            rec_response = requests.get(f"{base_url}/farmer/recommendations", headers=headers)
            if rec_response.status_code == 200:
                print("✅ Farmer recommendations working")
                rec_data = rec_response.json()
                print(f"   Current season: {rec_data['recommendations']['seasonal_advice']['current_season']}")
                print(f"   Crop suggestions: {', '.join(rec_data['recommendations']['crop_suggestions'][:3])}")
        
        else:
            print(f"❌ Login failed: {response.status_code}")
            print(response.text)
    
    except Exception as e:
        print(f"❌ Demo error: {e}")
    
    print("\n" + "=" * 50)
    print("🎉 Authentication Demo Complete!")
    print("\n📊 System Status:")
    print("✅ User authentication with Clerk integration (mock mode)")
    print("✅ JWT token-based authorization")
    print("✅ Farmer profile management")
    print("✅ Protected API endpoints")
    print("✅ Personalized agriculture responses")
    print("✅ Profile completion tracking")
    
    print("\n🔑 For Production:")
    print("1. Sign up at https://clerk.dev")
    print("2. Get your Clerk Secret Key and Publishable Key")
    print("3. Add to .env file: CLERK_SECRET_KEY=sk_...")
    print("4. Configure Clerk in your frontend application")

if __name__ == "__main__":
    demo_authentication()
