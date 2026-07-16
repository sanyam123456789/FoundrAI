"""
Global Exception Handlers.
Registers exception overrides to format standard errors as standard API JSON responses.
"""

import logging
from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

logger = logging.getLogger("app.core.exceptions")


def register_exception_handlers(app: FastAPI) -> None:
    """
    Mounts global error handlers onto the FastAPI application.
    """

    @app.exception_handler(StarletteHTTPException)
    async def http_exception_handler(request: Request, exc: StarletteHTTPException):
        """
        Handles generic FastAPI HTTPExceptions.
        """
        logger.warning(
            f"HTTP error {exc.status_code} on {request.method} {request.url.path}: {exc.detail}"
        )
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "success": False,
                "error": {
                    "code": f"HTTP_ERROR_{exc.status_code}",
                    "message": exc.detail,
                    "details": None,
                },
            },
        )

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError):
        """
        Handles Pydantic validation errors on request schemas.
        """
        errors = exc.errors()
        # Simplify validation error representation for response
        simplified_details = [
            {
                "field": ".".join(str(loc) for loc in err.get("loc", [])),
                "type": err.get("type", "unknown"),
                "message": err.get("msg", "Validation error"),
            }
            for err in errors
        ]

        logger.warning(
            f"Validation error on {request.method} {request.url.path}: {simplified_details}"
        )
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content={
                "success": False,
                "error": {
                    "code": "VALIDATION_ERROR",
                    "message": "Input validation failed.",
                    "details": simplified_details,
                },
            },
        )

    @app.exception_handler(Exception)
    async def global_exception_handler(request: Request, exc: Exception):
        """
        Catch-all exception handler for raw internal Python errors.
        """
        logger.exception(
            f"Unhandled exception on {request.method} {request.url.path}: {str(exc)}"
        )
        
        # In debug mode, return full error trace details
        details = str(exc) if app.debug else None
        
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "success": False,
                "error": {
                    "code": "INTERNAL_SERVER_ERROR",
                    "message": "An unexpected error occurred on the server.",
                    "details": details,
                },
            },
        )
