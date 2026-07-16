"""
Middleware definitions.
Includes LoggingMiddleware for auditing all incoming requests and outgoing responses.
"""

import time
import logging
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response

logger = logging.getLogger("app.core.middleware")


class LoggingMiddleware(BaseHTTPMiddleware):
    """
    Middleware that intercepts requests and responses to log access details and execution time.
    """

    async def dispatch(self, request: Request, call_next) -> Response:
        client_ip = request.client.host if request.client else "unknown"
        method = request.method
        path = request.url.path
        query_params = str(request.query_params)

        logger.info(
            f"--> Request: {method} {path} {f'params={query_params}' if query_params else ''} | Client: {client_ip}"
        )

        start_time = time.perf_counter()
        try:
            response = await call_next(request)
            elapsed_time_ms = (time.perf_counter() - start_time) * 1000.0
            
            logger.info(
                f"<-- Response: {method} {path} | Status: {response.status_code} | Duration: {elapsed_time_ms:.2f}ms"
            )
            return response
        except Exception as e:
            elapsed_time_ms = (time.perf_counter() - start_time) * 1000.0
            logger.error(
                f"X-- Failed: {method} {path} | Error: {str(e)} | Duration: {elapsed_time_ms:.2f}ms",
                exc_info=True
            )
            raise e
