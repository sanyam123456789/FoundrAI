"""
Groq AI Agent Service.
Communicates with Groq API via the official OpenAI SDK.
Designed modularly to facilitate future integrations:
- Conversation Memory
- MCP (Model Context Protocol)
- Integrations (Gmail, GitHub, Calendar)
- Planner Agent
"""

import json
import logging
import asyncio
from typing import Optional, List, Dict, Tuple, Any
from openai import OpenAI, APIError, APIConnectionError, RateLimitError, AuthenticationError
from app.config import settings
from app.services.tools.registry import tool_registry
from app.services.tools.manager import ToolManager

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

    async def generate_response(
        self,
        message: str,
        session_id: Optional[str] = None,
        user_id: Optional[str] = None
    ) -> Tuple[str, List[str]]:
        """
        Submits the user's message to Groq (with context memory history and system prompt),
        detects and processes tool calls, and returns the final text response along with a list of used tools.
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

        # Get tool declarations formatted for OpenAI
        tools_list = tool_registry.get_openai_declarations()
        
        logger.info(
            f"Actually using Groq model: '{model}' (Session ID: {session_id or 'default'}, "
            f"History Context Size: {len(history_messages)} messages, Registered Tools: {len(tools_list)})"
        )

        used_tool_names: List[str] = []

        try:
            # We limit tool loops to 3 turns to prevent run-away iterations
            max_turns = 3
            current_turn = 0
            
            while current_turn < max_turns:
                current_turn += 1
                logger.info(f"Sending message thread to Groq API (Turn {current_turn})...")
                
                # Setup parameters for Completions call
                call_args = {
                    "model": model,
                    "messages": messages_payload
                }
                # Groq/OpenAI error out if tools is passed as an empty list, only pass if tools exist
                if tools_list:
                    call_args["tools"] = tools_list

                # Use asyncio.to_thread to run the blocking client call in a separate thread
                response = await asyncio.to_thread(
                    client.chat.completions.create,
                    **call_args
                )

                if not response or not response.choices:
                    raise ValueError("Received an empty or invalid response from Groq API.")

                choice = response.choices[0]
                assistant_message = choice.message
                
                # Check if the LLM decided to call any tools
                if assistant_message.tool_calls:
                    logger.info(f"Groq requested invocation of {len(assistant_message.tool_calls)} tools.")
                    
                    # Convert ChatCompletionMessage to dictionary representation to avoid SDK validation issues
                    tool_calls_payload = []
                    for tc in assistant_message.tool_calls:
                        tool_calls_payload.append({
                            "id": tc.id,
                            "type": tc.type,
                            "function": {
                                "name": tc.function.name,
                                "arguments": tc.function.arguments
                            }
                        })
                        
                    messages_payload.append({
                        "role": "assistant",
                        "content": assistant_message.content,
                        "tool_calls": tool_calls_payload
                    })
                    
                    # Process and execute each tool call sequentially
                    for tool_call in assistant_message.tool_calls:
                        tool_name = tool_call.function.name
                        tool_args_str = tool_call.function.arguments
                        tool_call_id = tool_call.id
                        
                        logger.info(f"Invoking tool: '{tool_name}' with args: {tool_args_str}")
                        
                        # Translate to user-friendly tool names for indicators
                        display_name = tool_name
                        if tool_name == "get_current_datetime":
                            display_name = "Date & Time"
                        elif tool_name == "calculator":
                            display_name = "Calculator"
                        elif tool_name == "get_random_quote":
                            display_name = "Random Quote"
                        elif tool_name == "get_weather":
                            display_name = "Weather"
                        elif tool_name == "gmail":
                            display_name = "Gmail"
                            
                        if display_name not in used_tool_names:
                            used_tool_names.append(display_name)
                            
                        # Safely parse JSON arguments
                        try:
                            tool_args = json.loads(tool_args_str) if tool_args_str else {}
                        except Exception as e:
                            logger.error(f"Failed to parse arguments JSON for tool '{tool_name}': {e}")
                            tool_args = {}
                            
                        # Execute tool using manager, passing user_id context
                        execution_result = await ToolManager.execute_tool(tool_name, tool_args, user_id=user_id)
                        
                        # Feed the tool output back into the message history thread context
                        messages_payload.append({
                            "role": "tool",
                            "tool_call_id": tool_call_id,
                            "name": tool_name,
                            "content": json.dumps(execution_result)
                        })
                        
                    # Trigger next completion turn to let the model evaluate tool execution output
                    continue
                    
                else:
                    # Final text response received
                    response_text = assistant_message.content
                    if response_text is None:
                        response_text = ""

                    # Commit the user prompt and the final AI text response to conversation memory
                    if conversation_mem:
                        conversation_mem.add_message("user", message)
                        conversation_mem.add_message("assistant", response_text)
                        
                        # Dynamic Token Estimations Logging
                        total_tokens = conversation_mem.get_total_tokens()
                        logger.info(
                            f"Current session memory size: {len(conversation_mem.messages)} messages. "
                            f"Estimated total tokens: {total_tokens}"
                        )

                    logger.info("Successfully received final response text from Groq API.")
                    return response_text, used_tool_names

            # If loop finished without getting a text content response
            raise ValueError("Tool execution loop exceeded maximum allowed turns (3).")

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

