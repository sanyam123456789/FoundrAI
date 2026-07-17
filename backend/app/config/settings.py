"""
Application Settings configuration.
Loads and validates environment variables using pydantic-settings.
"""

from typing import Any
from pydantic import field_validator, ValidationInfo
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Base App Settings
    PROJECT_NAME: str = "FoundrAI Backend"
    VERSION: str = "1.0.0"
    ENV_NAME: str = "development"
    DEBUG: bool = True
    GROQ_API_KEY: str | None = None
    GROQ_MODEL: str = "llama-3.3-70b-versatile"
    MEMORY_MAX_MESSAGES: int = 20
    SYSTEM_PROMPT: str = (
        "You are FoundrAI, a professional startup assistant, technical co-founder, "
        "software architect, product advisor, and business strategy assistant. "
        "Provide professional, strategic, and technically sound guidance."
    )
    GOOGLE_CLIENT_ID: str | None = None
    GOOGLE_CLIENT_SECRET: str | None = None
    GOOGLE_REDIRECT_URI: str = "http://localhost:8000/api/integrations/google/callback"
    ENCRYPTION_KEY: str | None = None

    # PostgreSQL Database Settings
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_DB: str = "foundrai"
    POSTGRES_HOST: str = "localhost"
    POSTGRES_PORT: int = 5432
    DATABASE_URL: str | None = None

    @field_validator("DATABASE_URL", mode="before")
    @classmethod
    def assemble_db_connection(cls, v: str | None, info: ValidationInfo) -> str:
        """
        Dynamically assembles the DATABASE_URL if not directly provided in environment.
        """
        if isinstance(v, str) and v.strip():
            return v

        user = info.data.get("POSTGRES_USER", "postgres")
        password = info.data.get("POSTGRES_PASSWORD", "postgres")
        host = info.data.get("POSTGRES_HOST", "localhost")
        port = info.data.get("POSTGRES_PORT", 5432)
        db = info.data.get("POSTGRES_DB", "foundrai")

        return f"postgresql://{user}:{password}@{host}:{port}/{db}"

    # Log Settings
    LOG_LEVEL: str = "INFO"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()

# Startup diagnostics debugging logs
import os
import logging
logger = logging.getLogger("app.config.settings")

env_file = settings.model_config.get("env_file", ".env")
env_path = os.path.abspath(env_file)
key_preview = (settings.GROQ_API_KEY[:10] + "...") if settings.GROQ_API_KEY else "<Not Set>"

print("=== FOUNDRAI STARTUP DIAGNOSTICS ===")
print(f"Loaded environment file path: {env_path}")
print(f"Environment file exists: {os.path.exists(env_path)}")
print(f"Loaded GROQ_API_KEY: {key_preview}")
print(f"Loaded GROQ_MODEL: {settings.GROQ_MODEL}")
print(f"Loaded MEMORY_MAX_MESSAGES: {settings.MEMORY_MAX_MESSAGES}")
print(f"Loaded SYSTEM_PROMPT (Length): {len(settings.SYSTEM_PROMPT) if settings.SYSTEM_PROMPT else 0} chars")
print("====================================")

logger.info("=== FOUNDRAI STARTUP DIAGNOSTICS ===")
logger.info(f"Loaded environment file path: {env_path}")
logger.info(f"Environment file exists: {os.path.exists(env_path)}")
logger.info(f"Loaded GROQ_API_KEY: {key_preview}")
logger.info(f"Loaded GROQ_MODEL: {settings.GROQ_MODEL}")
logger.info(f"Loaded MEMORY_MAX_MESSAGES: {settings.MEMORY_MAX_MESSAGES}")
logger.info(f"Loaded SYSTEM_PROMPT (Length): {len(settings.SYSTEM_PROMPT) if settings.SYSTEM_PROMPT else 0} chars")
logger.info("====================================")
