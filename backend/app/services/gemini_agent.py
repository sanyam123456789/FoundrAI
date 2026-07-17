"""
Groq AI Agent Service.
Communicates with Groq API via the official OpenAI SDK.
Designed modularly to facilitate future integrations:
- Conversation Memory
- MCP (Model Context Protocol)
- Integrations (Gmail, GitHub, Calendar)
- Planner Agent
"""

import logging
import asyncio
from typing import Optional
from openai import OpenAI, APIError, APIConnectionError, RateLimitError, AuthenticationError
from app.config import settings

logger = logging.getLogger("app.services.gemini_agent")


class GeminiService:
    """
    Dedicated AI service layer interacting with Groq.
    Keeps the name 'GeminiService' to preserve backend routing/imports without refactoring.
    """

    def __init__(self, api_key: Optional[str] = None) -> None:
        self.api_key = api_key or settings.GROQ_API_KEY
        self._client: Optional[OpenAI] = None

        if not self.api_key:
            logger.warning(
                "GROQ_API_KEY environment variable is not set. Chat will be unavailable."
            )
        else:
            try:
                self._client = OpenAI(
                    api_key=self.api_key,
                    base_url="https://api.groq.com/openai/v1"
                )
                logger.info("Groq client successfully initialized.")
            except Exception as e:
                logger.error(f"Failed to initialize Groq client: {e}")

    @property
    def client(self) -> OpenAI:
        """
        Gets the OpenAI SDK client initialized for Groq.
        """
        if not self.api_key:
            raise ValueError(
                "Groq API key is not configured. Please set the GROQ_API_KEY environment variable."
            )

        if not self._client:
            try:
                self._client = OpenAI(
                    api_key=self.api_key,
                    base_url="https://api.groq.com/openai/v1"
                )
            except Exception as e:
                logger.error(f"Failed to initialize Groq client: {e}")
                raise ValueError(f"Failed to initialize Groq API client: {str(e)}")

        return self._client

    async def generate_response(self, message: str, session_id: Optional[str] = None) -> str:
        """
        Submits the user's message to Groq (with context memory history and system prompt)
        and returns the generated text.
        Designed with future extension points:
        - Memory context hook
        - Tool calling (MCP client integrations)
        - External triggers (Gmail, Calendar, etc.)
        """
        client = self.client
        model = settings.GROQ_MODEL or "llama-3.3-70b-versatile"
        
        # Load conversation memory context if session is provided
        history_messages = []
        conversation_mem = None
        if session_id:
            from app.services.memory import memory_manager
            conversation_mem = memory_manager.get_session(session_id)
            history_messages = conversation_mem.get_history()

        # Build messages payload
        messages_payload = []
        
        # 1. Inject configurable system prompt
        if settings.SYSTEM_PROMPT:
            messages_payload.append({"role": "system", "content": settings.SYSTEM_PROMPT})
            
        # 2. Append history messages
        messages_payload.extend(history_messages)
        
        # 3. Append current user query
        messages_payload.append({"role": "user", "content": message})

        logger.info(
            f"Actually using Groq model: '{model}' (Session ID: {session_id or 'default'}, "
            f"History Context Size: {len(history_messages)} messages)"
        )

        try:
            logger.info("Sending message thread to Groq API...")
            
            # Use asyncio.to_thread to run the blocking client call in a separate thread.
            response = await asyncio.to_thread(
                client.chat.completions.create,
                model=model,
                messages=messages_payload,
            )

            if not response or not response.choices or not response.choices[0].message.content:
                raise ValueError("Received an empty or invalid response from Groq API.")

            response_text = response.choices[0].message.content

            # Commit to conversation memory upon success
            if conversation_mem:
                conversation_mem.add_message("user", message)
                conversation_mem.add_message("assistant", response_text)
                
                # Dynamic Token Estimations Logging
                total_tokens = conversation_mem.get_total_tokens()
                logger.info(
                    f"Current session memory size: {len(conversation_mem.messages)} messages. "
                    f"Estimated total tokens: {total_tokens}"
                )

            logger.info("Successfully received response from Groq API.")
            return response_text

        except AuthenticationError as e:
            logger.error(f"Groq Authentication failure: {e}")
            raise ValueError("Groq API Error: Invalid API Key. Please verify your GROQ_API_KEY in the .env file.")

        except RateLimitError as e:
            logger.error(f"Groq Rate Limit exceeded: {e}")
            raise ValueError(f"Groq API Error: Rate limit exceeded (model: {model}). Please try again later.")

        except APIConnectionError as e:
            logger.error(f"Groq API Connection failure: {e}")
            raise ValueError("Groq API Error: Network failure. Failed to connect to the Groq server.")

        except APIError as e:
            logger.error(f"Groq API Error occurred using model {model}: {e}")
            raise ValueError(f"Groq API error (model: {model}): {e.message or str(e)}")

        except Exception as e:
            logger.error(f"Unexpected error in Groq service using model {model}: {e}")
            raise ValueError(f"AI Service error (model: {model}): {str(e)}")
