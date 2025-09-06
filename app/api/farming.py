from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.database.models import SoilTest, FarmField, CropPlan, WeatherAlert, InputSupplier, ExpertConsultation, InsurancePolicy, MarketPrice, Badge, UserBadge, User
from pydantic import BaseModel
from typing import Optional, List
from app.services.auth_service import decode_token
from datetime import datetime

router = APIRouter(prefix="/farming", tags=["farming"])

# Utility auth dependency

def current_user(authorization: str = Header(None), db: Session = Depends(get_db)) -> User:
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(status_code=401, detail="Missing token")
    token = authorization.split()[1]
    sub = decode_token(token)
    if not sub:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = db.query(User).get(int(sub))
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# Soil Tests
class SoilTestCreate(BaseModel):
    ph: float
    nitrogen: float
    phosphorus: float
    potassium: float
    notes: Optional[str] = None

@router.post("/soil/tests")
def create_soil_test(payload: SoilTestCreate, user: User = Depends(current_user), db: Session = Depends(get_db)):
    rec = SoilTest(user_id=user.id, ph=payload.ph, nitrogen=payload.nitrogen, phosphorus=payload.phosphorus, potassium=payload.potassium, recommendation=payload.notes or "Balanced fertilizer schedule suggested.")
    db.add(rec)
    db.commit()
    db.refresh(rec)
    return rec

@router.get("/soil/tests")
def list_soil_tests(user: User = Depends(current_user), db: Session = Depends(get_db)):
    return db.query(SoilTest).filter(SoilTest.user_id==user.id).order_by(SoilTest.id.desc()).all()

# Farm Fields
class FieldCreate(BaseModel):
    name: str
    area_acres: float
    latitude: float
    longitude: float
    notes: Optional[str] = None

@router.post("/fields")
def create_field(payload: FieldCreate, user: User = Depends(current_user), db: Session = Depends(get_db)):
    field = FarmField(user_id=user.id, **payload.dict())
    db.add(field)
    db.commit()
    db.refresh(field)
    return field

@router.get("/fields")
def list_fields(user: User = Depends(current_user), db: Session = Depends(get_db)):
    return db.query(FarmField).filter(FarmField.user_id==user.id).all()

# Crop Plans
class CropPlanCreate(BaseModel):
    crop: str
    season: str
    notes: Optional[str] = None

@router.post("/crop-planner/plans")
def create_crop_plan(payload: CropPlanCreate, user: User = Depends(current_user), db: Session = Depends(get_db)):
    plan = CropPlan(user_id=user.id, crop=payload.crop, season=payload.season, notes=payload.notes)
    db.add(plan)
    db.commit()
    db.refresh(plan)
    return plan

@router.get("/crop-planner/plans")
def list_crop_plans(user: User = Depends(current_user), db: Session = Depends(get_db)):
    return db.query(CropPlan).filter(CropPlan.user_id==user.id).all()

# Weather Alerts
class WeatherAlertCreate(BaseModel):
    title: str
    severity: str  # info|warning|danger
    message: str
    scope: Optional[str] = None  # 'user' for user-specific, else global

@router.get("/weather/alerts")
def list_weather_alerts(db: Session = Depends(get_db)):
    return db.query(WeatherAlert).order_by(WeatherAlert.id.desc()).limit(20).all()

@router.get("/weather/alerts/my")
def list_my_weather_alerts(user: User = Depends(current_user), db: Session = Depends(get_db)):
    # union of global (user_id is null) and user-specific
    return db.query(WeatherAlert).filter(
        (WeatherAlert.user_id == None) | (WeatherAlert.user_id == user.id)  # noqa: E711
    ).order_by(WeatherAlert.id.desc()).limit(20).all()

@router.post("/weather/alerts")
def create_weather_alert(payload: WeatherAlertCreate, user: User = Depends(current_user), db: Session = Depends(get_db)):
    uid = user.id if (payload.scope or '').lower() == 'user' else None
    wa = WeatherAlert(user_id=uid, title=payload.title, severity=payload.severity, message=payload.message)
    db.add(wa)
    db.commit()
    db.refresh(wa)
    return wa

@router.post("/weather/alerts/seed")
def seed_weather_alerts(db: Session = Depends(get_db)):
    # idempotent seed: insert 3 globals if none exist
    if db.query(WeatherAlert).count() == 0:
        for t, s, m in [
            ("Heavy Rainfall Alert", "warning", "Heavy rains expected in the next 24 hours. Drain excess water."),
            ("High Wind Advisory", "info", "Gusty winds likely. Secure farm structures and nets."),
            ("Heatwave Warning", "danger", "Severe heatwave conditions. Irrigate in evening, avoid mid-day work."),
        ]:
            db.add(WeatherAlert(title=t, severity=s, message=m))
        db.commit()
        return {"inserted": 3}
    return {"inserted": 0}

# Input Suppliers (with fallback data)
class SupplierResponse(BaseModel):
    id: int
    name: str
    category: str
    contact: str
    location: str
    rating: Optional[float] = 4.5
    verified: Optional[bool] = True
    specializations: Optional[List[str]] = []
    price_range: Optional[str] = "Mid-range"
    description: Optional[str] = None

class ProductResponse(BaseModel):
    id: int
    name: str
    category: str
    supplier: str
    price: float
    unit: str
    rating: float
    in_stock: bool
    organic: bool
    description: str

@router.get("/inputs/suppliers")
def list_suppliers(db: Session = Depends(get_db)):
    q = db.query(InputSupplier).limit(50).all()
    if not q:
        # Add some sample suppliers if none exist
        sample_suppliers = [
            InputSupplier(name="AgriSeeds Pro", category="Seeds", contact="9876543210", location="Delhi"),
            InputSupplier(name="FarmTech Solutions", category="Fertilizers", contact="9876543211", location="Mumbai"),
            InputSupplier(name="Green Harvest", category="Equipment", contact="9876543212", location="Bangalore"),
            InputSupplier(name="Organic Plus", category="Pesticides", contact="9876543213", location="Pune"),
            InputSupplier(name="KisanMart", category="Seeds", contact="9876543214", location="Hyderabad"),
        ]
        for supplier in sample_suppliers:
            db.add(supplier)
        try:
            db.commit()
            return db.query(InputSupplier).limit(50).all()
        except:
            db.rollback()
            return [{"name": s.name, "category": s.category, "contact": s.contact, "location": s.location} for s in sample_suppliers]
    
    # Enhance suppliers with additional data
    enhanced_suppliers = []
    for supplier in q:
        specializations = get_supplier_specializations(supplier.category)
        enhanced_suppliers.append({
            "id": supplier.id,
            "name": supplier.name,
            "category": supplier.category,
            "contact": supplier.contact,
            "location": supplier.location,
            "rating": 4.5,
            "verified": True,
            "specializations": specializations,
            "price_range": "Mid-range",
            "description": f"Trusted supplier of quality {supplier.category.lower()} with 10+ years of experience."
        })
    
    return enhanced_suppliers

def get_supplier_specializations(category: str) -> List[str]:
    """Get specializations based on supplier category"""
    specializations = {
        "Seeds": ["Hybrid Varieties", "Organic Seeds", "Disease Resistant", "High Yield"],
        "Fertilizers": ["NPK Complex", "Organic Compost", "Micronutrients", "Bio-fertilizers"],
        "Equipment": ["Irrigation Systems", "Harvesting Tools", "Soil Preparation", "Spraying Equipment"],
        "Pesticides": ["Bio-pesticides", "Fungicides", "Herbicides", "Insecticides"]
    }
    return specializations.get(category, ["General Agricultural Inputs"])

@router.get("/inputs/products")
def list_products():
    """Get list of available products from suppliers"""
    products = [
        {
            "id": 1,
            "name": "Premium Wheat Seeds (HD-2967)",
            "category": "Seeds",
            "supplier": "AgriSeeds Pro",
            "price": 45,
            "unit": "kg",
            "rating": 4.6,
            "in_stock": True,
            "organic": False,
            "description": "High-yielding, disease-resistant wheat variety suitable for all soil types"
        },
        {
            "id": 2,
            "name": "Organic NPK Fertilizer",
            "category": "Fertilizers",
            "supplier": "FarmTech Solutions",
            "price": 1200,
            "unit": "50kg bag",
            "rating": 4.4,
            "in_stock": True,
            "organic": True,
            "description": "Complete nutrition for all crops with organic certification"
        },
        {
            "id": 3,
            "name": "Drip Irrigation Kit",
            "category": "Equipment",
            "supplier": "Green Harvest",
            "price": 15000,
            "unit": "set",
            "rating": 4.7,
            "in_stock": True,
            "organic": False,
            "description": "Water-efficient irrigation system for 1 acre with installation support"
        },
        {
            "id": 4,
            "name": "Neem Oil Pesticide",
            "category": "Pesticides",
            "supplier": "Organic Plus",
            "price": 350,
            "unit": "1 liter",
            "rating": 4.5,
            "in_stock": True,
            "organic": True,
            "description": "Natural pest control solution safe for beneficial insects"
        },
        {
            "id": 5,
            "name": "Hybrid Rice Seeds (IR-64)",
            "category": "Seeds",
            "supplier": "KisanMart",
            "price": 55,
            "unit": "kg",
            "rating": 4.3,
            "in_stock": True,
            "organic": False,
            "description": "High-yielding rice variety with excellent grain quality"
        },
        {
            "id": 6,
            "name": "Vermicompost",
            "category": "Fertilizers",
            "supplier": "Organic Plus",
            "price": 800,
            "unit": "50kg bag",
            "rating": 4.8,
            "in_stock": True,
            "organic": True,
            "description": "Rich organic fertilizer made from earthworm castings"
        }
    ]
    return {"products": products, "total": len(products)}

@router.get("/inputs/categories")
def get_input_categories():
    """Get list of input categories with descriptions"""
    categories = [
        {
            "id": 1,
            "name": "Seeds",
            "description": "Certified seeds for various crops",
            "icon": "🌱",
            "product_count": 25
        },
        {
            "id": 2,
            "name": "Fertilizers",
            "description": "Organic and chemical fertilizers",
            "icon": "🌿",
            "product_count": 18
        },
        {
            "id": 3,
            "name": "Equipment",
            "description": "Farming tools and machinery",
            "icon": "🔧",
            "product_count": 32
        },
        {
            "id": 4,
            "name": "Pesticides",
            "description": "Pest and disease control products",
            "icon": "🛡️",
            "product_count": 15
        }
    ]
    return {"categories": categories}

@router.get("/inputs/suppliers/{category}")
def get_suppliers_by_category(category: str, db: Session = Depends(get_db)):
    """Get suppliers filtered by category"""
    suppliers = db.query(InputSupplier).filter(InputSupplier.category.ilike(f"%{category}%")).all()
    if not suppliers:
        return {"message": f"No suppliers found for category: {category}", "suppliers": []}
    
    enhanced_suppliers = []
    for supplier in suppliers:
        specializations = get_supplier_specializations(supplier.category)
        enhanced_suppliers.append({
            "id": supplier.id,
            "name": supplier.name,
            "category": supplier.category,
            "contact": supplier.contact,
            "location": supplier.location,
            "rating": 4.5,
            "verified": True,
            "specializations": specializations,
            "price_range": "Mid-range",
            "description": f"Trusted supplier of quality {supplier.category.lower()} with 10+ years of experience."
        })
    
    return {"category": category, "suppliers": enhanced_suppliers}

# Experts
class ExpertRequest(BaseModel):
    expert_name: str
    topic: str
    consultation_type: Optional[str] = "call"  # call, video, chat
    preferred_date: Optional[str] = None
    preferred_time: Optional[str] = None
    description: Optional[str] = None

class ExpertResponse(BaseModel):
    id: int
    user_id: int
    expert_name: str
    topic: str
    status: str
    consultation_type: str
    created_at: datetime
    preferred_date: Optional[str] = None
    preferred_time: Optional[str] = None
    description: Optional[str] = None

@router.post("/experts/consultations")
def book_consult(payload: ExpertRequest, user: User = Depends(current_user), db: Session = Depends(get_db)):
    c = ExpertConsultation(
        user_id=user.id, 
        expert_name=payload.expert_name, 
        topic=payload.topic,
        consultation_type=payload.consultation_type,
        preferred_date=payload.preferred_date,
        preferred_time=payload.preferred_time,
        description=payload.description
    )
    db.add(c)
    db.commit()
    db.refresh(c)
    return c

@router.get("/experts/consultations")
def list_consults(user: User = Depends(current_user), db: Session = Depends(get_db)):
    consultations = db.query(ExpertConsultation).filter(ExpertConsultation.user_id==user.id).order_by(ExpertConsultation.id.desc()).all()
    return consultations

@router.get("/experts/available")
def get_available_experts():
    """Get list of available experts with their specializations"""
    experts = [
        {
            "id": 1,
            "name": "Dr. Rajesh Sharma",
            "specialization": "Soil Science",
            "experience": "15 years",
            "contact": "expert1@agri.com",
            "rating": 4.8,
            "consultation_fee": 800,
            "availability": "Available",
            "languages": ["English", "Hindi"],
            "description": "Leading soil scientist with expertise in soil health assessment and fertility management.",
            "achievements": ["PhD in Soil Science", "100+ Soil Reports", "Research Publications"]
        },
        {
            "id": 2,
            "name": "Ms. Priya Patel",
            "specialization": "Crop Protection",
            "experience": "12 years",
            "contact": "expert2@agri.com",
            "rating": 4.6,
            "consultation_fee": 650,
            "availability": "Available",
            "languages": ["English", "Hindi", "Gujarati"],
            "description": "Expert in integrated pest management and sustainable crop protection strategies.",
            "achievements": ["IPM Certified", "Pesticide Expert", "Disease Diagnostics"]
        },
        {
            "id": 3,
            "name": "Dr. Amit Kumar",
            "specialization": "Water Management",
            "experience": "18 years",
            "contact": "expert3@agri.com",
            "rating": 4.9,
            "consultation_fee": 900,
            "availability": "Available",
            "languages": ["English", "Hindi", "Punjabi"],
            "description": "Specialist in irrigation systems, water conservation, and sustainable water management.",
            "achievements": ["Irrigation Engineer", "Water Conservation Expert", "Drip Systems Specialist"]
        },
        {
            "id": 4,
            "name": "Mrs. Sunita Singh",
            "specialization": "Organic Farming",
            "experience": "10 years",
            "contact": "expert4@agri.com",
            "rating": 4.7,
            "consultation_fee": 700,
            "availability": "Available",
            "languages": ["English", "Hindi", "Bengali"],
            "description": "Certified organic farming consultant with expertise in sustainable agriculture practices.",
            "achievements": ["Organic Certified", "Bio-inputs Expert", "Sustainable Methods"]
        },
        {
            "id": 5,
            "name": "Dr. Vikram Mehta",
            "specialization": "Agricultural Economics",
            "experience": "20 years",
            "contact": "expert5@agri.com",
            "rating": 4.5,
            "consultation_fee": 1000,
            "availability": "Available",
            "languages": ["English", "Hindi", "Marathi"],
            "description": "Agricultural economist specializing in farm profitability and market analysis.",
            "achievements": ["PhD in Agricultural Economics", "Market Analysis Expert", "Farm Profitability"]
        }
    ]
    return {"experts": experts, "total": len(experts)}

@router.get("/experts/specializations")
def get_expert_specializations():
    """Get list of available specializations"""
    specializations = [
        {"id": 1, "name": "Soil Science", "description": "Soil health, fertility, and management"},
        {"id": 2, "name": "Crop Protection", "description": "Pest and disease management"},
        {"id": 3, "name": "Water Management", "description": "Irrigation and water conservation"},
        {"id": 4, "name": "Organic Farming", "description": "Sustainable and organic practices"},
        {"id": 5, "name": "Agricultural Economics", "description": "Farm economics and market analysis"},
        {"id": 6, "name": "Livestock Management", "description": "Animal husbandry and dairy farming"},
        {"id": 7, "name": "Horticulture", "description": "Fruit and vegetable cultivation"},
        {"id": 8, "name": "Post Harvest Technology", "description": "Storage and processing techniques"}
    ]
    return {"specializations": specializations}

# Insurance
class PolicyCreate(BaseModel):
    policy_number: str
    crop: str
    coverage_amount: float
    premium: float

@router.post("/insurance/policies")
def create_policy(payload: PolicyCreate, user: User = Depends(current_user), db: Session = Depends(get_db)):
    if db.query(InsurancePolicy).filter(InsurancePolicy.policy_number==payload.policy_number).first():
        raise HTTPException(status_code=400, detail="Policy exists")
    p = InsurancePolicy(user_id=user.id, **payload.dict())
    db.add(p)
    db.commit()
    db.refresh(p)
    return p

@router.get("/insurance/policies")
def list_policies(user: User = Depends(current_user), db: Session = Depends(get_db)):
    return db.query(InsurancePolicy).filter(InsurancePolicy.user_id==user.id).all()

# Market Prices
class MarketPriceCreate(BaseModel):
    crop: str
    mandi: str
    price_per_quintal: float
    quality: Optional[str] = "A"
    unit: Optional[str] = "quintal"

class MarketPriceResponse(BaseModel):
    id: int
    crop: str
    mandi: str
    price_per_quintal: float
    quality: str
    unit: str
    date: datetime
    change_percent: Optional[float] = None
    trend: Optional[str] = "stable"

@router.post("/market/prices")
def create_price(payload: MarketPriceCreate, db: Session = Depends(get_db)):
    mp = MarketPrice(**payload.dict())
    db.add(mp)
    db.commit()
    db.refresh(mp)
    return mp

@router.get("/market/prices")
def list_prices(db: Session = Depends(get_db)):
    prices = db.query(MarketPrice).order_by(MarketPrice.id.desc()).limit(50).all()
    if not prices:
        # Add some sample market prices if none exist
        import random
        from datetime import datetime, timedelta
        
        crops = ['Wheat', 'Rice', 'Cotton', 'Sugarcane', 'Maize', 'Tomato', 'Onion', 'Potato']
        mandis = ['Delhi', 'Mumbai', 'Kolkata', 'Chennai', 'Bangalore', 'Hyderabad', 'Pune', 'Ahmedabad']
        
        sample_prices = []
        for crop in crops[:4]:  # Limit to 4 crops to avoid too much data
            for mandi in mandis[:3]:  # Limit to 3 mandis per crop
                price = random.randint(1500, 4500)  # Random price between 1500-4500
                sample_prices.append(MarketPrice(
                    crop=crop,
                    mandi=mandi,
                    price_per_quintal=price,
                    date=datetime.utcnow() - timedelta(hours=random.randint(0, 24))
                ))
        
        for price in sample_prices:
            db.add(price)
        try:
            db.commit()
            return db.query(MarketPrice).order_by(MarketPrice.id.desc()).limit(50).all()
        except:
            db.rollback()
            return sample_prices
    
    # Add trend and change data to existing prices
    enhanced_prices = []
    for price in prices:
        change_percent = round(random.uniform(-10, 10), 1)
        trend = "up" if change_percent > 2 else "down" if change_percent < -2 else "stable"
        enhanced_prices.append({
            "id": price.id,
            "crop": price.crop,
            "mandi": price.mandi,
            "price_per_quintal": price.price_per_quintal,
            "quality": "A",
            "unit": "quintal",
            "date": price.date,
            "change_percent": change_percent,
            "trend": trend
        })
    
    return enhanced_prices

@router.get("/market/prices/{crop}")
def get_crop_prices(crop: str, db: Session = Depends(get_db)):
    prices = db.query(MarketPrice).filter(MarketPrice.crop.ilike(f"%{crop}%")).order_by(MarketPrice.id.desc()).limit(20).all()
    if not prices:
        return {"message": f"No prices found for {crop}", "prices": []}
    
    enhanced_prices = []
    for price in prices:
        import random
        change_percent = round(random.uniform(-10, 10), 1)
        trend = "up" if change_percent > 2 else "down" if change_percent < -2 else "stable"
        enhanced_prices.append({
            "id": price.id,
            "crop": price.crop,
            "mandi": price.mandi,
            "price_per_quintal": price.price_per_quintal,
            "quality": "A",
            "unit": "quintal",
            "date": price.date,
            "change_percent": change_percent,
            "trend": trend
        })
    
    return {"crop": crop, "prices": enhanced_prices}

@router.get("/market/trends")
def get_market_trends(db: Session = Depends(get_db)):
    # Get average prices by crop for trend analysis
    crops = db.query(MarketPrice.crop).distinct().all()
    trends = []
    
    for crop_tuple in crops:
        crop = crop_tuple[0]
        prices = db.query(MarketPrice).filter(MarketPrice.crop == crop).order_by(MarketPrice.id.desc()).limit(10).all()
        if prices:
            avg_price = sum(p.price_per_quintal for p in prices) / len(prices)
            latest_price = prices[0].price_per_quintal
            change_percent = round(((latest_price - avg_price) / avg_price) * 100, 1)
            trend = "up" if change_percent > 2 else "down" if change_percent < -2 else "stable"
            
            trends.append({
                "crop": crop,
                "current_price": latest_price,
                "average_price": round(avg_price, 2),
                "change_percent": change_percent,
                "trend": trend,
                "data_points": len(prices)
            })
    
    return {"trends": trends, "last_updated": datetime.utcnow().isoformat()}

# Rewards / Badges
class BadgeCreate(BaseModel):
    code: str
    name: str
    description: str

@router.post("/rewards/badges")
def create_badge(payload: BadgeCreate, db: Session = Depends(get_db)):
    if db.query(Badge).filter(Badge.code==payload.code).first():
        raise HTTPException(status_code=400, detail="Badge code exists")
    b = Badge(**payload.dict())
    db.add(b)
    db.commit()
    db.refresh(b)
    return b

@router.post("/rewards/award/{badge_code}")
def award_badge(badge_code: str, user: User = Depends(current_user), db: Session = Depends(get_db)):
    badge = db.query(Badge).filter(Badge.code==badge_code).first()
    if not badge:
        raise HTTPException(status_code=404, detail="Badge not found")
    if db.query(UserBadge).filter(UserBadge.user_id==user.id, UserBadge.badge_id==badge.id).first():
        return {"status":"already_awarded"}
    ub = UserBadge(user_id=user.id, badge_id=badge.id)
    db.add(ub)
    db.commit()
    return {"status":"awarded", "badge": badge.code}

# Multilingual simple dictionary
TRANSLATIONS = {
    "en": {"greeting":"Welcome Farmer"},
    "hi": {"greeting":"किसान आपका स्वागत है"}
}

@router.get("/i18n/{lang}")
def get_translations(lang: str):
    return TRANSLATIONS.get(lang, TRANSLATIONS['en'])
