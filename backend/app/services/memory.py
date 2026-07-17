"""
Conversation Memory Service.
Manages session-based in-memory chat histories, message trimming, and token estimation heuristics.
"""

import logging
from typing import List, Dict, Any, Optional
from app.config import settings

logger = logging.getLogger("app.services.memory")


def estimate_tokens(text: str) -> int:
    """
    Estimates token count for a text snippet using a standard heuristic:
    1 token ≈ 4 characters or 0.75 words.
    We use max(1, len(text) // 4) as a fast, reliable approximation.
    """
    if not text:
        return 0
    return max(1, len(text) // 4)


class ConversationMemory:
    """
    Manages session-based history for a single conversation/tab session.
    """

    def __init__(self, max_messages: int = 20) -> None:
        self.max_messages = max_messages
        # List of message objects: [{"role": "user"|"assistant", "content": str, "tokens": int}]
        self.messages: List[Dict[str, Any]] = []

    def add_message(self, role: str, content: str) -> None:
        """
        Adds a message to the history and trims older messages if maximum length is exceeded.
        """
        tokens = estimate_tokens(content)
        self.messages.append({
            "role": role,
            "content": content,
            "tokens": tokens
        })
        self._trim()

    def _trim(self) -> None:
        """
        Trims oldest messages when memory size exceeds self.max_messages.
        Trims messages one by one to ensure we stay within limits.
        """
        while len(self.messages) > self.max_messages:
            removed = self.messages.pop(0)
            logger.info(
                f"Memory Trim: Removed oldest {removed['role']} message "
                f"({removed['tokens']} estimated tokens)."
            )

    def get_history(self) -> List[Dict[str, str]]:
        """
        Formats and returns history suitable for completions API models parameters.
        """
        return [{"role": m["role"], "content": m["content"]} for m in self.messages]

    def get_total_tokens(self) -> int:
        """
        Calculates the estimated total tokens currently held in this session's memory.
        """
        return sum(m["tokens"] for m in self.messages)

    def clear(self) -> None:
        """
        Clears the conversation thread memory.
        """
        self.messages.clear()
        logger.info("Memory cleared.")


class MemoryManager:
    """
    Global session keeper that maps session IDs to individual ConversationMemory structures.
    """

    def __init__(self) -> None:
        self._sessions: Dict[str, ConversationMemory] = {}

    def get_session(self, session_id: str) -> ConversationMemory:
        """
        Gets or initializes a ConversationMemory instance for a session ID.
        """
        max_messages = settings.MEMORY_MAX_MESSAGES
        if session_id not in self._sessions:
            logger.info(f"Initializing new conversation memory session: {session_id}")
            self._sessions[session_id] = ConversationMemory(max_messages=max_messages)
        return self._sessions[session_id]

    def reset_session(self, session_id: str) -> None:
        """
        Resets and clears the history context for a session ID.
        """
        if session_id in self._sessions:
            logger.info(f"Resetting session memory for: {session_id}")
            self._sessions[session_id].clear()
            # Remove session to release memory
            del self._sessions[session_id]


# Global singleton instance
memory_manager = MemoryManager()
