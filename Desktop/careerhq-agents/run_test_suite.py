#!/usr/bin/env python3
"""
Comprehensive test suite runner for CareerHQ Agent System.
Runs all tests and generates a detailed report.
"""
import os
import sys
import time
import subprocess
from datetime import datetime

# Test categories to run
TEST_CATEGORIES = [
    "tools",
    "nodes",
    "prompts",
    "integration",
    "workflow"
]

# Performance tests (run separately)
PERFORMANCE_TESTS = ["performance"]

def create_report_directory():
    """Create directory for test reports."""
    os.makedirs("test_reports", exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    report_dir = os.path.join("test_reports", f"test_run_{timestamp}")
    os.makedirs(report_dir, exist_ok=True)
    return report_dir

def run_test_category(category, report_dir):
    """Run tests for a specific category and capture results."""
    print(f"\n{'=' * 80}")
    print(f"Running {category} tests...")
    print(f"{'=' * 80}")
    
    # Define report file path
    report_file = os.path.join(report_dir, f"{category}_tests.txt")
    
    # Execute test with verbose output
    start_time = time.time()
    result = subprocess.run(
        ["python", "run_tests.py", "--type", category, "--verbose"],
        capture_output=True,
        text=True
    )
    end_time = time.time()
    
    # Save output to report file
    with open(report_file, "w") as f:
        f.write(f"CareerHQ Agent System - {category.upper()} Tests\n")
        f.write(f"Run at: {datetime.now().isoformat()}\n")
        f.write(f"Duration: {end_time - start_time:.2f} seconds\n")
        f.write("\nSTDOUT:\n")
        f.write(result.stdout)
        f.write("\nSTDERR:\n")
        f.write(result.stderr)
        f.write(f"\nExit code: {result.returncode}\n")
    
    # Print summary
    print(f"Completed {category} tests with exit code: {result.returncode}")
    print(f"Results saved to {report_file}")
    
    return {
        "category": category,
        "exit_code": result.returncode,
        "duration": end_time - start_time,
        "report_file": report_file
    }

def generate_summary_report(results, report_dir):
    """Generate a summary report of all test runs."""
    summary_file = os.path.join(report_dir, "summary_report.txt")
    
    with open(summary_file, "w") as f:
        f.write("CareerHQ Agent System - Test Suite Summary\n")
        f.write(f"Run at: {datetime.now().isoformat()}\n")
        f.write(f"{'=' * 80}\n\n")
        
        # Calculate statistics
        total_duration = sum(result["duration"] for result in results)
        passed = sum(1 for result in results if result["exit_code"] == 0)
        failed = len(results) - passed
        
        f.write(f"Total categories: {len(results)}\n")
        f.write(f"Passed: {passed}\n")
        f.write(f"Failed: {failed}\n")
        f.write(f"Total duration: {total_duration:.2f} seconds\n\n")
        
        # Write detailed results
        f.write("Category Details:\n")
        f.write(f"{'Category':<15} {'Status':<10} {'Duration':<12} {'Report':<50}\n")
        f.write(f"{'-' * 80}\n")
        
        for result in results:
            status = "PASSED" if result["exit_code"] == 0 else "FAILED"
            f.write(f"{result['category']:<15} {status:<10} {result['duration']:.2f}s {result['report_file']:<50}\n")
    
    print(f"\nSummary report generated at {summary_file}")
    return summary_file

def main():
    """Run the complete test suite."""
    print("Starting CareerHQ Agent System Test Suite")
    
    # Create report directory
    report_dir = create_report_directory()
    print(f"Test reports will be saved to: {report_dir}")
    
    # Verify installation before running tests
    print("\nVerifying installation...")
    subprocess.run(["python", "verify_installation.py"])
    
    # Run regular tests
    results = []
    for category in TEST_CATEGORIES:
        result = run_test_category(category, report_dir)
        results.append(result)
    
    # Generate summary report
    summary_file = generate_summary_report(results, report_dir)
    
    # Check if performance tests should be run
    run_performance = input("\nDo you want to run performance tests? (y/N): ")
    if run_performance.lower() == 'y':
        print("\nRunning performance tests (this may take a while)...")
        for category in PERFORMANCE_TESTS:
            result = run_test_category(category, report_dir)
            # Performance tests don't count toward pass/fail
    
    # Print final summary
    print(f"\n{'=' * 80}")
    print("Test Suite Execution Completed")
    print(f"{'=' * 80}")
    print(f"Total categories: {len(results)}")
    print(f"Passed: {sum(1 for result in results if result['exit_code'] == 0)}")
    print(f"Failed: {sum(1 for result in results if result['exit_code'] != 0)}")
    print(f"Summary report: {summary_file}")
    
    # Determine overall exit code
    exit_code = 0 if all(result["exit_code"] == 0 for result in results) else 1
    return exit_code

if __name__ == "__main__":
    sys.exit(main())
