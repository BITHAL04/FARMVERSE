from dataclasses import dataclass
from typing import List, Dict, Optional, Tuple
from sqlalchemy.orm import Session
from app.database.models import MarketPrice


@dataclass
class PlannerInput:
    season: str  # 'kharif' | 'rabi' | 'zaid'
    area_acres: float
    ph: Optional[float] = None
    water_availability: Optional[str] = None  # 'low' | 'medium' | 'high'
    state: Optional[str] = None
    district: Optional[str] = None


# Reference crop metadata (simplified, heuristic values)
REFERENCE_CROPS: List[Dict] = [
    {
        "crop": "rice",
        "seasons": ["kharif"],
        "ph_range": (5.5, 7.5),
        "water": "high",
        "duration_days": 120,
        "seed_rate_kg_per_acre": 8,
        "base_cost_per_acre": 12000,
        "yield_quintal_per_acre": 20,
    },
    {
        "crop": "wheat",
        "seasons": ["rabi"],
        "ph_range": (6.0, 7.5),
        "water": "medium",
        "duration_days": 120,
        "seed_rate_kg_per_acre": 45,
        "base_cost_per_acre": 10000,
        "yield_quintal_per_acre": 18,
    },
    {
        "crop": "maize",
        "seasons": ["kharif", "rabi"],
        "ph_range": (5.8, 7.2),
        "water": "medium",
        "duration_days": 110,
        "seed_rate_kg_per_acre": 8,
        "base_cost_per_acre": 9000,
        "yield_quintal_per_acre": 16,
    },
    {
        "crop": "soybean",
        "seasons": ["kharif"],
        "ph_range": (6.0, 7.5),
        "water": "low",
        "duration_days": 105,
        "seed_rate_kg_per_acre": 30,
        "base_cost_per_acre": 8000,
        "yield_quintal_per_acre": 10,
    },
    {
        "crop": "chickpea",
        "seasons": ["rabi"],
        "ph_range": (6.0, 7.5),
        "water": "low",
        "duration_days": 110,
        "seed_rate_kg_per_acre": 30,
        "base_cost_per_acre": 7000,
        "yield_quintal_per_acre": 8,
    },
    {
        "crop": "mustard",
        "seasons": ["rabi"],
        "ph_range": (6.0, 7.5),
        "water": "low",
        "duration_days": 115,
        "seed_rate_kg_per_acre": 2.5,
        "base_cost_per_acre": 6500,
        "yield_quintal_per_acre": 7,
    },
    {
        "crop": "cotton",
        "seasons": ["kharif"],
        "ph_range": (5.8, 7.5),
        "water": "medium",
        "duration_days": 160,
        "seed_rate_kg_per_acre": 1.5,
        "base_cost_per_acre": 14000,
        "yield_quintal_per_acre": 8,
    },
    {
        "crop": "groundnut",
        "seasons": ["kharif"],
        "ph_range": (6.0, 7.0),
        "water": "low",
        "duration_days": 115,
        "seed_rate_kg_per_acre": 20,
        "base_cost_per_acre": 9000,
        "yield_quintal_per_acre": 7,
    },
    {
        "crop": "bajra",
        "seasons": ["kharif"],
        "ph_range": (5.5, 7.5),
        "water": "low",
        "duration_days": 80,
        "seed_rate_kg_per_acre": 2,
        "base_cost_per_acre": 5000,
        "yield_quintal_per_acre": 7,
    },
]


FALLBACK_MSP_PRICE: Dict[str, int] = {
    # approximate MSP-like prices (INR per quintal)
    "rice": 2200,
    "wheat": 2200,
    "maize": 2100,
    "soybean": 4700,
    "chickpea": 5400,
    "mustard": 5500,
    "cotton": 7000,
    "groundnut": 6500,
    "bajra": 2500,
}


def latest_market_price(db: Session, crop: str, mandi: Optional[str] = None) -> Optional[float]:
    q = db.query(MarketPrice).filter(MarketPrice.crop == crop)
    if mandi:
        q = q.filter(MarketPrice.mandi == mandi)
    q = q.order_by(MarketPrice.id.desc()).first()
    if q:
        return float(q.price_per_quintal)
    return None


def score_crop(item: Dict, data: PlannerInput) -> float:
    score = 0.0
    # season match
    if data.season.lower() in item["seasons"]:
        score += 2.0
    # pH closeness
    if data.ph is not None:
        lo, hi = item["ph_range"]
        if lo <= data.ph <= hi:
            score += 2.0
        else:
            # distance penalty
            d = min(abs(data.ph - lo), abs(data.ph - hi))
            score += max(0.0, 1.5 - d)
    # water match
    if data.water_availability:
        if data.water_availability.lower() == item["water"]:
            score += 1.5
        else:
            score += 0.5  # partial
    # region bias (very light heuristic)
    if data.state:
        st = data.state.lower()
        if ("punjab" in st or "haryana" in st) and item["crop"] in ("wheat", "rice"):
            score += 0.5
        if ("mp" in st or "madhya" in st) and item["crop"] in ("soybean", "chickpea"):
            score += 0.5
        if ("rajasthan" in st) and item["crop"] in ("mustard", "bajra"):
            score += 0.5
        if ("maharashtra" in st) and item["crop"] in ("cotton", "soybean"):
            score += 0.5
    return score


def recommend_crops(data: PlannerInput, db: Session) -> List[Dict]:
    recs: List[Tuple[float, Dict]] = []
    for item in REFERENCE_CROPS:
        s = score_crop(item, data)
        if s <= 0:
            continue
        # estimate price
        price = latest_market_price(db, item["crop"]) or FALLBACK_MSP_PRICE.get(item["crop"], 2000)
        est_yield = item["yield_quintal_per_acre"]
        revenue_per_acre = est_yield * price
        profit_per_acre = revenue_per_acre - item["base_cost_per_acre"]
        duration = item["duration_days"]
        details = {
            "crop": item["crop"],
            "score": round(s, 2),
            "season": data.season,
            "ph_fit": item["ph_range"],
            "water_need": item["water"],
            "duration_days": duration,
            "estimated_yield_quintal_per_acre": est_yield,
            "assumed_price_per_quintal": price,
            "estimated_profit_per_acre": round(profit_per_acre, 2),
            "estimated_profit_total": round(profit_per_acre * data.area_acres, 2),
            "seed_rate_kg_per_acre": item["seed_rate_kg_per_acre"],
            "base_cost_per_acre": item["base_cost_per_acre"],
            "reason": _reason(item, data),
        }
        recs.append((s, details))
    recs.sort(key=lambda x: x[0], reverse=True)
    return [d for _, d in recs[:8]]


def _reason(item: Dict, data: PlannerInput) -> str:
    bits = []
    if data.season.lower() in item["seasons"]:
        bits.append("season match")
    lo, hi = item["ph_range"]
    if data.ph is not None and lo <= data.ph <= hi:
        bits.append("pH suitable")
    if data.water_availability and data.water_availability.lower() == item["water"]:
        bits.append("water availability match")
    if data.state:
        bits.append(f"region: {data.state}")
    return ", ".join(bits) or "balanced choice"


def mandi_rates(db: Session, crop: Optional[str] = None, mandi: Optional[str] = None, limit: int = 50) -> List[Dict]:
    q = db.query(MarketPrice)
    if crop:
        q = q.filter(MarketPrice.crop == crop)
    if mandi:
        q = q.filter(MarketPrice.mandi == mandi)
    rows = q.order_by(MarketPrice.id.desc()).limit(limit).all()
    return [
        {
            "id": r.id,
            "crop": r.crop,
            "mandi": r.mandi,
            "price_per_quintal": float(r.price_per_quintal),
            "date": r.date.isoformat() if getattr(r, "date", None) else None,
        }
        for r in rows
    ]


def demo_seed_prices(db: Session) -> int:
    # Insert a small demo set if missing (idempotent)
    samples = [
        ("wheat", "Delhi", 2250.0),
        ("rice", "Kolkata", 2300.0),
        ("maize", "Hyderabad", 2100.0),
        ("soybean", "Indore", 4800.0),
        ("mustard", "Jaipur", 5600.0),
        ("chickpea", "Bhopal", 5450.0),
        ("cotton", "Nagpur", 7050.0),
        ("groundnut", "Rajkot", 6550.0),
        ("bajra", "Jaipur", 2520.0),
    ]
    from app.database.models import MarketPrice as MP
    cnt = 0
    for c, m, p in samples:
        exists = db.query(MP).filter(MP.crop==c, MP.mandi==m, MP.price_per_quintal==p).first()
        if not exists:
            db.add(MP(crop=c, mandi=m, price_per_quintal=p))
            cnt += 1
    db.commit()
    return cnt
