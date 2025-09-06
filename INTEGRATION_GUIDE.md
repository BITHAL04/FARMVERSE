# FarmVerse - Complete Integration Guide

🌾 **Welcome to FarmVerse** - A comprehensive digital agriculture platform with integrated backend and frontend features.

## 🚀 Quick Start

### Prerequisites
- Python 3.8 or higher
- Node.js 16 or higher
- npm or yarn package manager

### 1. Backend Setup & Launch

```bash
# Install Python dependencies
pip install -r requirements.txt

# Initialize database and start backend server
python run_app.py
```

The backend will be available at: **http://localhost:8000**
- API Documentation: **http://localhost:8000/docs**
- Interactive API Explorer: **http://localhost:8000/redoc**

### 2. Frontend Setup & Launch

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install
# or
yarn install

# Start development server
npm run dev
# or
yarn dev
```

The frontend will be available at: **http://localhost:5173**

### 3. Test the Integration

```bash
# Run feature tests (optional)
python test_features.py
```

## 🎯 Integrated Features

All features are now fully integrated with the backend API:

### 1. **Soil Testing** 🧪
- **Frontend**: Complete soil testing interface with step-by-step guidance
- **Backend**: POST/GET `/api/v1/farming/soil/tests`
- **Features**: pH analysis, nutrient levels, personalized recommendations
- **Integration**: Real-time data storage and retrieval

### 2. **Farm Tagging & GPS Mapping** 🗺️
- **Frontend**: Interactive field management with GPS coordinates
- **Backend**: POST/GET `/api/v1/farming/fields`
- **Features**: Field mapping, area calculation, GPS precision
- **Integration**: Database persistence with location data

### 3. **AI-Powered Crop Planner** 🌱
- **Frontend**: Smart crop planning with seasonal recommendations
- **Backend**: POST/GET `/api/v1/farming/crop-planner/plans`
- **Features**: AI recommendations, profit analysis, water optimization
- **Integration**: Personalized plans based on farm data

### 4. **Weather Alerts** 🌦️
- **Frontend**: Real-time weather monitoring and alerts
- **Backend**: GET `/api/v1/farming/weather/alerts`
- **Features**: Live weather data, crop-specific alerts, forecasting
- **Integration**: Dynamic alert system with severity levels

### 5. **Quality Input Access** 📦
- **Frontend**: Supplier directory and product catalog
- **Backend**: GET `/api/v1/farming/inputs/suppliers`
- **Features**: Verified suppliers, product search, ratings
- **Integration**: Real supplier data with contact information

### 6. **Expert Connect** 👨‍🌾
- **Frontend**: Expert consultation booking system
- **Backend**: POST/GET `/api/v1/farming/experts/consultations`
- **Features**: Expert profiles, consultation booking, ratings
- **Integration**: Real-time consultation management

### 7. **Crop Insurance** 🛡️
- **Frontend**: Insurance plan comparison and application
- **Backend**: POST/GET `/api/v1/farming/insurance/policies`
- **Features**: Policy management, claim filing, coverage analysis
- **Integration**: Full insurance lifecycle management

### 8. **Mandi Rate & Market Linkage** 💰
- **Frontend**: Real-time market prices and selling platform
- **Backend**: GET/POST `/api/v1/farming/market/prices`
- **Features**: Live market rates, direct selling, price alerts
- **Integration**: Dynamic pricing with market trends

### 9. **Live Field Monitoring** 📊
- **Frontend**: Real-time sensor data visualization
- **Backend**: GET `/api/v1/features/live-monitoring`
- **Features**: IoT sensor data, field health metrics, alerts
- **Integration**: Live data streaming and analytics

### 10. **KhetGuru AI Chat** 🤖
- **Frontend**: Interactive agricultural assistance
- **Backend**: POST `/api/v1/features/chat`
- **Features**: Multi-language support, knowledge base, context-aware
- **Integration**: AI-powered responses with farming expertise

## 🔧 API Integration Details

### Authentication
```bash
# Register new user
POST /api/v1/register
{
  "email": "farmer@example.com",
  "password": "secure123",
  "name": "Farmer Name"
}

# Login
POST /api/v1/login
{
  "email": "farmer@example.com", 
  "password": "secure123"
}
# Returns: {"token": "jwt_token_here"}
```

### Using Authenticated Endpoints
```javascript
const token = localStorage.getItem('token');
const headers = {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
};

// Example: Create soil test
fetch('/api/v1/farming/soil/tests', {
  method: 'POST',
  headers,
  body: JSON.stringify({
    ph: 6.5,
    nitrogen: 25,
    phosphorus: 18,
    potassium: 120,
    notes: "Field A soil test"
  })
});
```

## 📊 Database Schema

The system uses SQLite with the following main tables:
- `users` - User accounts and authentication
- `soil_tests` - Soil analysis records
- `farm_fields` - GPS-tagged field information
- `crop_plans` - AI-generated crop recommendations
- `weather_alerts` - Weather monitoring data
- `input_suppliers` - Certified supplier directory
- `expert_consultations` - Expert booking records
- `insurance_policies` - Crop insurance data
- `market_prices` - Real-time market rates

## 🌐 Frontend-Backend Communication

### Environment Configuration
Create `.env` file in frontend directory:
```bash
VITE_API_BASE_URL=http://localhost:8000
```

### API Integration Pattern
```typescript
// Frontend API integration example
const API_BASE = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:8000';

const createSoilTest = async (data) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE}/api/v1/farming/soil/tests`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    throw new Error('Failed to create soil test');
  }
  
  return response.json();
};
```

## 🔍 Testing & Validation

### Manual Testing Checklist
- [ ] Backend server starts successfully
- [ ] Frontend development server runs
- [ ] API documentation accessible
- [ ] User registration/login works
- [ ] All 8 main features load and function
- [ ] Database operations work (CRUD)
- [ ] Real-time data updates
- [ ] Error handling works

### Automated Testing
```bash
# Run backend tests
python test_features.py

# Run frontend tests (if available)
cd frontend
npm test
```

## 🚀 Production Deployment

### Backend Production
```bash
# Install production dependencies
pip install gunicorn

# Run with gunicorn
gunicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Frontend Production
```bash
cd frontend

# Build for production
npm run build

# Serve built files
npm run preview
# or use a production server like nginx
```

### Environment Variables
```bash
# Backend (.env)
DATABASE_URL=sqlite:///farmverse_prod.db
SECRET_KEY=your_secret_key_here
OPENAI_API_KEY=your_openai_key_here

# Frontend (.env.production)
VITE_API_BASE_URL=https://your-api-domain.com
```

## 🛟 Troubleshooting

### Common Issues

**Backend won't start:**
```bash
# Check Python version
python --version  # Should be 3.8+

# Install missing dependencies
pip install -r requirements.txt

# Check port availability
netstat -an | grep 8000
```

**Frontend won't connect to backend:**
```bash
# Check CORS settings in main.py
# Verify API_BASE_URL in frontend/.env
# Check backend server is running on port 8000
```

**Database errors:**
```bash
# Remove and recreate database
rm farmverse.db
python run_app.py
```

**Feature not loading:**
```bash
# Check browser console for errors
# Verify API endpoint in backend
# Test endpoint with curl or Postman
```

## 📈 Performance Monitoring

### Key Metrics to Monitor
- API response times
- Database query performance
- Frontend load times
- User engagement with features
- Error rates and logs

### Monitoring Tools
- Backend: FastAPI built-in metrics
- Frontend: Browser dev tools
- Database: SQLite performance logs
- Network: Browser network tab

## 🔐 Security Considerations

### Implemented Security Features
- JWT token authentication
- Password hashing with bcrypt
- CORS protection
- Input validation
- SQL injection prevention

### Additional Security (for production)
- HTTPS encryption
- Rate limiting
- Input sanitization
- Regular security updates
- Environment variable protection

## 📞 Support & Contact

For technical support or questions:
- Create an issue in the repository
- Check the API documentation at `/docs`
- Review the troubleshooting section above

---

🎉 **Congratulations!** You now have a fully integrated FarmVerse system with all features working seamlessly between frontend and backend.

Happy Farming! 🌾
