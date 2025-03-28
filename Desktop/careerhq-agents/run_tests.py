#!/usr/bin/env python3
"""
Enhanced test runner script for CareerHQ Agent System.
"""
import unittest
import sys
import os
import argparse
import time
from datetime import datetime

def run_tests(test_type=None, verbose=False, skip_performance=False):
    """Run specified tests."""
    # Add project root to path
    sys.path.append(os.path.abspath(os.path.dirname(__file__)))
    
    # Start timing
    start_time = time.time()
    
    # Configure test discovery
    loader = unittest.TestLoader()
    start_dir = os.path.join(os.path.dirname(__file__), 'tests')
    
    if test_type:
        # Run specific test type
        if test_type == "tools":
            pattern = "test_tools.py"
        elif test_type == "nodes":
            pattern = "test_nodes.py"
        elif test_type == "prompts":
            pattern = "test_prompts.py"
        elif test_type == "integration":
            pattern = "test_integration.py"
        elif test_type == "performance":
            pattern = "test_performance.py"
        elif test_type == "workflow":
            pattern = "test_workflow.py"
        else:
            pattern = f"test_{test_type}.py"
    else:
        # Run all tests except performance tests if skipped
        if skip_performance:
            # Discover all test files
            all_tests = []
            for file in os.listdir(start_dir):
                if file.startswith("test_") and file.endswith(".py"):
                    if file != "test_performance.py":
                        all_tests.append(file)
            
            # Create pattern to match all except performance tests
            pattern = f"({'|'.join(all_tests)})"
        else:
            # Run all tests
            pattern = "test_*.py"
    
    try:
        suite = loader.discover(start_dir, pattern=pattern)
        
        # Print test summary
        test_count = suite.countTestCases()
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        print(f"\n=== CareerHQ Agent System Test Suite ===")
        print(f"Date: {timestamp}")
        print(f"Running {test_count} tests")
        print(f"{'=' * 40}\n")
        
        # Run tests and capture results
        verbosity = 2 if verbose else 1
        runner = unittest.TextTestRunner(verbosity=verbosity)
        result = runner.run(suite)
        
        # Calculate timing
        end_time = time.time()
        elapsed = end_time - start_time
        
        # Print summary
        print(f"\n{'=' * 40}")
        print(f"Test Summary:")
        print(f"  Ran {result.testsRun} tests in {elapsed:.2f} seconds")
        print(f"  Failures: {len(result.failures)}")
        print(f"  Errors: {len(result.errors)}")
        print(f"  Skipped: {len(result.skipped)}")
        
        # Calculate pass rate
        pass_count = result.testsRun - len(result.failures) - len(result.errors)
        pass_rate = (pass_count / result.testsRun) * 100 if result.testsRun > 0 else 0
        print(f"  Pass rate: {pass_rate:.1f}% ({pass_count}/{result.testsRun})")
        
        print(f"{'=' * 40}")
        
        # Return exit code based on test results
        return 0 if result.wasSuccessful() else 1
    
    except Exception as e:
        print(f"Error running tests: {str(e)}")
        return 1

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Run CareerHQ Agent tests")
    parser.add_argument("--type", 
                      choices=["tools", "nodes", "prompts", "integration", "performance", "workflow", "all"],
                      default="all", 
                      help="Type of tests to run")
    parser.add_argument("--verbose", "-v", 
                      action="store_true", 
                      help="Verbose output")
    parser.add_argument("--skip-performance", "-s", 
                      action="store_true", 
                      help="Skip performance tests (which can be time-consuming)")
    
    args = parser.parse_args()
    test_type = None if args.type == "all" else args.type
    
    sys.exit(run_tests(test_type, args.verbose, args.skip_performance))
