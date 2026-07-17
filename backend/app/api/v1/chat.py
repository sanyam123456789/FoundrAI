"""
Chat API Endpoints.
Defines the POST /api/chat route to interact with Gemini service.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.gemini_agent import GeminiService

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
    POST endpoint to send messages to Gemini and obtain the response text.
    Validates requests using Pydantic, calls the AI service layer, and handles exceptions.
    """
    try:
        response_text = await ai_service.generate_response(request.message)
        return ChatResponse(response=response_text)

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
