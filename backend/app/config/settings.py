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
