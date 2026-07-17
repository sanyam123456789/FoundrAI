import random
from datetime import datetime
from typing import Dict, Any
from app.services.tools.base import BaseTool

class DateTimeTool(BaseTool):
    """
    Mock tool returning the current date and time on the server.
    """
    @property
    def name(self) -> str:
        return "get_current_datetime"

    @property
    def description(self) -> str:
        return "Get the current date and time on the server. Useful for date/time references."

    @property
    def parameters(self) -> Dict[str, Any]:
        return {
            "type": "object",
            "properties": {},
            "additionalProperties": False
        }

    async def execute(self, **kwargs) -> Any:
        return datetime.now().strftime("%Y-%m-%d %H:%M:%S")


class CalculatorTool(BaseTool):
    """
    Calculator tool that supports arithmetic operations.
    """
    @property
    def name(self) -> str:
        return "calculator"

    @property
    def description(self) -> str:
        return (
            "Perform basic math computations: addition (+), subtraction (-), "
            "multiplication (*), and division (/)."
        )

    @property
    def parameters(self) -> Dict[str, Any]:
        return {
            "type": "object",
            "properties": {
                "operation": {
                    "type": "string",
                    "enum": ["add", "subtract", "multiply", "divide"],
                    "description": "The math operation to perform."
                },
                "x": {"type": "number", "description": "The first number (left operand)."},
                "y": {"type": "number", "description": "The second number (right operand)."}
            },
            "required": ["operation", "x", "y"],
            "additionalProperties": False
        }

    async def execute(self, **kwargs) -> Any:
        operation = kwargs.get("operation")
        x = kwargs.get("x")
        y = kwargs.get("y")

        if x is None or y is None:
            raise ValueError("Parameters 'x' and 'y' must be specified.")

        if operation == "add":
            return x + y
        elif operation == "subtract":
            return x - y
        elif operation == "multiply":
            return x * y
        elif operation == "divide":
            if y == 0:
                raise ValueError("Division by zero error.")
            return x / y
        else:
            raise ValueError(f"Unsupported math operation: {operation}")


class RandomQuoteTool(BaseTool):
    """
    Mock tool returning startup/programming quotes.
    """
    @property
    def name(self) -> str:
        return "get_random_quote"

    @property
    def description(self) -> str:
        return "Retrieve an inspiring motivational quote from a prominent startup founder or tech architect."

    @property
    def parameters(self) -> Dict[str, Any]:
        return {
            "type": "object",
            "properties": {},
            "additionalProperties": False
        }

    async def execute(self, **kwargs) -> Any:
        quotes = [
            "Ideas are easy. Execution is everything. - John Doerr",
            "Move fast and break things. - Mark Zuckerberg",
            "Make something people want. - Paul Graham",
            "The secret to successful hiring is this: look for the people who want to change the world. - Marc Benioff",
            "Startups are hard, but they are worth it. - FoundrAI co-founder"
        ]
        return random.choice(quotes)


class WeatherTool(BaseTool):
    """
    Mock tool returning weather data.
    """
    @property
    def name(self) -> str:
        return "get_weather"

    @property
    def description(self) -> str:
        return "Get the current forecast and weather metrics for a specified city or location."

    @property
    def parameters(self) -> Dict[str, Any]:
        return {
            "type": "object",
            "properties": {
                "location": {
                    "type": "string",
                    "description": "The city and state/country, e.g. San Francisco, CA"
                }
            },
            "required": ["location"],
            "additionalProperties": False
        }

    async def execute(self, **kwargs) -> Any:
        location = kwargs.get("location")
        if not location:
            raise ValueError("Location parameter is required.")

        conditions = ["Sunny", "Partly Cloudy", "Rainy", "Windy", "Overcast"]
        temp = random.randint(55, 92)
        condition = random.choice(conditions)
        return f"Mock weather forecast for {location}: {temp}°F and {condition}."
