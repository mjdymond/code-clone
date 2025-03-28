import unittest
import sys
import os
import time
import asyncio
import statistics
from datetime import datetime

# Add the project root directory to Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from src.service.workflow_service import WorkflowService

class TestPerformance(unittest.TestCase):
    """Performance benchmarks for the agent system."""
    
    def setUp(self):
        """Set up test fixtures."""
        self.service = WorkflowService()
        
        # Sample data for testing
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
    
    async def measure_completion_time(self, request, config=None):
        """Measure the time to complete a workflow."""
        start_time = time.time()
        events = []
        
        async for event in self.service.process_request(request, config or {}):
            events.append(event)
        
        end_time = time.time()
        elapsed = end_time - start_time
        
        return {
            "elapsed_seconds": elapsed,
            "event_count": len(events),
            "final_events": len([e for e in events if e.get("type") == "final"]),
            "intermediate_events": len([e for e in events if e.get("type") == "intermediate"])
        }
    
    async def run_benchmark(self, name, request, iterations=2, config=None):
        """Run a benchmark with multiple iterations."""
        results = []
        event_counts = []
        
        print(f"\nRunning {name} benchmark...")
        
        for i in range(iterations):
            print(f"  Iteration {i+1}/{iterations}...")
            start = time.time()
            result = await self.measure_completion_time(request, config)
            
            results.append(result["elapsed_seconds"])
            event_counts.append(result["event_count"])
            
            # Add a delay between iterations
            await asyncio.sleep(1)
        
        # Calculate statistics
        avg_time = statistics.mean(results)
        if len(results) > 1:
            stdev_time = statistics.stdev(results)
        else:
            stdev_time = 0
        
        avg_events = statistics.mean(event_counts)
        
        print(f"  Results: Avg={avg_time:.2f}s, StdDev={stdev_time:.2f}s, Events={avg_events:.1f}")
        
        return {
            "name": name,
            "avg_time": avg_time,
            "stdev_time": stdev_time,
            "avg_events": avg_events,
            "iterations": iterations,
            "times": results,
            "event_counts": event_counts
        }
    
    def test_benchmark_suite(self):
        """Run a suite of benchmarks."""
        benchmarks = [
            {
                "name": "Simple Query",
                "request": "What skills are most important for a software engineer?",
                "iterations": 2
            },
            {
                "name": "Resume Analysis",
                "request": f"Analyze this resume:\n\n{self.sample_resume}",
                "iterations": 2
            },
            {
                "name": "Deep Thinking Mode",
                "request": "What are the best strategies for negotiating salary?",
                "iterations": 2,
                "config": {"deep_thinking_mode": True}
            },
            {
                "name": "Job Search",
                "request": "Find software engineering jobs that require Python and React",
                "iterations": 2
            }
        ]
        
        async def run_all_benchmarks():
            results = []
            for benchmark in benchmarks:
                result = await self.run_benchmark(
                    benchmark["name"],
                    benchmark["request"],
                    benchmark.get("iterations", 2),
                    benchmark.get("config")
                )
                results.append(result)
            return results
        
        # Run all benchmarks
        benchmark_results = asyncio.run(run_all_benchmarks())
        
        # Save results to a file
        self.save_benchmark_results(benchmark_results)
        
        # This test doesn't actually assert anything - it's just for benchmarking
        # We'll mark it as passed if it completes
        self.assertTrue(True)
    
    def save_benchmark_results(self, results):
        """Save benchmark results to a file."""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"benchmark_results_{timestamp}.txt"
        
        # Ensure the directory exists
        os.makedirs("benchmark_results", exist_ok=True)
        
        filepath = os.path.join("benchmark_results", filename)
        
        with open(filepath, "w") as f:
            f.write(f"CareerHQ Agent System Benchmark Results\n")
            f.write(f"Timestamp: {datetime.now().isoformat()}\n\n")
            
            for result in results:
                f.write(f"Benchmark: {result['name']}\n")
                f.write(f"  Average Time: {result['avg_time']:.2f} seconds\n")
                f.write(f"  Standard Deviation: {result['stdev_time']:.2f} seconds\n")
                f.write(f"  Average Event Count: {result['avg_events']:.1f}\n")
                f.write(f"  Iterations: {result['iterations']}\n")
                f.write(f"  Raw Times: {', '.join([f'{t:.2f}s' for t in result['times']])}\n")
                f.write(f"  Raw Event Counts: {', '.join([str(c) for c in result['event_counts']])}\n")
                f.write("\n")
        
        print(f"\nBenchmark results saved to {filepath}")
    
    def test_startup_time(self):
        """Measure the startup time of the workflow service."""
        start_time = time.time()
        
        # Create a new service (measures initialization time)
        service = WorkflowService()
        
        end_time = time.time()
        elapsed = end_time - start_time
        
        print(f"\nWorkflow service startup time: {elapsed:.4f} seconds")
        
        # This is not a pass/fail test, just informational
        self.assertTrue(True)
    
    def test_graph_compilation_time(self):
        """Measure the time to compile the workflow graph."""
        from src.graph.builder import build_graph
        
        start_time = time.time()
        
        # Build the graph
        graph = build_graph()
        
        end_time = time.time()
        elapsed = end_time - start_time
        
        print(f"\nGraph compilation time: {elapsed:.4f} seconds")
        
        # This is not a pass/fail test, just informational
        self.assertTrue(True)

if __name__ == "__main__":
    unittest.main()
