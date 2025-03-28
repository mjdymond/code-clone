import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# OpenAI configuration
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")

# Basic LLM configuration (for most agents)
BASIC_MODEL = os.getenv("BASIC_MODEL", "gpt-4")

# Reasoning LLM configuration (for planning and complex tasks)
REASONING_MODEL = os.getenv("REASONING_MODEL", "gpt-4-turbo")

# Vector DB configuration
VECTOR_DB_DIR = os.getenv("VECTOR_DB_DIR", "./vector_db")

# Make sure required environment variables are set
if not OPENAI_API_KEY:
    print("Warning: OPENAI_API_KEY environment variable is not set.")
