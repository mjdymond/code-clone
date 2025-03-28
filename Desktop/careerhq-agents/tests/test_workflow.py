import unittest
import sys
import os
import asyncio
from unittest.mock import MagicMock, patch

# Add the project root directory to Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from src.service.workflow_service import WorkflowService
from langchain_core.messages import HumanMessage, AIMessage

class TestWorkflowService(unittest.TestCase):
    """Test cases for workflow service."""
    
    def setUp(self):
        """Set up test fixtures."""
        self.service = WorkflowService()
        
        # Sample resume for testing
        self.sample_resume = """
        John Doe
        Software Engineer
        
        EXPERIENCE
        Senior Developer, ABC Tech (2018-Present)
        - Developed web applications using React and Node.js
        - Managed team of 3 junior developers
        
        EDUCATION
        BS Computer Science, State University (2015)
        
        SKILLS
        JavaScript, Python, React, Node.js, SQL
        """
        
        # Sample job description for testing
        self.sample_job = """
        Senior Frontend Engineer
        
        Requirements:
        - 5+ years experience with React and modern JavaScript
        - Experience with TypeScript and state management libraries
        - Knowledge of CI/CD pipelines and testing frameworks
        - Bachelor's degree in Computer Science or related field
        """
    
    @patch('src.graph.builder.build_graph')
    def test_init(self, mock_build_graph):
        """Test service initialization."""
        # Setup mock
        mock_build_graph.return_value = MagicMock()
        
        # Create service
        service = WorkflowService()
        
        # Verify graph was built
        mock_build_graph.assert_called_once()
        self.assertIsNotNone(service.graph)
    
    @patch.object(WorkflowService, 'process_request')
    def test_process_request_called(self, mock_process_request):
        """Test process_request is called with correct parameters."""
        # Setup mock
        async def mock_async_gen():
            yield {"type": "final", "content": "Test response"}
        mock_process_request.return_value = mock_async_gen()
        
        # Call method
        asyncio.run(self.collect_results(self.service.process_request("Test request")))
        
        # Verify method was called with correct parameters
        mock_process_request.assert_called_once()
        args, kwargs = mock_process_request.call_args
        self.assertEqual(args[0], "Test request")
    
    @patch.object(WorkflowService, '_format_event')
    @patch.object(WorkflowService, 'graph')
    async def test_format_event_called(self, mock_graph, mock_format_event):
        """Test _format_event is called for each event."""
        # Setup mocks
        async def mock_astream(state):
            yield {"messages": [AIMessage(content="Test response")]}
        mock_graph.astream = mock_astream
        mock_format_event.return_value = {"type": "test", "content": "formatted"}
        
        # Call method
        results = [r async for r in self.service.process_request("Test request")]
        
        # Verify _format_event was called
        mock_format_event.assert_called_once()
        self.assertEqual(results, [{"type": "test", "content": "formatted"}])
    
    def test_format_event(self):
        """Test event formatting."""
        # Test final event
        event = {
            "messages": [AIMessage(content="Test final response")]
        }
        formatted = self.service._format_event(event)
        self.assertEqual(formatted["type"], "final")
        self.assertEqual(formatted["content"], "Test final response")
        
        # Test intermediate event
        event = {
            "intermediate_steps": [1, 2, 3],
            "messages": [AIMessage(content="Test intermediate response")]
        }
        formatted = self.service._format_event(event)
        self.assertEqual(formatted["type"], "intermediate")
        self.assertEqual(formatted["content"], "Test intermediate response")
        self.assertEqual(formatted["step"], 3)
        
        # Test error event
        event = {
            "error": "Test error",
            "messages": []
        }
        formatted = self.service._format_event(event)
        self.assertEqual(formatted["type"], "error")
    
    async def collect_results(self, async_gen):
        """Helper to collect results from async generator."""
        results = []
        async for item in async_gen:
            results.append(item)
        return results

if __name__ == "__main__":
    unittest.main()
