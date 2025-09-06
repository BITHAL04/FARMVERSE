from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from app.database.database import get_db, Base, engine
from app.database.models import User
from app.services.auth_service import hash_password, verify_password, create_access_token, decode_token
from app.services.otp_service import generate_otp, verify_otp
from pydantic import BaseModel
from typing import Optional

Base.metadata.create_all(bind=engine)

router = APIRouter(prefix="/auth", tags=["auth"])

class RegisterRequest(BaseModel):
    email: str
    password: str
    name: Optional[str] = None

class LoginRequest(BaseModel):
    email: str
    password: str

class OTPRequest(BaseModel):
    phone: str
    purpose: str = "login"

class OTPVerifyRequest(BaseModel):
    phone: str
    code: str
    purpose: str = "login"

class ProfileUpdate(BaseModel):
    name: Optional[str] = None

@router.post("/register")
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email==payload.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    user = User(email=payload.email, hashed_password=hash_password(payload.password), name=payload.name)
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"id": user.id, "email": user.email}

@router.post("/login")
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email==payload.email).first()
    if not user or not user.hashed_password or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token(str(user.id))
    return {"access_token": token, "token_type": "bearer"}

@router.get("/profile")
def profile(authorization: str = Header(None), db: Session = Depends(get_db)):
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(status_code=401, detail="Missing token")
    token = authorization.split()[1]
    sub = decode_token(token)
    if not sub:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = db.query(User).get(int(sub))
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"id": user.id, "email": user.email, "name": user.name}

@router.patch("/profile")
def update_profile(payload: ProfileUpdate, authorization: str = Header(None), db: Session = Depends(get_db)):
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(status_code=401, detail="Missing token")
    token = authorization.split()[1]
    sub = decode_token(token)
    if not sub:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = db.query(User).get(int(sub))
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if payload.name:
        user.name = payload.name
        db.commit()
    return {"id": user.id, "email": user.email, "name": user.name}

@router.post("/otp/request")
def otp_request(payload: OTPRequest, db: Session = Depends(get_db)):
    code = generate_otp(payload.phone, payload.purpose, db)
    return {"sent": True, "code_debug": code}

@router.post("/otp/verify")
def otp_verify(payload: OTPVerifyRequest, db: Session = Depends(get_db)):
    ok = verify_otp(payload.phone, payload.code, payload.purpose, db)
    if not ok:
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")
    return {"verified": True}
