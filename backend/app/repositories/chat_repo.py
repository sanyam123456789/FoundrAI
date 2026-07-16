"""
Chat history & message logs repository.
"""

from typing import List
from sqlalchemy.orm import Session

from app.models.domain.chat import ChatSession, ChatMessage, McpActivityLog
from app.repositories.base import BaseRepository


class ChatRepository(BaseRepository[ChatSession]):
    def __init__(self):
        super().__init__(ChatSession)

    def get_user_sessions(self, db: Session, user_id: str) -> List[ChatSession]:
        """
        Retrieves all conversations created by a user.
        """
        return db.query(self.model).filter(
            self.model.user_id == user_id
        ).order_by(self.model.created_at.desc()).all()

    def get_messages_by_session(self, db: Session, session_id: str) -> List[ChatMessage]:
        """
        Retrieves chronologically all dialogue rows in a conversation.
        """
        return db.query(ChatMessage).filter(
            ChatMessage.session_id == session_id
        ).order_by(ChatMessage.created_at.asc()).all()

    def create_message(self, db: Session, *, obj_in: dict) -> ChatMessage:
        """
        Inserts an individual chat message log.
        """
        db_obj = ChatMessage(**obj_in)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def log_mcp_activity(self, db: Session, *, obj_in: dict) -> McpActivityLog:
        """
        Saves step-by-step metadata details about a performed MCP tool query.
        """
        db_obj = McpActivityLog(**obj_in)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj


chat_repo = ChatRepository()
