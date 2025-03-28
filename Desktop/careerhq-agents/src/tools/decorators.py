import logging
from functools import wraps
import time
import traceback

logger = logging.getLogger(__name__)

def log_tool_use(func):
    """
    Decorator to log tool usage for tracking and debugging.
    
    Args:
        func: The tool function to wrap
        
    Returns:
        Wrapped function with logging
    """
    @wraps(func)
    def wrapper(*args, **kwargs):
        start_time = time.time()
        logger.info(f"Tool {func.__name__} called with args: {args}, kwargs: {kwargs}")
        
        try:
            result = func(*args, **kwargs)
            execution_time = time.time() - start_time
            logger.info(f"Tool {func.__name__} completed in {execution_time:.2f}s")
            return result
        except Exception as e:
            logger.error(f"Tool {func.__name__} failed: {str(e)}")
            logger.error(traceback.format_exc())
            # Return error message instead of raising to prevent workflow failure
            return f"Error in {func.__name__}: {str(e)}"
    
    return wrapper

def create_logged_tool(tool_class):
    """
    Factory function to create a tool class with logging.
    
    Args:
        tool_class: The tool class to wrap
        
    Returns:
        Tool class with logging
    """
    class LoggedTool(tool_class):
        def _run(self, *args, **kwargs):
            start_time = time.time()
            tool_name = self.__class__.__name__
            logger.info(f"Tool {tool_name} called with args: {args}, kwargs: {kwargs}")
            
            try:
                result = super()._run(*args, **kwargs)
                execution_time = time.time() - start_time
                logger.info(f"Tool {tool_name} completed in {execution_time:.2f}s")
                return result
            except Exception as e:
                logger.error(f"Tool {tool_name} failed: {str(e)}")
                logger.error(traceback.format_exc())
                # Return error message instead of raising to prevent workflow failure
                return f"Error in {tool_name}: {str(e)}"
    
    return LoggedTool
