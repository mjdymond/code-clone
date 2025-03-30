#!/usr/bin/env python3
"""
Verification script to check that all required dependencies are installed correctly.
"""
import importlib
import sys
import os
from typing import List, Tuple

# List of essential packages to verify
ESSENTIAL_PACKAGES = [
    "langchain",
    "langgraph",
    "langchain_core",
    "openai",
    "fastapi",
    "uvicorn",
    "sse_starlette",
    "dotenv",
    "pydantic",
    "pandas",
    "chromadb",
    "aiohttp",
    "asyncio"
]

def check_package(package_name: str) -> Tuple[bool, str]:
    """
    Check if a package is installed and get its version.
    
    Args:
        package_name: Name of the package to check
        
    Returns:
        Tuple containing success status and version or error message
    """
    try:
        module = importlib.import_module(package_name)
        version = getattr(module, "__version__", "unknown version")
        return True, version
    except ImportError:
        return False, "Not installed"
    except Exception as e:
        return False, f"Error: {str(e)}"

def check_environment_variables() -> List[str]:
    """Check essential environment variables."""
    essential_vars = [
        "OPENAI_API_KEY",
        "BASIC_MODEL",
        "REASONING_MODEL",
        "VECTOR_DB_DIR"
    ]
    
    missing_vars = []
    for var in essential_vars:
        if not os.environ.get(var):
            missing_vars.append(var)
    
    return missing_vars

def main():
    """Run verification checks."""
    from dotenv import load_dotenv
    load_dotenv()
    
    print("🔍 Verifying CareerHQ Agent System installation...\n")
    
    # Check packages
    print("📦 Checking required packages:")
    all_packages_installed = True
    
    for package in ESSENTIAL_PACKAGES:
        success, version = check_package(package)
        status = "✅" if success else "❌"
        print(f"{status} {package}: {version}")
        if not success:
            all_packages_installed = False
    
    # Check environment variables
    print("\n🔐 Checking environment variables:")
    missing_vars = check_environment_variables()
    
    if missing_vars:
        print(f"❌ Missing environment variables: {', '.join(missing_vars)}")
    else:
        print("✅ All essential environment variables are set")
    
    # Check project structure
    print("\n📂 Checking project structure:")
    essential_dirs = ["src", "tests", "src/agents", "src/tools", "src/graph"]
    
    for directory in essential_dirs:
        if os.path.isdir(directory):
            print(f"✅ Directory found: {directory}")
        else:
            print(f"❌ Missing directory: {directory}")
            all_packages_installed = False
    
    # Summary
    print("\n📋 Installation verification summary:")
    if all_packages_installed and not missing_vars:
        print("✅ All checks passed! The system is ready for testing.")
        return 0
    else:
        print("❌ Some checks failed. Please address the issues above before testing.")
        return 1

if __name__ == "__main__":
    sys.exit(main())
