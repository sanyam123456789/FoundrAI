import logging
import asyncio
from typing import Any, Dict
from app.services.tools.registry import tool_registry

logger = logging.getLogger("app.services.tools.manager")

class ToolManager:
    """
    Core executor manager responsible for invoking tools safely, catching validation errors,
    and enforcing timeouts to protect the AI response loop.
    """

    @staticmethod
    async def execute_tool(name: str, arguments: Dict[str, Any], user_id: str = None) -> Dict[str, Any]:
        """
        Executes a registered tool by name with arguments.
        Enforces a 10-second execution timeout.
        Returns a formatted dictionary describing success or specific failures.
        """
        try:
            tool = tool_registry.get_tool(name)
            
            if user_id:
                arguments["user_id"] = user_id

            logger.info(f"Executing tool '{name}' with arguments: {arguments}")
            
            # Execute tool call in async thread with 10-second timeout enforcement
            result = await asyncio.wait_for(tool.execute(**arguments), timeout=10.0)
            logger.info(f"Tool '{name}' completed successfully.")
            return {
                "success": True,
                "result": result
            }
        except KeyError:
            logger.error(f"Execution Error: Unknown tool requested '{name}'")
            return {
                "success": False,
                "error": f"Unknown tool: '{name}'"
            }
        except asyncio.TimeoutError:
            logger.error(f"Execution Error: Tool '{name}' timed out after 10.0s")
            return {
                "success": False,
                "error": f"Tool '{name}' execution timed out."
            }
        except TypeError as e:
            logger.error(f"Execution Error: Invalid arguments provided for tool '{name}': {e}")
            return {
                "success": False,
                "error": f"Invalid tool arguments: {str(e)}"
            }
        except Exception as e:
            logger.error(f"Execution Error: Unexpected exception in tool '{name}': {e}")
            return {
                "success": False,
                "error": f"Tool execution failed: {str(e)}"
            }
