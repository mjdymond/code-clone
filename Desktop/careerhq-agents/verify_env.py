#!/usr/bin/env python3
"""
Verify environment settings and connections for the CareerHQ Agent System.
"""
import os
import sys
import logging
from dotenv import load_dotenv
import requests
import json

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

def check_env_variables():
    """Check if all required environment variables are set."""
    logger.info("Checking environment variables...")
    
    # Load environment variables
    load_dotenv()
    
    required_vars = [
        "OPENAI_API_KEY",
        "BASIC_MODEL",
        "REASONING_MODEL",
        "SUPABASE_URL",
        "SUPABASE_SERVICE_ROLE_KEY"
    ]
    
    missing_vars = []
    for var in required_vars:
        value = os.getenv(var)
        if not value:
            missing_vars.append(var)
            logger.error(f"❌ Missing environment variable: {var}")
        else:
            # Mask API keys for security
            if "KEY" in var or "TOKEN" in var:
                masked_value = value[:4] + "*" * (len(value) - 8) + value[-4:]
                logger.info(f"✅ Found {var}: {masked_value}")
            else:
                logger.info(f"✅ Found {var}: {value}")
    
    return len(missing_vars) == 0

def test_openai_connection():
    """Test connection to OpenAI API."""
    logger.info("Testing OpenAI API connection...")
    
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        logger.error("❌ OpenAI API key not found")
        return False
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }
    
    data = {
        "model": os.getenv("BASIC_MODEL", "gpt-3.5-turbo"),
        "messages": [{"role": "user", "content": "Hello, this is a test message. Please respond with 'API connection successful'."}],
        "max_tokens": 20
    }
    
    try:
        response = requests.post(
            "https://api.openai.com/v1/chat/completions",
            headers=headers,
            json=data,
            timeout=10
        )
        
        if response.status_code == 200:
            logger.info(f"✅ OpenAI API connection successful: {response.status_code}")
            response_json = response.json()
            message_content = response_json.get("choices", [{}])[0].get("message", {}).get("content", "")
            logger.info(f"Response: {message_content}")
            return True
        else:
            logger.error(f"❌ OpenAI API connection failed: {response.status_code}")
            logger.error(f"Error: {response.text}")
            return False
    
    except Exception as e:
        logger.error(f"❌ OpenAI API connection error: {str(e)}")
        return False

def test_supabase_connection():
    """Test connection to Supabase."""
    logger.info("Testing Supabase connection...")
    
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    
    if not supabase_url or not supabase_key:
        logger.error("❌ Supabase URL or key not found")
        return False
    
    headers = {
        "apikey": supabase_key,
        "Authorization": f"Bearer {supabase_key}"
    }
    
    try:
        # Try to access Supabase health endpoint
        response = requests.get(
            f"{supabase_url}/rest/v1/",
            headers=headers,
            timeout=10
        )
        
        if response.status_code in [200, 400]:
            # 400 can be a valid response if the endpoint requires more parameters
            logger.info(f"✅ Supabase connection successful: {response.status_code}")
            return True
        else:
            logger.error(f"❌ Supabase connection failed: {response.status_code}")
            logger.error(f"Error: {response.text}")
            return False
    
    except Exception as e:
        logger.error(f"❌ Supabase connection error: {str(e)}")
        return False

def verify_required_modules():
    """Verify that all required modules are installed."""
    logger.info("Verifying required modules...")
    
    required_modules = [
        "langchain",
        "langgraph",
        "langchain_core",
        "langchain_openai",
        "openai",
        "fastapi",
        "uvicorn",
        "sse_starlette",
        "pydantic",
        "supabase"
    ]
    
    missing_modules = []
    
    for module in required_modules:
        try:
            __import__(module)
            logger.info(f"✅ Module found: {module}")
        except ImportError:
            missing_modules.append(module)
            logger.error(f"❌ Missing module: {module}")
    
    if missing_modules:
        install_cmd = "pip install " + " ".join(missing_modules)
        logger.info(f"Run the following command to install missing modules: {install_cmd}")
    
    return len(missing_modules) == 0

def main():
    """Run all verification checks."""
    print("\n🔍 Verifying CareerHQ Agent System environment...\n")
    
    all_checks_passed = True
    
    # Check environment variables
    if not check_env_variables():
        all_checks_passed = False
        print("\n❌ Environment variable check failed!")
    else:
        print("\n✅ Environment variable check passed!")
    
    # Verify required modules
    if not verify_required_modules():
        all_checks_passed = False
        print("\n❌ Required modules check failed!")
    else:
        print("\n✅ Required modules check passed!")
    
    # Test OpenAI connection
    if not test_openai_connection():
        all_checks_passed = False
        print("\n❌ OpenAI API connection check failed!")
    else:
        print("\n✅ OpenAI API connection check passed!")
    
    # Test Supabase connection
    if not test_supabase_connection():
        all_checks_passed = False
        print("\n❌ Supabase connection check failed!")
    else:
        print("\n✅ Supabase connection check passed!")
    
    # Print summary
    print("\n" + "=" * 50)
    if all_checks_passed:
        print("🎉 All environment checks passed! You can now run real-world tests.")
        print("To run the tests, execute: python real_world_test.py")
        return 0
    else:
        print("❌ Some environment checks failed. Please fix the issues before running tests.")
        return 1

if __name__ == "__main__":
    sys.exit(main())
