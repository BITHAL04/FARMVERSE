import os
from functools import lru_cache
from dataclasses import dataclass


@dataclass
class Settings:
    openai_api_key: str | None
    app_name: str
    app_version: str
    model_name: str
    allow_origins: str
    smtp_host: str | None
    smtp_user: str | None
    smtp_pass: str | None
    smtp_port: int
    contact_to_email: str | None


@lru_cache
def get_settings() -> Settings:
    return Settings(
        openai_api_key=os.getenv("OPENAI_API_KEY"),
        app_name=os.getenv("APP_NAME", "FarmVerse API"),
        app_version=os.getenv("APP_VERSION", "1.0.0"),
        model_name=os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
    allow_origins=os.getenv("ALLOW_ORIGINS", "*"),
    smtp_host=os.getenv("SMTP_HOST"),
    smtp_user=os.getenv("SMTP_USER"),
    smtp_pass=os.getenv("SMTP_PASS"),
    smtp_port=int(os.getenv("SMTP_PORT", "587")),
    contact_to_email=os.getenv("CONTACT_TO_EMAIL"),
    )
