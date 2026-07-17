from typing import Dict, List, Any
from app.services.tools.base import BaseTool
from app.services.tools.mock_tools import DateTimeTool, CalculatorTool, RandomQuoteTool, WeatherTool
from app.services.tools.gmail import GmailTool

class ToolRegistry:
    """
    Registry indexing all available tools in FoundrAI.
    Auto-registers mock tools on instantiation.
    """

    def __init__(self) -> None:
        self._tools: Dict[str, BaseTool] = {}
        
        # Self-register current phase mock tools
        self.register(DateTimeTool())
        self.register(CalculatorTool())
        self.register(RandomQuoteTool())
        self.register(WeatherTool())
        self.register(GmailTool())

    def register(self, tool: BaseTool) -> None:
        """
        Registers a new tool in the framework.
        """
        self._tools[tool.name] = tool

    def get_tool(self, name: str) -> BaseTool:
        """
        Fetches a registered tool by its name. Raises KeyError if missing.
        """
        if name not in self._tools:
            raise KeyError(f"Tool '{name}' is not registered.")
        return self._tools[name]

    def list_tools(self) -> List[BaseTool]:
        """
        Returns all registered tools as a list.
        """
        return list(self._tools.values())

    def get_openai_declarations(self) -> List[Dict[str, Any]]:
        """
        Formats all registered tools to OpenAI-compatible Tool parameter lists.
        """
        return [tool.to_openai_tool() for tool in self.list_tools()]


# Global singleton instance
tool_registry = ToolRegistry()
