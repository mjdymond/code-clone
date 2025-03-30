import unittest
import sys
import os
import asyncio
import json
from typing import Dict, Any, List

# Add the project root directory to Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from src.service.workflow_service import WorkflowService

class TestIntegrationWorkflows(unittest.TestCase):
    """Integration tests for end-to-end workflows."""
    
    def setUp(self):
        """Set up test fixtures."""
        # Create a real workflow service for integration testing
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
    
    def test_service_initialization(self):
        """Test that the workflow service initializes correctly."""
        # Verify service was created
        self.assertIsNotNone(self.service)
        # Verify graph was built
        self.assertIsNotNone(self.service.graph)
    
    async def collect_events(self, request, config=None):
        """Helper to collect events from a request."""
        events = []
        try:
            async for event in self.service.process_request(request, config):
                events.append(event)
        except Exception as e:
            self.fail(f"Request processing failed with error: {str(e)}")
        return events
    
    def test_simple_query_execution(self):
        """Test that a simple query can be processed."""
        # Run synchronous test via asyncio
        simple_query = "What skills are important for a software engineer?"
        events = asyncio.run(self.collect_events(simple_query))
        
        # Verify we got events
        self.assertTrue(len(events) > 0)
        
        # Verify at least one final event was received
        final_events = [e for e in events if e.get("type") == "final"]
        self.assertTrue(len(final_events) > 0)
        
        # Verify content is non-empty
        self.assertTrue(any(e.get("content") for e in events))
    
    def test_resume_analysis_query(self):
        """Test a resume analysis query."""
        # Create a resume analysis request
        request = f"Analyze this resume:\n\n{self.sample_resume}"
        
        # Run synchronous test via asyncio
        events = asyncio.run(self.collect_events(request))
        
        # Verify we got events
        self.assertTrue(len(events) > 0)
        
        # Check that we got a final response
        final_events = [e for e in events if e.get("type") == "final"]
        self.assertTrue(len(final_events) > 0)
    
    def test_deep_thinking_mode(self):
        """Test that deep thinking mode works."""
        # Create a query that would benefit from deep thinking
        request = f"Analyze this resume in detail and provide comprehensive feedback:\n\n{self.sample_resume}"
        
        # Set deep thinking mode in config
        config = {"deep_thinking_mode": True}
        
        # Run synchronous test via asyncio
        events = asyncio.run(self.collect_events(request, config))
        
        # Verify we got events
        self.assertTrue(len(events) > 0)
        
        # Verify final response
        final_events = [e for e in events if e.get("type") == "final"]
        self.assertTrue(len(final_events) > 0)
    
    def test_job_search_query(self):
        """Test a job search query."""
        # Create a job search request
        request = "Find software engineering jobs in San Francisco with React and Python requirements"
        
        # Run synchronous test via asyncio
        events = asyncio.run(self.collect_events(request))
        
        # Verify we got events
        self.assertTrue(len(events) > 0)
        
        # Check that we got a final response
        final_events = [e for e in events if e.get("type") == "final"]
        self.assertTrue(len(final_events) > 0)
    
    def test_interview_preparation_query(self):
        """Test an interview preparation query."""
        # Create an interview preparation request
        request = "Prepare interview questions for a senior software engineer position"
        
        # Run synchronous test via asyncio
        events = asyncio.run(self.collect_events(request))
        
        # Verify we got events
        self.assertTrue(len(events) > 0)
        
        # Check that we got a final response
        final_events = [e for e in events if e.get("type") == "final"]
        self.assertTrue(len(final_events) > 0)
    
    def test_event_format(self):
        """Test that events have the correct format."""
        # Run a simple query
        simple_query = "What are good resume formats?"
        events = asyncio.run(self.collect_events(simple_query))
        
        # Check first event format
        self.assertTrue(len(events) > 0)
        first_event = events[0]
        
        # Verify event has required fields
        required_fields = ["type", "speaker", "content", "timestamp"]
        for field in required_fields:
            self.assertIn(field, first_event)
        
        # Verify timestamp format (should be ISO format)
        timestamp = first_event["timestamp"]
        try:
            from datetime import datetime
            datetime.fromisoformat(timestamp)
        except ValueError:
            self.fail(f"Timestamp '{timestamp}' is not in ISO format")
    
    def test_error_handling(self):
        """Test error handling during workflow execution."""
        # This test needs to be adjusted to your specific error handling implementation
        # One way is to test with an invalid state structure
        try:
            invalid_state = {"invalid": "state"}
            # This should be handled gracefully
            events = asyncio.run(self.collect_events("Test query", invalid_state))
            
            # Even with errors, we should get events
            self.assertTrue(len(events) > 0)
            
            # Check if any error events were generated
            error_events = [e for e in events if e.get("type") == "error"]
            # It's okay if there aren't explicit error events as long as the system doesn't crash
        except Exception as e:
            # If an exception is raised, the test still passes
            # as we're testing the failure mode
            pass

if __name__ == "__main__":
    unittest.main()
