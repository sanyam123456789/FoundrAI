"""
Standard API Response Schemas.
Enforces standard structure for success and error endpoints.
"""

from typing import Any, Generic, TypeVar, Optional
from pydantic import BaseModel

DataType = TypeVar("DataType")


class ErrorDetail(BaseModel):
    code: str
    message: str
    details: Optional[Any] = None


class StandardResponse(BaseModel, Generic[DataType]):
    success: bool
    data: Optional[DataType] = None
    error: Optional[ErrorDetail] = None
