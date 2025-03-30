import logging
from langchain_openai import ChatOpenAI
from src.config.env import OPENAI_API_KEY, BASIC_MODEL, REASONING_MODEL

logger = logging.getLogger(__name__)

def get_llm_by_type(llm_type):
    """
    Factory function to get an LLM instance based on the specified type.
    
    Args:
        llm_type (str): Type of LLM to create
        
    Returns:
        ChatOpenAI: Configured LLM instance
    """
    if llm_type == "reasoning":
        logger.info(f"Using reasoning LLM: {REASONING_MODEL}")
        return ChatOpenAI(
            openai_api_key=OPENAI_API_KEY,
            model=REASONING_MODEL,
            temperature=0.1,
        )
    elif llm_type == "basic":
        logger.info(f"Using basic LLM: {BASIC_MODEL}")
        return ChatOpenAI(
            openai_api_key=OPENAI_API_KEY,
            model=BASIC_MODEL,
            temperature=0.7,
        )
    else:
        # Default to basic model
        logger.warning(f"Unknown LLM type: {llm_type}, defaulting to basic")
        return ChatOpenAI(
            openai_api_key=OPENAI_API_KEY,
            model=BASIC_MODEL,
            temperature=0.7,
        )
