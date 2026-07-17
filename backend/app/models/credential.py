from sqlalchemy import Column, String, DateTime, Text
from app.database.session import Base
from datetime import datetime

class GoogleCredential(Base):
    """
    SQLAlchemy Database Model for storing encrypted Google OAuth 2.0 Credentials.
    """
    __tablename__ = "google_credentials"

    user_id = Column(String, primary_key=True, index=True)
    email = Column(String, nullable=False)
    access_token = Column(Text, nullable=False)
    refresh_token = Column(Text, nullable=True)
    token_uri = Column(String, nullable=False)
    client_id = Column(String, nullable=False)
    client_secret = Column(String, nullable=False)
    scopes = Column(Text, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
