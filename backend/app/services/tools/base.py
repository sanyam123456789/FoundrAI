from abc import ABC, abstractmethod
from typing import Dict, Any

class BaseTool(ABC):
    """
    Abstract Base Class for all Tools in the FoundrAI Tool Framework.
    Allows easy plug-and-play integrations regardless of LLM providers.
    """

    @property
    @abstractmethod
    def name(self) -> str:
        """
        Unique identifier name of the tool.
        """
        pass

    @property
    @abstractmethod
    def description(self) -> str:
        """
        Detailed description explaining what the tool does and when it should be used.
        """
        pass

    @property
    @abstractmethod
    def parameters(self) -> Dict[str, Any]:
        """
        JSON Schema describing the parameters/arguments expected by the tool.
        """
        pass

    @abstractmethod
    async def execute(self, **kwargs) -> Any:
        """
        Asynchronously executes the core tool logic with the unpacked arguments.
        """
        pass

    def to_openai_tool(self) -> Dict[str, Any]:
        """
        Helper method to format the tool declaration to be compatible with OpenAI-style APIs (Groq).
        """
        return {
            "type": "function",
            "function": {
                "name": self.name,
                "description": self.description,
                "parameters": self.parameters,
            }
        }
