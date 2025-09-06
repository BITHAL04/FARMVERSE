import random, string, datetime
from sqlalchemy.orm import Session
from app.database.models import OTPCode

EXPIRY_MINUTES = 10

def generate_otp(phone: str, purpose: str, db: Session) -> str:
    code = ''.join(random.choices(string.digits, k=6))
    otp = OTPCode(phone=phone, code=code, purpose=purpose)
    db.add(otp)
    db.commit()
    return code

def verify_otp(phone: str, code: str, purpose: str, db: Session) -> bool:
    cutoff = datetime.datetime.utcnow() - datetime.timedelta(minutes=EXPIRY_MINUTES)
    record = db.query(OTPCode).filter(OTPCode.phone==phone, OTPCode.code==code, OTPCode.purpose==purpose, OTPCode.created_at>=cutoff).order_by(OTPCode.id.desc()).first()
    return record is not None
