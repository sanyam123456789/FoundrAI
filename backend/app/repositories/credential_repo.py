"""
Credentials Data Access Repository.
"""

from typing import Optional, List
from sqlalchemy.orm import Session

from app.models.domain.credential import Credential
from app.repositories.base import BaseRepository


class CredentialRepository(BaseRepository[Credential]):
    def __init__(self):
        super().__init__(Credential)

    def get_by_user_and_provider(self, db: Session, user_id: str, provider: str) -> Optional[Credential]:
        """
        Retrieves user credentials matching the provider type (e.g. google, github).
        """
        return db.query(self.model).filter(
            self.model.user_id == user_id,
            self.model.provider == provider
        ).first()

    def get_user_credentials(self, db: Session, user_id: str) -> List[Credential]:
        """
        Retrieves all credentials associated with a specific user account.
        """
        return db.query(self.model).filter(self.model.user_id == user_id).all()


credential_repo = CredentialRepository()
