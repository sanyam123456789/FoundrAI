"""
User Data Access Repository.
"""

from typing import Optional
from sqlalchemy.orm import Session

from app.models.domain.user import User
from app.repositories.base import BaseRepository


class UserRepository(BaseRepository[User]):
    def __init__(self):
        super().__init__(User)

    def get_by_email(self, db: Session, email: str) -> Optional[User]:
        """
        Retrieves a user matching the provided email address.
        """
        return db.query(self.model).filter(self.model.email == email).first()


user_repo = UserRepository()
