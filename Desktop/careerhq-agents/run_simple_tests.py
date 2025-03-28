#!/usr/bin/env python3
"""
Simple test runner for the CareerHQ Agent System.
"""
import unittest
import sys
import os
import time

def run_tool_tests():
    """Run the tool tests."""
    print("Running tool tests...")
    start_time = time.time()
    
    # Load test module
    sys.path.append(os.path.abspath(os.path.dirname(__file__)))
    from tests.test_tools import (
        TestResumeTools,
        TestJobSearchTools,
        TestSalaryTools,
        TestInterviewTools,
        TestApplicationTools
    )
    
    # Create test suite
    suite = unittest.TestSuite()
    
    # Add test classes
    suite.addTests(unittest.defaultTestLoader.loadTestsFromTestCase(TestResumeTools))
    suite.addTests(unittest.defaultTestLoader.loadTestsFromTestCase(TestJobSearchTools))
    suite.addTests(unittest.defaultTestLoader.loadTestsFromTestCase(TestSalaryTools))
    suite.addTests(unittest.defaultTestLoader.loadTestsFromTestCase(TestInterviewTools))
    suite.addTests(unittest.defaultTestLoader.loadTestsFromTestCase(TestApplicationTools))
    
    # Run tests
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    
    # Calculate timing
    end_time = time.time()
    elapsed = end_time - start_time
    
    # Print summary
    print(f"\nTest Summary:")
    print(f"  Ran {result.testsRun} tests in {elapsed:.2f} seconds")
    print(f"  Failures: {len(result.failures)}")
    print(f"  Errors: {len(result.errors)}")
    print(f"  Skipped: {len(result.skipped)}")
    
    # Calculate pass rate
    pass_count = result.testsRun - len(result.failures) - len(result.errors)
    pass_rate = (pass_count / result.testsRun) * 100 if result.testsRun > 0 else 0
    print(f"  Pass rate: {pass_rate:.1f}% ({pass_count}/{result.testsRun})")
    
    # Return exit code
    return 0 if result.wasSuccessful() else 1

if __name__ == "__main__":
    sys.exit(run_tool_tests())
