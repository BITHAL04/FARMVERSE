"""
Quick test script for FarmVerse API
"""

import requests
import json
import time

def test_api():
    base_url = "http://localhost:8000"
    
    print("Testing FarmVerse Agriculture Chatbot API...")
    print("=" * 50)
    
    try:
        # Test health endpoint
        print("1. Health Check:")
        response = requests.get(f"{base_url}/health")
        if response.status_code == 200:
            print("✅ Health check passed")
            print(json.dumps(response.json(), indent=2))
        else:
            print("❌ Health check failed")
            return
        
        print("\n" + "=" * 50)
        
        # Test text chat - English
        print("2. Text Chat - English:")
        payload = {
            "message": "What is the best fertilizer for wheat?",
            "user_id": "test_user",
            "language": "en"
        }
        
        response = requests.post(f"{base_url}/chat/text", json=payload)
        if response.status_code == 200:
            print("✅ English text chat working")
            result = response.json()
            print(f"Question: {payload['message']}")
            print(f"Answer: {result.get('response', 'No response')}")
            print(f"Detected Language: {result.get('detected_language', 'Unknown')}")
        else:
            print("❌ English text chat failed")
            print(f"Status: {response.status_code}")
            print(f"Error: {response.text}")
        
        print("\n" + "=" * 50)
        
        # Test text chat - Hindi
        print("3. Text Chat - Hindi:")
        payload = {
            "message": "गेहूं के लिए कौन सा उर्वरक अच्छा है?",
            "user_id": "test_user",
            "language": "hi"
        }
        
        response = requests.post(f"{base_url}/chat/text", json=payload)
        if response.status_code == 200:
            print("✅ Hindi text chat working")
            result = response.json()
            print(f"प्रश्न: {payload['message']}")
            print(f"उत्तर: {result.get('response', 'कोई उत्तर नहीं')}")
            print(f"भाषा: {result.get('detected_language', 'अज्ञात')}")
        else:
            print("❌ Hindi text chat failed")
            print(f"Status: {response.status_code}")
        
        print("\n" + "=" * 50)
        
        # Test languages endpoint
        print("4. Supported Languages:")
        response = requests.get(f"{base_url}/languages")
        if response.status_code == 200:
            print("✅ Languages endpoint working")
            result = response.json()
            print(f"Supported: {result.get('supported_languages', [])}")
        else:
            print("❌ Languages endpoint failed")
        
        print("\n" + "=" * 50)
        
        # Test various agriculture questions
        print("5. Agriculture Knowledge Test:")
        test_questions = [
            ("What diseases affect rice crops?", "en"),
            ("How to improve soil fertility?", "en"),
            ("टमाटर में कीट नियंत्रण कैसे करें?", "hi"),
            ("मिट्टी की उर्वरता कैसे बढ़ाएं?", "hi")
        ]
        
        for question, lang in test_questions:
            payload = {"message": question, "user_id": "test_user", "language": lang}
            response = requests.post(f"{base_url}/chat/text", json=payload)
            
            if response.status_code == 200:
                result = response.json()
                print(f"\n✅ Q ({lang}): {question}")
                print(f"   A: {result.get('response', 'No response')[:100]}...")
            else:
                print(f"\n❌ Failed: {question}")
        
        print("\n" + "=" * 50)
        print("🎉 All basic tests completed!")
        print("\nTo test advanced features:")
        print("1. Configure API keys in .env file")
        print("2. Install full requirements: pip install -r requirements.txt")
        print("3. Run: uvicorn main:app --reload")
        
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to API server")
        print("Please ensure the server is running:")
        print("python main_simple.py")
    except Exception as e:
        print(f"❌ Test failed with error: {str(e)}")

if __name__ == "__main__":
    test_api()
