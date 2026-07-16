"""
Database session management.
Sets up the SQLAlchemy engine, session maker, Base class, and dependency injectors.
"""

from typing import Generator
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base

from app.config import settings

# Initialize SQLAlchemy engine with robust pooling
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,  # Test connections before using them
    pool_size=10,        # Default pool size
    max_overflow=20,     # Extra connections allowed under high load
)

# Session factory for individual requests
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

# Declarative base model class
Base = declarative_base()


def get_db() -> Generator:
    """
    FastAPI dependency yielding a new SQLAlchemy session for each request
    and closing it once the request completes.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def verify_database_connection() -> bool:
    """
    Runs a simple 'SELECT 1' test query to verify database connectivity.
    Returns True if successful, False otherwise.
    """
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return True
    except Exception:
        return False
