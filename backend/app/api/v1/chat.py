"""
Chat API Endpoints.
Defines the POST /api/chat and POST /api/chat/reset routes to interact with the AI service.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.chat import ChatRequest, ChatResponse, ResetRequest, ResetResponse
from app.services.gemini_agent import GeminiService
from app.services.memory import memory_manager

router = APIRouter(prefix="/chat", tags=["chat"])


def get_gemini_service() -> GeminiService:
    """
    Dependency generator for GeminiService.
    """
    return GeminiService()


@router.post("", response_model=ChatResponse, status_code=status.HTTP_200_OK)
async def chat_endpoint(
    request: ChatRequest,
    ai_service: GeminiService = Depends(get_gemini_service),
) -> ChatResponse:
    """
    POST endpoint to send messages to the assistant and obtain the response text.
    Maintains session memory context by routing request.session_id.
    """
    try:
        response_text, used_tools = await ai_service.generate_response(
            message=request.message,
            session_id=request.session_id,
            user_id=request.user_id
        )
        
        # Calculate estimated total tokens in active session memory
        estimated_tokens = None
        if request.session_id:
            try:
                estimated_tokens = memory_manager.get_session(request.session_id).get_total_tokens()
            except Exception:
                pass
                
        return ChatResponse(
            response=response_text,
            estimated_tokens=estimated_tokens,
            used_tools=used_tools
        )

    except ValueError as e:
        # Configuration or validation/known API errors
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
    except Exception as e:
        # Unexpected backend or pipeline issues
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal Server Error: {str(e)}",
        )


@router.post("/reset", response_model=ResetResponse, status_code=status.HTTP_200_OK)
async def reset_endpoint(request: ResetRequest) -> ResetResponse:
    """
    Clears conversation context from active memory for a given session ID.
    """
    try:
        if not request.session_id or not request.session_id.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Session ID is required to reset memory."
            )
            
        memory_manager.reset_session(request.session_id)
        return ResetResponse(
            success=True,
            message="Conversation history reset successfully."
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to reset conversation history: {str(e)}",
        )

