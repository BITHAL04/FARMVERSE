"""
Enhanced FarmVerse Agriculture Chatbot with Authentication
FastAPI application with Clerk integration and farmer profiles
"""
import os
import logging
from fastapi import FastAPI, HTTPException, Depends, File, UploadFile, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from contextlib import asynccontextmanager
import uvicorn
from pathlib import Path

# Import authentication components
from app.database.database import init_db, get_db
from app.services.auth_service import get_current_active_user
from app.database.models import User
from app.api.auth import router as auth_router
from app.api.onboarding import router as onboarding_router

# Import farming feature routers
from app.api.soil_testing import router as soil_testing_router
from app.api.farm_fields import router as farm_fields_router
from app.api.crop_planning import router as crop_planning_router
from app.api.weather_alerts import router as weather_alerts_router
from app.api.input_supply import router as input_supply_router
from app.api.expert_consultation import router as expert_consultation_router
from app.api.crop_insurance import router as crop_insurance_router
from app.api.market_linkage import router as market_linkage_router

# Import existing components
from app.models.chat_models import SimpleChatRequest, SimpleChatResponse
from app.services.language_service import LanguageService

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan manager
    """
    # Startup
    logger.info("Starting FarmVerse Agriculture Chatbot with Authentication...")
    
    # Initialize database
    try:
        init_db()
        logger.info("Database initialized successfully")
    except Exception as e:
        logger.error(f"Database initialization failed: {e}")
    
    # Initialize services
    global language_service
    language_service = LanguageService()
    logger.info("Services initialized")
    
    yield
    
    # Shutdown
    logger.info("Shutting down FarmVerse Agriculture Chatbot...")
    pass

# Create FastAPI application with authentication
app = FastAPI(
    title="FarmVerse Agriculture Chatbot",
    description="Multilingual Agriculture Chatbot with Authentication, Voice and Image Integration",
    version="2.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create static directory if it doesn't exist
static_dir = Path("static")
static_dir.mkdir(exist_ok=True)

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Include authentication routes
app.include_router(auth_router)
app.include_router(onboarding_router)

# Include farming feature routers
app.include_router(soil_testing_router)
app.include_router(farm_fields_router)
app.include_router(crop_planning_router)
app.include_router(weather_alerts_router)
app.include_router(input_supply_router)
app.include_router(expert_consultation_router)
app.include_router(crop_insurance_router)
app.include_router(market_linkage_router)

# Initialize services
language_service = None

@app.get("/")
async def root():
    """Welcome endpoint"""
    return {
        "message": "Welcome to FarmVerse - Complete Agriculture Platform with Authentication!",
        "version": "2.0.0",
        "features": [
            "User Authentication with Clerk",
            "OTP-based Phone Verification",
            "Farmer Profile Management with Badges",
            "Multilingual Chat (Hindi/English)",
            "Voice Integration (with API keys)",
            "Image Analysis (with API keys)",
            "Agriculture Expertise"
        ],
        "farming_modules": [
            "Soil Testing & Analysis",
            "Farm Field Management (GPS Mapping)",
            "Crop Planning & Calendar",
            "Weather Alerts & Forecasts",
            "Quality Input Supply Chain",
            "Expert Consultation Booking",
            "Crop Insurance Management",
            "Market Linkage & Mandi Rates"
        ],
        "docs": "/docs",
        "endpoints": {
            "authentication": "/auth",
            "onboarding": "/onboarding",
            "soil_testing": "/soil",
            "farm_fields": "/fields",
            "crop_planning": "/crops",
            "weather_alerts": "/weather",
            "input_supply": "/inputs",
            "expert_consultation": "/experts",
            "crop_insurance": "/insurance", 
            "market_linkage": "/market"
        }
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "FarmVerse Agriculture Chatbot",
        "version": "2.0.0",
        "timestamp": "2024-01-01T00:00:00Z",
        "database": "connected",
        "authentication": "active"
    }

@app.post("/chat/text", response_model=SimpleChatResponse)
async def text_chat(
    request: SimpleChatRequest,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Enhanced text chat with user context
    """
    try:
        user_message = request.message.strip()
        if not user_message:
            raise HTTPException(status_code=400, detail="Message cannot be empty")
        
        # Detect language
        detected_language = language_service.detect_language(user_message)
        
        # Get user's farmer profile for context
        farmer_context = ""
        if current_user.farmer_profile:
            profile = current_user.farmer_profile
            farmer_context = f"""
            User Context:
            - Name: {current_user.name}
            - Location: {profile.location}
            - Farm Size: {profile.farm_land_capacity} acres
            - Experience: {profile.farming_experience_years} years ({profile.experience_level})
            - Farming Types: {', '.join(profile.farming_type)}
            - Primary Crops: {', '.join(profile.primary_crops or [])}
            - Preferred Language: {profile.preferred_language}
            - Current Challenges: {', '.join(profile.challenges_faced or [])}
            """
        
        # Generate personalized agriculture response
        agriculture_response = _get_personalized_agriculture_response(
            user_message, detected_language, farmer_context
        )
        
        # Store chat history (optional)
        # You can implement chat session storage here
        
        return SimpleChatResponse(
            response=agriculture_response,
            detected_language=detected_language,
            user_id=str(current_user.id),
            farmer_context_used=bool(farmer_context)
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in text chat: {e}")
        raise HTTPException(status_code=500, detail=f"Chat processing failed: {str(e)}")

@app.post("/chat/voice")
async def voice_chat(
    audio: UploadFile = File(...),
    current_user: User = Depends(get_current_active_user)
):
    """
    Voice chat endpoint (requires API keys)
    """
    if not audio.content_type.startswith("audio/"):
        raise HTTPException(status_code=400, detail="File must be audio format")
    
    return {
        "message": "Voice chat feature requires API configuration",
        "user": current_user.name,
        "status": "not_configured",
        "required_keys": ["OPENAI_API_KEY", "GOOGLE_CLOUD_CREDENTIALS"]
    }

@app.post("/chat/image")
async def image_analysis(
    image: UploadFile = File(...),
    current_user: User = Depends(get_current_active_user)
):
    """
    Agricultural image analysis endpoint (requires API keys)
    """
    if not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be image format")
    
    return {
        "message": "Image analysis feature requires API configuration",
        "user": current_user.name,
        "status": "not_configured",
        "required_keys": ["OPENAI_API_KEY"]
    }

@app.get("/languages")
async def get_supported_languages():
    """Get supported languages"""
    return {
        "supported_languages": ["en", "hi"],
        "language_names": {
            "en": "English",
            "hi": "हिंदी (Hindi)"
        }
    }

@app.get("/farmer/recommendations")
async def get_farmer_recommendations(
    current_user: User = Depends(get_current_active_user)
):
    """
    Get personalized farming recommendations based on user profile
    """
    if not current_user.farmer_profile:
        raise HTTPException(
            status_code=404,
            detail="Farmer profile not found. Please create a farmer profile first."
        )
    
    profile = current_user.farmer_profile
    
    # Generate recommendations based on profile
    recommendations = {
        "seasonal_advice": _get_seasonal_advice(profile),
        "crop_suggestions": _get_crop_suggestions(profile),
        "technology_recommendations": _get_tech_recommendations(profile),
        "learning_resources": _get_learning_resources(profile),
        "problem_solutions": _get_problem_solutions(profile.challenges_faced or [])
    }
    
    return {
        "farmer": current_user.name,
        "location": profile.location,
        "recommendations": recommendations,
        "generated_at": "2024-01-01T00:00:00Z"
    }

@app.get("/test")
async def test_endpoint():
    """Test endpoint for basic functionality"""
    return {
        "status": "working",
        "message": "FarmVerse API with Authentication is running!",
        "features_available": [
            "User Authentication",
            "Farmer Profiles",
            "Basic Text Chat",
            "Profile Management"
        ],
        "requires_configuration": [
            "OpenAI API for Advanced Chat",
            "Google Cloud for Voice Features",
            "Clerk for Production Authentication"
        ]
    }

def _get_personalized_agriculture_response(message: str, language: str, farmer_context: str = "") -> str:
    """
    Generate personalized agriculture response based on user context
    """
    # Basic agriculture knowledge with personalization
    agriculture_responses = {
        'en': {
            'wheat': f"🌾 Wheat Farming Advice:\n{farmer_context}\nFor wheat cultivation, consider proper soil preparation with deep plowing. Plant in October-November for rabi season. Use quality seeds (25-30 kg/acre), ensure adequate irrigation, and apply balanced fertilization (NPK 120:60:40 kg/ha). Monitor for pests like aphids and diseases like rust.",
            'rice': f"🌾 Rice Cultivation Guide:\n{farmer_context}\nRice requires well-puddle fields with standing water. Transplant 20-25 day old seedlings with 20x15 cm spacing. Apply organic matter, maintain 2-3 cm water level, and use balanced fertilization. Watch for pests like stem borer and diseases like blast.",
            'fertilizer': f"🧪 Fertilization Advice:\n{farmer_context}\nUse soil testing to determine nutrient needs. Apply organic manure (5-10 tons/ha) before planting. For chemical fertilizers, use NPK based on crop requirements. Apply nitrogen in splits, phosphorus at planting, and potassium as needed.",
            'pest': f"🐛 Pest Management:\n{farmer_context}\nUse Integrated Pest Management (IPM) approach. Regular monitoring, biological control agents, crop rotation, and resistant varieties. Use chemical pesticides only when threshold levels are reached. Follow safety protocols and pre-harvest intervals.",
            'default': f"🌱 General Agriculture Advice:\n{farmer_context}\nFor sustainable farming, focus on soil health, water conservation, crop rotation, and integrated pest management. Consider your local climate, soil type, and market demands. Always use quality inputs and modern techniques while preserving traditional knowledge."
        },
        'hi': {
            'wheat': f"🌾 गेहूं की खेती की सलाह:\n{farmer_context}\nगेहूं की खेती के लिए मिट्टी की अच्छी तैयारी करें। अक्टूबर-नवंबर में बुआई करें। गुणवत्तापूर्ण बीज का उपयोग करें और संतुलित उर्वरक का प्रयोग करें।",
            'rice': f"🌾 धान की खेती गाइड:\n{farmer_context}\nधान के लिए खेत में पानी भरकर रखें। 20-25 दिन पुराने पौधे लगाएं। जैविक खाद का प्रयोग करें और कीटों से बचाव करें।",
            'fertilizer': f"🧪 उर्वरक की सलाह:\n{farmer_context}\nमिट्टी की जांच कराएं। जैविक खाद का अधिक प्रयोग करें। रासायनिक उर्वरक संतुलित मात्रा में डालें।",
            'pest': f"🐛 कीट प्रबंधन:\n{farmer_context}\nएकीकृत कीट प्रबंधन अपनाएं। नियमित निगरानी करें। जैविक नियंत्रण का प्रयोग करें।",
            'default': f"🌱 सामान्य कृषि सलाह:\n{farmer_context}\nटिकाऊ खेती के लिए मिट्टी की सेहत, जल संरक्षण, फसल चक्र और एकीकृत कीट प्रबंधन पर ध्यान दें। स्थानीय मौसम और बाजार की मांग को समझें।"
        }
    }
    
    # Determine response based on message content
    message_lower = message.lower()
    response_key = 'default'
    
    for key in ['wheat', 'rice', 'fertilizer', 'pest']:
        if key in message_lower or (key == 'fertilizer' and any(word in message_lower for word in ['fertilizer', 'खाद', 'उर्वरक'])):
            response_key = key
            break
    
    responses = agriculture_responses.get(language, agriculture_responses['en'])
    return responses.get(response_key, responses['default'])

def _get_seasonal_advice(profile) -> dict:
    """Generate seasonal farming advice"""
    return {
        "current_season": "Winter (Rabi)",
        "recommended_crops": ["wheat", "mustard", "gram", "peas"],
        "activities": [
            "Prepare fields for rabi crops",
            "Apply organic manure",
            "Check irrigation systems",
            "Plan crop rotation"
        ]
    }

def _get_crop_suggestions(profile) -> list:
    """Generate crop suggestions based on profile"""
    suggestions = []
    if profile.farm_land_capacity < 5:
        suggestions.extend(["vegetables", "herbs", "small grains"])
    elif profile.farm_land_capacity < 20:
        suggestions.extend(["wheat", "rice", "pulses", "oilseeds"])
    else:
        suggestions.extend(["cash crops", "commercial farming", "contract farming"])
    
    return suggestions

def _get_tech_recommendations(profile) -> list:
    """Generate technology recommendations"""
    recommendations = []
    
    if profile.tech_adoption_level == "basic":
        recommendations.extend([
            "Weather monitoring apps",
            "Soil testing kits",
            "Drip irrigation systems"
        ])
    elif profile.tech_adoption_level == "intermediate":
        recommendations.extend([
            "Precision farming tools",
            "Drone technology",
            "Smart irrigation systems"
        ])
    
    return recommendations

def _get_learning_resources(profile) -> list:
    """Generate learning resources"""
    return [
        "Agricultural extension services",
        "Farmer training programs",
        "Online agriculture courses",
        "Local farmer groups",
        "Government agricultural schemes"
    ]

def _get_problem_solutions(challenges: list) -> dict:
    """Generate solutions for common problems"""
    solutions = {}
    
    for challenge in challenges:
        if "water" in challenge.lower():
            solutions["water_management"] = [
                "Install drip irrigation",
                "Rainwater harvesting",
                "Mulching techniques",
                "Drought-resistant crops"
            ]
        elif "pest" in challenge.lower():
            solutions["pest_control"] = [
                "Integrated Pest Management",
                "Biological control agents",
                "Crop rotation",
                "Resistant varieties"
            ]
    
    return solutions

if __name__ == "__main__":
    # Load environment variables
    port = int(os.getenv("PORT", 8000))
    
    # Run the application
    uvicorn.run(
        "main_auth:app",
        host="0.0.0.0",
        port=port,
        reload=True,
        log_level="info"
    )
