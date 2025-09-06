from fastapi import APIRouter, Depends, HTTPException, Header
from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.database.models import CropPlan, User
from app.services.auth_service import decode_token
from app.services.ai_planner import PlannerInput, recommend_crops, mandi_rates, demo_seed_prices


router = APIRouter(prefix="/ai", tags=["ai"])


class CropPlanRequest(BaseModel):
    season: str = Field(..., description="kharif|rabi|zaid")
    area_acres: float = Field(..., gt=0)
    ph: Optional[float] = Field(None, ge=3.5, le=9.0)
    water_availability: Optional[str] = Field(None, description="low|medium|high")
    state: Optional[str] = None
    district: Optional[str] = None


@router.post("/crop-planner/recommendations")
def crop_recommendations(payload: CropPlanRequest, db: Session = Depends(get_db)):
    try:
        p = PlannerInput(
            season=payload.season,
            area_acres=payload.area_acres,
            ph=payload.ph,
            water_availability=(payload.water_availability or '').lower() or None,
            state=payload.state,
            district=payload.district,
        )
        recs = recommend_crops(p, db)
        return {"count": len(recs), "recommendations": recs}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/mandi-rates")
def list_mandi_rates(crop: Optional[str] = None, mandi: Optional[str] = None, limit: int = 50, db: Session = Depends(get_db)):
    rows = mandi_rates(db, crop=crop, mandi=mandi, limit=min(max(limit, 1), 200))
    return {"count": len(rows), "items": rows}


@router.post("/seed-demo")
def seed_demo(db: Session = Depends(get_db)):
    inserted = demo_seed_prices(db)
    return {"inserted": inserted}


def _current_user(authorization: str = Header(None), db: Session = Depends(get_db)) -> User:
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


class SavePlanRequest(BaseModel):
    crop: str
    season: str
    notes: Optional[str] = None


@router.post("/crop-planner/save")
def save_crop_plan(payload: SavePlanRequest, user: User = Depends(_current_user), db: Session = Depends(get_db)):
    plan = CropPlan(user_id=user.id, crop=payload.crop, season=payload.season, notes=payload.notes)
    db.add(plan)
    db.commit()
    db.refresh(plan)
    return plan
