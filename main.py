"""
FarmVerse - Agriculture Chatbot API
Main FastAPI application with multilingual support, voice integration, and image processing
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
import logging
from typing import Optional, Dict, Any, List

"""
from app.services.chat_service import ChatService
from app.services.voice_service import VoiceService
from app.services.image_service import ImageService
from app.services.language_service import LanguageService
from app.models.chat_models import (
    ChatRequest, 
    ChatResponse, 
    VoiceChatRequest, 
    VoiceChatResponse,
    ImageChatRequest,
    ImageChatResponse,
    HealthResponse
)
from app.core.config import settings
from app.core.exceptions import ChatbotException
"""
from api.features_routes import router as features_router
from app.api.auth import router as auth_router
from app.api.farming import router as farming_router
from app.api.ai import router as ai_router
from settings import get_settings

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="FarmVerse Agriculture + KhetGuru Chatbot",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Add CORS middleware
origins = [o.strip() for o in settings.allow_origins.split(',') if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

## Service initializations removed for minimal backend

# Include additional routes
app.include_router(features_router, prefix="/api/v1/features", tags=["features"])
app.include_router(auth_router, prefix="/api/v1", tags=["auth"])
app.include_router(farming_router, prefix="/api/v1", tags=["farming"])
app.include_router(ai_router, prefix="/api/v1", tags=["ai"])

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")


## Startup/shutdown events removed for minimal backend


@app.get("/", response_model=Dict[str, str])
async def root():
    """Root endpoint"""
    return {
        "message": "Welcome to FarmVerse Agriculture Chatbot API",
        "docs": "/docs",
        "redoc": "/redoc"
    }


@app.get("/health")
async def health():
    return {"status": "ok", "version": settings.app_version}


## /chat/text endpoint commented out for minimal backend


## /chat/voice endpoint commented out for minimal backend


## /chat/image endpoint commented out for minimal backend


## /languages endpoint commented out for minimal backend


## /chat/history endpoint commented out for minimal backend


## /chat/history delete endpoint commented out for minimal backend


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
