🌾 FarmVerse - Complete Agriculture Platform Backend
A comprehensive FastAPI-based multilingual agriculture platform with authentication, farming management tools, and AI-powered assistance.

🚀 Quick Start
# Clone and setup
git clone <your-repo-url>
cd farmverse

# Create virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1  # Windows PowerShell

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Add your Clerk API keys to .env

# Run the application
python main_auth.py
🌐 Access your platform:

API Server: http://localhost:8000
API Documentation: http://localhost:8000/docs
Simple Version: python main_simple.py (for basic testing)
✨ Features Overview
🔐 Authentication & User Management
Clerk Integration: JWT-based authentication with session management
OTP Verification: Phone number verification for enhanced security
Farmer Profiles: Comprehensive profiles with location, land capacity, experience
Rewards System: Badges and points for platform engagement
🌾 Complete Farming Suite
Module	Features	Endpoints
🧪 Soil Testing	Lab integration, test reports, recommendations	2 APIs
🗺 Farm Fields	GPS mapping, field management, crop tracking	2 APIs
🌱 Crop Planning	Seasonal planning, calendar, variety selection	2 APIs
🌤 Weather Alerts	Real-time alerts, notifications, forecasts	2 APIs
🛒 Input Supply	Quality suppliers, ratings, bulk ordering	2 APIs
👨‍🌾 Expert Consultation	Booking system, video calls, expert ratings	2 APIs
🛡 Crop Insurance	Policy management, claims, coverage	2 APIs
💰 Market Linkage	Mandi rates, produce selling, buyer connection	2 APIs
🤖 AI-Powered Assistance
Primary LLM: OpenAI GPT-3.5-Turbo with agriculture specialization
Multilingual: English + Hindi with automatic detection
Smart Fallback: Built-in agriculture knowledge base
Voice Integration: Speech-to-text and text-to-speech ready
🏗 Project Structure
FarmVerse/
├── app/
│   ├── api/                     # 🔗 API Routes (10 modules)
│   │   ├── auth.py             # Authentication endpoints
│   │   ├── onboarding.py       # OTP & profile setup
│   │   ├── soil_testing.py     # Soil analysis features
│   │   ├── farm_fields.py      # Field management
│   │   ├── crop_planning.py    # Crop planning tools
│   │   ├── weather_alerts.py   # Weather monitoring
│   │   ├── input_supply.py     # Input supplier network
│   │   ├── expert_consultation.py # Expert booking
│   │   ├── crop_insurance.py   # Insurance management
│   │   └── market_linkage.py   # Market connectivity
│   ├── core/                   # ⚙ Core Configuration
│   ├── database/              # 🗄 Database Layer
│   │   ├── models.py          # Core user & auth models
│   │   ├── farming_models.py  # Farming domain models
│   │   └── database.py        # Database connection
│   ├── services/              # 🔧 Business Logic
│   │   ├── auth_service.py    # Clerk authentication
│   │   ├── otp_service.py     # Phone verification
│   │   ├── chat_service.py    # OpenAI LLM integration
│   │   └── language_service.py # Translation services
│   └── utils/                 # 🛠 Utilities
├── static/                    # 📁 Static Files
├── tests/                     # 🧪 Test Suite
├── examples/                  # 📚 Usage Examples
├── main_auth.py              # 🚀 Full Application
├── main_simple.py            # 🏃 Basic Version
└── requirements.txt          # 📦 Dependencies
🔧 Configuration
Environment Variables (.env)
# Authentication (Required)
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key
JWT_SECRET_KEY=your_jwt_secret_key

# Database
DATABASE_URL=sqlite:///./farmverse.db

# AI Features (Optional - has fallback)
OPENAI_API_KEY=your_openai_api_key_optional

# SMS Service (Optional - development mode available)
SMS_SERVICE_URL=your_sms_service_url
SMS_API_KEY=your_sms_api_key

# Language Support
SUPPORTED_LANGUAGES=en,hi
Required API Keys
Clerk Authentication (Required):

Get keys from Clerk Dashboard
Add webhook endpoints for user sync
OpenAI API (Optional):

Get key from OpenAI Platform
Enables enhanced AI responses
Falls back to built-in knowledge if not provided
SMS Service (Optional):

Use Twilio, MSG91, or similar
Development mode works without real SMS
📚 API Documentation
🔐 Authentication Flow
# 1. User signs up/logs in via Clerk
POST /auth/register
POST /auth/login

# 2. Optional OTP verification
POST /onboarding/auth/otp/request
POST /onboarding/auth/otp/verify

# 3. Create farmer profile
POST /onboarding/profile
🌾 Farming Operations
Each farming module follows consistent patterns:

# Get user's data
GET /farming/{module}

# Create new record
POST /farming/{module}

# Examples:
GET /farming/soil-testing     # Get soil test reports
POST /farming/soil-testing    # Submit new soil test
GET /farming/farm-fields      # Get farm fields
POST /farming/farm-fields     # Add new field
🤖 Chat Integration
# AI-powered agriculture assistance
POST /chat
{
    "message": "What fertilizer should I use for wheat in winter?",
    "language": "en"  # or "hi" for Hindi
}
🗄 Database Schema
Core Models
User: Basic user information and Clerk integration
FarmerProfile: Detailed farmer information (location, land, experience)
OTPCode: Phone verification codes with expiry
Badge/UserBadge: Gamification and rewards system
Farming Models
SoilTest: Laboratory soil analysis results
FarmField: GPS-mapped farm fields with crop history
CropPlan: Seasonal crop planning with calendars
WeatherAlert: Location-based weather notifications
InputSupplier: Verified input supplier network
ExpertConsultation: Expert booking and consultation history
InsurancePolicy: Crop insurance policies and claims
MarketPrice/ProduceListing: Market rates and produce selling
🔐 Security Features
JWT Authentication: Secure token-based authentication
Clerk Integration: Enterprise-grade user management
OTP Verification: Phone number verification
Input Validation: Comprehensive request validation
Error Handling: Secure error responses
CORS Protection: Configurable cross-origin policies
🌍 Multilingual Support
Languages: English (en) + Hindi (hi)
Auto-Detection: Automatic language detection
Translation: Google Translate integration
LLM Responses: Language-specific AI responses
🚀 Deployment Options
Local Development
python main_auth.py  # Full platform
python main_simple.py  # Basic chat only
Production Deployment
Option 1: Docker

FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "main_auth:app", "--host", "0.0.0.0", "--port", "8000"]
Option 2: Cloud Platforms

Deployment
Frontend
Create a .env inside agri-play/frontend:
VITE_API_BASE_URL=https://your-api-host
Build assets:
cd agri-play/frontend
npm install
npm run build
Serve agri-play/frontend/dist with any static server (Nginx, Vercel, Netlify, etc.). Example Nginx location block:
location / {
  root /var/www/farmverse/dist;
  try_files $uri /index.html;
}
Backend
Run with Uvicorn / Gunicorn:

pip install -r requirements.txt
uvicorn main_auth:app --host 0.0.0.0 --port 8000
Docker (example snippet)
Combine a production image building backend and copying frontend dist into static/ to be served via FastAPI or a reverse proxy. Ensure CORS origins match your deployed frontend URL.

Health Check
Frontend shows a red banner if the backend /docs endpoint is unreachable.

Environment Variables
Adjust API base: VITE_API_BASE_URL (frontend) and backend settings in app/core/config.py for database and JWT secrets.

🧪 Testing
# Run all tests
python -m pytest tests/

# Test specific modules
python -m pytest tests/test_auth.py
python -m pytest tests/test_farming.py
📱 Frontend Integration
React/Next.js Integration
// Configure Clerk in your frontend
const clerkPubKey = "pk_test_aW5jbHVkZWQtbW9uaXRvci00OC5jbGVyay5hY2NvdW50cy5kZXYk";

// API calls with authentication
const apiCall = async (endpoint, data) => {
  const response = await fetch(http://localhost:8000${endpoint}, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': Bearer ${await getToken()}
    },
    body: JSON.stringify(data)
  });
  return response.json();
};

// Example: Create soil test
const soilTest = await apiCall('/farming/soil-testing', {
  fieldId: "field123",
  soilType: "loamy",
  phLevel: 6.5,
  // ... other parameters
});
Key Integration Points
Authentication: Use Clerk's frontend SDK with your publishable key
API Endpoints: All endpoints documented at /docs
Error Handling: Consistent error response format
File Uploads: Support for images in insurance and expert consultation
Real-time: WebSocket support for weather alerts and notifications
🛠 Development
Adding New Features
Create Database Model in app/database/farming_models.py
Add API Router in app/api/new_feature.py
Register Router in main_auth.py
Update Requirements if new dependencies needed
Custom Agriculture Logic
The platform includes extensive agriculture knowledge in:

app/training/agriculture_knowledge.py: Crop-specific information
app/services/chat_service.py: AI response handling
Each API module: Feature-specific business logic
📊 Performance & Scalability
Async FastAPI: High-performance async request handling
Database: SQLAlchemy ORM with connection pooling
Caching: Redis-ready for session and data caching
Background Tasks: Celery-ready for async operations
Monitoring: Structured logging for production monitoring
🤝 Contributing
Fork the repository
Create feature branch (git checkout -b feature/amazing-feature)
Follow existing code patterns and add tests
Update documentation if needed
Submit pull request
📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

🙋‍♂ Support
Documentation: Full API docs at /docs when running
Issues: Create GitHub issues for bugs/features
Community: Join our farming tech community
🎯 Production Readiness Checklist
✅ Authentication: Clerk integration with JWT tokens
✅ Database: Complete schema with 14+ models
✅ APIs: 21 endpoints across 10 modules
✅ AI Integration: OpenAI GPT-3.5-Turbo with fallback
✅ Multilingual: English + Hindi support
✅ OTP System: Phone verification with security
✅ Error Handling: Comprehensive exception management
✅ Documentation: Interactive Swagger UI
✅ Testing: Test suite with examples
✅ Dependencies: All packages specified and tested

🚀 Status: READY FOR PRODUCTION DEPLOYMENT!

Built with ❤ for farmers worldwide 🌍🚜
