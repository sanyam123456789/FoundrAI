"""
FoundrAI API Main Application Entrypoint.
Initializes FastAPI, mounts middleware, logs requests/responses, and registers routes.
"""

from fastapi import FastAPI, Response, status
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.core import setup_logging, LoggingMiddleware, register_exception_handlers
from app.database import verify_database_connection

# Initialize Logging
setup_logging()

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="FoundrAI Backend Architecture Foundation",
    version=settings.VERSION,
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
    openapi_url="/openapi.json" if settings.DEBUG else None,
)

# Configure CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if settings.DEBUG else ["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Trace Logging Middleware
app.add_middleware(LoggingMiddleware)

# Register Exception Handlers
register_exception_handlers(app)

# Include API Routers
from app.api.v1.chat import router as chat_router
app.include_router(chat_router, prefix="/api")


@app.get("/", status_code=status.HTTP_200_OK)
async def root_endpoint():
    """
    Root endpoint returning basic information about the API service.
    """
    return {
        "name": settings.PROJECT_NAME,
        "version": settings.VERSION,
    }


@app.get("/health", status_code=status.HTTP_200_OK)
async def health_endpoint(response: Response):
    """
    Health check endpoint. Verifies PostgreSQL connectivity.
    Returns 503 if the database is unreachable.
    """
    db_healthy = verify_database_connection()
    if not db_healthy:
        response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE
        return {
            "status": "unhealthy",
            "database": "disconnected"
        }
    return {
        "status": "healthy"
    }
