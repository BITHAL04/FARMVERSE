from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Float, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    phone = Column(String, unique=True, index=True, nullable=True)
    hashed_password = Column(String, nullable=True)
    name = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    badges = relationship('UserBadge', back_populates='user')

class OTPCode(Base):
    __tablename__ = 'otp_codes'
    id = Column(Integer, primary_key=True)
    phone = Column(String, index=True)
    code = Column(String, index=True)
    purpose = Column(String, default='login')
    created_at = Column(DateTime, default=datetime.utcnow)

class SoilTest(Base):
    __tablename__ = 'soil_tests'
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    ph = Column(Float)
    nitrogen = Column(Float)
    phosphorus = Column(Float)
    potassium = Column(Float)
    recommendation = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

class FarmField(Base):
    __tablename__ = 'farm_fields'
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    name = Column(String)
    area_acres = Column(Float)
    latitude = Column(Float)
    longitude = Column(Float)
    notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

class CropPlan(Base):
    __tablename__ = 'crop_plans'
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    crop = Column(String)
    season = Column(String)
    start_date = Column(DateTime, default=datetime.utcnow)
    notes = Column(Text)

class WeatherAlert(Base):
    __tablename__ = 'weather_alerts'
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=True)
    title = Column(String)
    severity = Column(String)
    message = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

class InputSupplier(Base):
    __tablename__ = 'input_suppliers'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    category = Column(String)
    contact = Column(String)
    location = Column(String)

class ExpertConsultation(Base):
    __tablename__ = 'expert_consultations'
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    expert_name = Column(String)
    topic = Column(String)
    status = Column(String, default='pending')
    created_at = Column(DateTime, default=datetime.utcnow)

class InsurancePolicy(Base):
    __tablename__ = 'insurance_policies'
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    policy_number = Column(String, unique=True)
    crop = Column(String)
    coverage_amount = Column(Float)
    premium = Column(Float)
    status = Column(String, default='active')

class MarketPrice(Base):
    __tablename__ = 'market_prices'
    id = Column(Integer, primary_key=True)
    crop = Column(String, index=True)
    mandi = Column(String)
    price_per_quintal = Column(Float)
    date = Column(DateTime, default=datetime.utcnow)

class Badge(Base):
    __tablename__ = 'badges'
    id = Column(Integer, primary_key=True)
    code = Column(String, unique=True)
    name = Column(String)
    description = Column(Text)

class UserBadge(Base):
    __tablename__ = 'user_badges'
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    badge_id = Column(Integer, ForeignKey('badges.id'))
    awarded_at = Column(DateTime, default=datetime.utcnow)
    user = relationship('User', back_populates='badges')
    badge = relationship('Badge')
