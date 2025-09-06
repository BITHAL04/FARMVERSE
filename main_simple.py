"""
Simplified main.py for initial testing without external dependencies
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from datetime import datetime
import os
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Simplified models for testing
class SimpleChatRequest(BaseModel):
    message: str
    user_id: Optional[str] = None
    language: Optional[str] = "en"

class SimpleChatResponse(BaseModel):
    response: str
    detected_language: str
    timestamp: datetime = datetime.now()

class HealthResponse(BaseModel):
    status: str = "healthy"
    message: str = "Service is running"
    timestamp: datetime = datetime.now()
    version: str = "1.0.0"

# Initialize FastAPI app
app = FastAPI(
    title="FarmVerse Agriculture Chatbot",
    version="1.0.0",
    description="Multilingual Agriculture Chatbot with Voice and Image Integration"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
try:
    app.mount("/static", StaticFiles(directory="static"), name="static")
except Exception as e:
    logger.warning(f"Could not mount static files: {e}")

# Simple agriculture knowledge base
AGRICULTURE_RESPONSES = {
    "en": {
        "wheat": "Wheat is best grown in winter season (October-December). Use NPK fertilizer 120:60:40 kg/ha. Watch for rust disease and aphid pests.",
        "rice": "Rice grows well in monsoon season (June-July). Requires flooded fields. Use balanced NPK fertilizer. Common diseases include blast and bacterial blight.",
        "tomato": "Tomatoes can be grown year-round with proper care. Need regular watering every 2-3 days. Watch for early blight and whitefly.",
        "default": "I'm your agriculture expert. Ask me about crop cultivation, diseases, pests, fertilizers, or farming techniques."
    },
    "hi": {
        "wheat": "गेहूं सर्दी के मौसम में सबसे अच्छा उगता है (अक्टूबर-दिसंबर)। NPK उर्वरक 120:60:40 किग्रा/हेक्टेयर का उपयोग करें।",
        "rice": "चावल मानसून के मौसम में अच्छा उगता है (जून-जुलाई)। भरे हुए खेत की आवश्यकता होती है।",
        "tomato": "टमाटर उचित देखभाल के साथ साल भर उगाया जा सकता है। हर 2-3 दिन में नियमित पानी की आवश्यकता।",
        "default": "मैं आपका कृषि विशेषज्ञ हूं। मुझसे फसल की खेती, बीमारियों, कीटों, उर्वरकों या खेती की तकनीकों के बारे में पूछें।"
    }
}

def detect_language_simple(text: str) -> str:
    """Simple language detection based on script"""
    try:
        # Check for Devanagari characters (Hindi)
        devanagari_count = sum(1 for char in text if '\u0900' <= char <= '\u097F')
        total_chars = len([c for c in text if c.isalpha()])
        
        if total_chars > 0 and devanagari_count / total_chars > 0.3:
            return "hi"
        else:
            return "en"
    except:
        return "en"

def generate_agriculture_response(message: str, language: str) -> str:
    """Generate simple agriculture response"""
    message_lower = message.lower()
    responses = AGRICULTURE_RESPONSES.get(language, AGRICULTURE_RESPONSES["en"])
    
    # Check for specific crops
    for crop in ["wheat", "rice", "tomato", "corn", "गेहूं", "चावल", "टमाटर"]:
        if crop in message_lower:
            crop_key = "wheat" if crop in ["wheat", "गेहूं"] else \
                      "rice" if crop in ["rice", "चावल"] else \
                      "tomato" if crop in ["tomato", "टमाटर"] else "wheat"
            return responses.get(crop_key, responses["default"])
    
    # Check for general topics
    if any(word in message_lower for word in ["fertilizer", "उर्वरक", "खाद"]):
        if language == "hi":
            return "संतुलित NPK उर्वरक का उपयोग करें। नाइट्रोजन, फास्फोरस और पोटाश सभी महत्वपूर्ण हैं। मिट्टी की जांच कराकर सही मात्रा निर्धारित करें।"
        else:
            return "Use balanced NPK fertilizer. Nitrogen, phosphorus, and potash are all important. Conduct soil testing to determine the right amounts."
    
    if any(word in message_lower for word in ["disease", "pest", "बीमारी", "कीट"]):
        if language == "hi":
            return "एकीकृत कीट प्रबंधन का उपयोग करें। नीम का तेल, जैविक नियंत्रण और उचित फसल चक्र अपनाएं। रासायनिक दवाओं का सीमित उपयोग करें।"
        else:
            return "Use integrated pest management. Apply neem oil, biological control methods, and proper crop rotation. Use chemical pesticides sparingly."
    
    if any(word in message_lower for word in ["water", "irrigation", "पानी", "सिंचाई"]):
        if language == "hi":
            return "फसल के अनुसार सिंचाई करें। मिट्टी में नमी बनाए रखें लेकिन जलभराव से बचें। ड्रिप सिंचाई सबसे अच्छी है।"
        else:
            return "Irrigate according to crop needs. Maintain soil moisture but avoid waterlogging. Drip irrigation is most efficient."
    
    return responses["default"]

@app.get("/")
async def root():
    return {
        "message": "Welcome to FarmVerse Agriculture Chatbot API",
        "docs": "/docs",
        "status": "running"
    }

@app.get("/health", response_model=HealthResponse)
async def health_check():
    return HealthResponse(
        status="healthy",
        message="FarmVerse API is running",
        version="1.0.0"
    )

@app.post("/chat/text", response_model=SimpleChatResponse)
async def text_chat(request: SimpleChatRequest):
    """Simple text chat endpoint"""
    try:
        # Detect language
        detected_language = detect_language_simple(request.message)
        
        # Generate response
        response_text = generate_agriculture_response(request.message, detected_language)
        
        return SimpleChatResponse(
            response=response_text,
            detected_language=detected_language,
            timestamp=datetime.now()
        )
        
    except Exception as e:
        logger.error(f"Error in text chat: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to process chat request")

@app.get("/languages")
async def get_supported_languages():
    return {
        "supported_languages": ["en", "hi"],
        "language_names": {
            "en": "English",
            "hi": "Hindi"
        }
    }

@app.get("/test")
async def test_endpoint():
    """Test endpoint to verify API is working"""
    return {
        "message": "FarmVerse API is working correctly!",
        "timestamp": datetime.now(),
        "endpoints": [
            "GET /health - Health check",
            "POST /chat/text - Text chat",
            "GET /languages - Supported languages",
            "GET /docs - API documentation"
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main_simple:app", host="0.0.0.0", port=8000, reload=True)
