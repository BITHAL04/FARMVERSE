# FarmVerse Agriculture Chatbot with Authentication

## 🌾 Enhanced Features Added

### ✅ User Authentication & Authorization
- **Clerk Integration**: Complete integration with Clerk authentication service
- **JWT Tokens**: Secure token-based authentication
- **Protected Endpoints**: Role-based access control
- **Mock Mode**: Development mode with simulated authentication

### ✅ Farmer Profile Management
- **Comprehensive Profiles**: Detailed farmer information storage
- **Personal Details**: Name, age, education, location with GPS coordinates
- **Farm Information**: Land capacity, farming types, primary crops
- **Experience Tracking**: Years of experience, skill level, previous work
- **Agricultural Details**: Irrigation methods, equipment, income range
- **Goals & Challenges**: Farming objectives and current problems
- **Technology Adoption**: Tech usage level and digital literacy

### ✅ Enhanced Chat System
- **User Context**: Personalized responses based on farmer profile
- **Multilingual Support**: Hindi and English with automatic detection
- **Agriculture Expertise**: Specialized knowledge base for farming
- **Session Management**: Conversation history and continuity

### ✅ New API Endpoints

#### Authentication Routes (`/auth/`)
- `POST /auth/login` - User login with Clerk token
- `GET /auth/profile` - Get user profile
- `POST /auth/profile/farmer` - Create farmer profile
- `PUT /auth/profile` - Update profile information
- `DELETE /auth/profile/farmer` - Delete farmer profile
- `GET /auth/profile/stats` - Profile completion statistics
- `POST /auth/webhook/clerk` - Clerk webhook handler

#### Enhanced Chat Routes
- `POST /chat/text` - Text chat with user context
- `POST /chat/voice` - Voice chat (requires API keys)
- `POST /chat/image` - Image analysis (requires API keys)

#### Farmer Services
- `GET /farmer/recommendations` - Personalized farming advice
- `GET /languages` - Supported languages

## 🚀 Quick Start

### 1. Server Setup
```bash
# Install dependencies
pip install -r requirements.txt

# Initialize database
python -c "from app.database.database import init_db; init_db()"

# Start server
python main_auth.py
```

### 2. Test Authentication
```bash
# Run demo
python demo_auth.py
```

### 3. API Documentation
Visit: http://localhost:8000/docs

## 🔧 Configuration

### Environment Variables (.env)
```env
# Database
DATABASE_URL=sqlite:///./farmverse.db

# JWT Settings
JWT_SECRET_KEY=your-super-secret-key
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Clerk Authentication
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key
CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key

# Optional API Keys
OPENAI_API_KEY=your_openai_key
GOOGLE_APPLICATION_CREDENTIALS=path/to/credentials.json
```

### Clerk Setup
1. Sign up at [clerk.dev](https://clerk.dev)
2. Create a new application
3. Get your API keys from the dashboard
4. Add to `.env` file
5. Configure webhook endpoints

## 📊 Database Schema

### Users Table
- Basic user information from Clerk
- Email, name, phone, status
- Clerk user ID mapping

### Farmer Profiles Table
- Comprehensive farming information
- Location with GPS coordinates
- Farm details and equipment
- Experience and goals
- Technology adoption level

### Chat System Tables
- Session management
- Message history
- User context tracking

## 🎯 Usage Examples

### 1. User Registration & Login
```python
# Login with Clerk token
POST /auth/login
{
  "clerk_session_token": "session_token_from_clerk"
}
```

### 2. Create Farmer Profile
```python
POST /auth/profile/farmer
{
  "farmer_profile": {
    "location": "Punjab, India",
    "farm_land_capacity": 25.5,
    "farming_type": ["crop_farming"],
    "primary_crops": ["wheat", "rice"],
    "farming_experience_years": 15,
    "experience_level": "intermediate",
    "age": 45,
    "preferred_language": "hi"
  }
}
```

### 3. Personalized Chat
```python
# With farmer context
POST /chat/text
Headers: Authorization: Bearer jwt_token
{
  "message": "What fertilizer should I use for wheat?"
}

# Response includes personalized advice based on:
# - User's location and climate
# - Farm size and type
# - Experience level
# - Current challenges
```

## 🔒 Security Features

### Authentication
- Clerk integration for secure user management
- JWT tokens with expiration
- Protected route middleware
- Session management

### Authorization
- Role-based access control
- User-specific data isolation
- Secure API endpoints
- CORS configuration

### Data Protection
- Input validation with Pydantic
- SQL injection prevention
- Secure password handling
- Environment-based configuration

## 🌐 Multilingual Support

### Languages
- **English**: Full support with agriculture terminology
- **Hindi**: Native Devanagari script support
- **Auto-detection**: Automatic language identification

### Features
- Script detection (Latin, Devanagari)
- Context-aware translation
- Language-specific responses
- User preference storage

## 📱 Integration Ready

### Frontend Integration
- RESTful API design
- JWT token authentication
- CORS enabled
- OpenAPI documentation

### Mobile Support
- Responsive API design
- Voice and image endpoints
- Offline capability ready
- Progressive Web App compatible

## 🔄 Development vs Production

### Development Mode
- Mock Clerk authentication
- SQLite database
- Local file storage
- Debug logging enabled

### Production Ready
- Real Clerk integration
- PostgreSQL support
- Cloud storage integration
- Performance optimizations

## 📈 Profile Completion Tracking

### Completion Metrics
- Basic information (name, email)
- Contact details (phone)
- Farmer profile existence
- Location information
- Farm details completeness

### Recommendations
- Profile improvement suggestions
- Missing information alerts
- Completion percentage tracking
- Personalized next steps

## 🎨 Customization

### Adding New Profile Fields
1. Update `FarmerProfile` model in `auth_models.py`
2. Add database migration
3. Update API endpoints
4. Modify validation logic

### Extending Authentication
1. Add custom claims to JWT
2. Implement role-based permissions
3. Add OAuth providers
4. Customize user workflows

## 🚀 Next Steps

### Immediate
1. Configure Clerk authentication
2. Deploy to production environment
3. Add frontend application
4. Configure external APIs

### Future Enhancements
1. Advanced analytics dashboard
2. IoT device integration
3. Market price integration
4. Weather API integration
5. Crop monitoring features
6. Community features (forums, groups)
7. Expert consultation booking
8. Marketplace integration

---

**Status**: ✅ Authentication system fully implemented and tested
**Version**: 2.0.0 with Authentication
**Last Updated**: September 1, 2025
