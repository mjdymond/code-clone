import logging
import asyncio
import json
from typing import Dict, Any, AsyncGenerator, Optional

from langchain_core.messages import HumanMessage

from src.graph.builder import build_graph

logger = logging.getLogger(__name__)

class WorkflowService:
    """Service for managing agent workflows."""
    
    def __init__(self):
        """Initialize the workflow service with the agent graph."""
        # Create the graph with increased recursion limit
        self.graph = build_graph().with_config(recursion_limit=30)
        logger.info("Initialized workflow service with agent graph")
    
    async def process_request(
        self,
        request_text: str,
        config: Optional[Dict[str, Any]] = None
    ) -> AsyncGenerator[Dict[str, Any], None]:
        """
        Process a user request through the agent workflow.
        
        Args:
            request_text: The user's request text
            config: Optional configuration for the workflow
        
        Yields:
            Dict containing intermediate or final responses
        """
        config = config or {}
        logger.info(f"Processing request: {request_text[:50]}...")
        
        # Initialize state
        state = {
            "messages": [HumanMessage(content=request_text)],
            "deep_thinking_mode": config.get("deep_thinking_mode", False),
            "search_before_planning": config.get("search_before_planning", True),
            "user_profile": config.get("user_profile", {}),
            "document_context": config.get("document_context", {})
        }
        
        # Execute the graph with streaming
        try:
            async for event in self.graph.astream(state):
                # Track the event type and progress
                event_type = "intermediate" if event.get("intermediate_steps") else "final"
                logger.debug(f"Received {event_type} event with {len(event.get('messages', []))} messages")
                
                # Format the event for client consumption
                formatted_event = self._format_event(event)
                yield formatted_event
                
                # Sleep briefly to prevent overwhelming the client
                await asyncio.sleep(0.01)
        except Exception as e:
            logger.error(f"Error processing request: {str(e)}")
            # Return error event
            yield {
                "type": "error",
                "error": str(e),
                "message": "An error occurred while processing your request."
            }
    
    def _format_event(self, event: Dict[str, Any]) -> Dict[str, Any]:
        """
        Format a graph event for client consumption.
        
        Args:
            event: The event from the graph
        
        Returns:
            Formatted event for client consumption
        """
        # Determine event type
        if "error" in event:
            event_type = "error"
        elif event.get("intermediate_steps"):
            event_type = "intermediate"
        else:
            event_type = "final"
        
        # Extract latest message content if available
        message_content = None
        if event.get("messages") and len(event["messages"]) > 0:
            latest_message = event["messages"][-1]
            message_content = latest_message.content
            speaker = getattr(latest_message, "name", "assistant")
        else:
            speaker = "system"
        
        # Create formatted response
        formatted_event = {
            "type": event_type,
            "speaker": speaker,
            "content": message_content,
            "timestamp": self._get_timestamp()
        }
        
        # Add additional metadata for debugging
        if "intermediate_steps" in event:
            formatted_event["step"] = len(event["intermediate_steps"])
        
        return formatted_event
    
    def _get_timestamp(self) -> str:
        """Get current timestamp in ISO format."""
        from datetime import datetime
        return datetime.now().isoformat()
