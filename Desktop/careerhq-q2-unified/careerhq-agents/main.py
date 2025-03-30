import argparse
import asyncio
import logging
import json
from typing import Dict, Any, Optional

from src.service.workflow_service import WorkflowService

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

class CareerAgentCLI:
    """Command Line Interface for CareerHQ Agent System."""
    
    def __init__(self):
        """Initialize the CLI interface."""
        self.workflow_service = WorkflowService()
    
    async def process_input(
        self,
        input_text: str,
        config: Optional[Dict[str, Any]] = None
    ) -> None:
        """
        Process user input through the agent workflow.
        
        Args:
            input_text: User's input text
            config: Optional configuration
        """
        config = config or {}
        print("\n📝 Processing your request...\n")
        
        # Process the request and stream results
        previous_speaker = None
        async for event in self.workflow_service.process_request(input_text, config):
            # Print each response with appropriate formatting
            if event["type"] == "error":
                print(f"\n❌ Error: {event.get('message', 'An unknown error occurred')}")
                continue
            
            speaker = event.get("speaker", "system")
            content = event.get("content")
            
            if content:
                # Print speaker name if it changed
                if speaker != previous_speaker:
                    print(f"\n🤖 {speaker.capitalize()}:")
                    previous_speaker = speaker
                
                # Print content
                print(content)
        
        print("\n✅ Processing complete.\n")
    
    def parse_args(self):
        """Parse command line arguments."""
        parser = argparse.ArgumentParser(description="CareerHQ Agent System CLI")
        
        # Command subparsers
        subparsers = parser.add_subparsers(dest="command", help="Command to execute")
        
        # General query parser
        query_parser = subparsers.add_parser("query", help="Process a general query")
        query_parser.add_argument("text", help="The query text")
        query_parser.add_argument("--deep-thinking", action="store_true", help="Enable deep thinking mode")
        
        # Resume analysis parser
        resume_parser = subparsers.add_parser("analyze-resume", help="Analyze a resume")
        resume_parser.add_argument("--resume", required=True, help="Path to resume file")
        resume_parser.add_argument("--job", help="Path to job description file")
        
        # Job search parser
        job_parser = subparsers.add_parser("search-jobs", help="Search for jobs")
        job_parser.add_argument("query", help="Job search query")
        job_parser.add_argument("--location", help="Job location")
        job_parser.add_argument("--remote", action="store_true", help="Search for remote jobs")
        
        # Cover letter parser
        cover_parser = subparsers.add_parser("generate-cover-letter", help="Generate a cover letter")
        cover_parser.add_argument("--resume", required=True, help="Path to resume file")
        cover_parser.add_argument("--job", required=True, help="Path to job description file")
        
        return parser.parse_args()
    
    async def run_command(self, args):
        """Run the appropriate command based on arguments."""
        if args.command == "query":
            config = {
                "deep_thinking_mode": args.deep_thinking
            }
            await self.process_input(args.text, config)
        
        elif args.command == "analyze-resume":
            # Read resume and job files
            with open(args.resume, "r") as f:
                resume_text = f.read()
            
            job_text = ""
            if args.job:
                with open(args.job, "r") as f:
                    job_text = f.read()
            
            # Construct input text
            input_text = f"Analyze this resume:\n\n{resume_text}"
            if job_text:
                input_text += f"\n\nFor this job description:\n\n{job_text}"
            
            # Process with deep thinking mode
            await self.process_input(input_text, {"deep_thinking_mode": True})
        
        elif args.command == "search-jobs":
            # Construct input text
            input_text = f"Search for jobs matching: {args.query}"
            if args.location:
                input_text += f" in {args.location}"
            if args.remote:
                input_text += " with remote options"
            
            await self.process_input(input_text)
        
        elif args.command == "generate-cover-letter":
            # Read resume and job files
            with open(args.resume, "r") as f:
                resume_text = f.read()
            
            with open(args.job, "r") as f:
                job_text = f.read()
            
            # Construct input text
            input_text = f"Generate a cover letter based on my resume and this job description. Resume:\n\n{resume_text}\n\nJob Description:\n\n{job_text}"
            
            await self.process_input(input_text)
        
        else:
            print("Please specify a valid command. Use --help for more information.")

def main():
    """Main entry point."""
    try:
        cli = CareerAgentCLI()
        args = cli.parse_args()
        
        if args.command:
            asyncio.run(cli.run_command(args))
        else:
            # Interactive mode
            print("💼 Welcome to CareerHQ Agent CLI! (Type 'exit' to quit)")
            while True:
                user_input = input("\n📝 Enter your query: ")
                if user_input.lower() in ["exit", "quit", "q"]:
                    print("👋 Goodbye!")
                    break
                
                asyncio.run(cli.process_input(user_input))
    
    except KeyboardInterrupt:
        print("\n\n👋 Goodbye!")
    except Exception as e:
        logger.error(f"An error occurred: {str(e)}")
        print(f"\n❌ Error: {str(e)}")

if __name__ == "__main__":
    main()
