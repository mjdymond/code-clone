# CareerHQ Agent System - Testing Documentation
# Navigate to the project directory
cd /Users/marcosdymond/Desktop/careerhq-agents

# Create a virtual environment
python -m venv venv

# Activate the virtual environment
source venv/bin/activate

# Install all dependencies using the Makefile
make setup

# Run all tests (except performance tests)
make test

# Run specific test categories
make test-tools
make test-nodes
make test-prompts
make test-integration
make test-workflow

# Run with verbose output
make test-verbose

# Run performance benchmarks
make benchmark
*Last Updated: March 27, 2025*

## Overview

This document outlines the testing approach and framework used in the CareerHQ Agent System. Our testing strategy focuses on comprehensive coverage across all system components, from individual tools to end-to-end workflows, ensuring both functionality and performance.

## Testing Philosophy

The CareerHQ testing approach prioritizes:

1. **Real-world behavior**: Tests focus on actual system behavior with minimal mocking, providing higher confidence in production reliability.
2. **Comprehensive coverage**: All system layers are tested, from individual tools to complete workflows.
3. **Performance awareness**: Dedicated benchmarks track system performance to guide optimization efforts.
4. **Maintainability**: Tests are structured to be readable, maintainable, and extensible as the system evolves.
5. **Integration validation**: End-to-end tests verify that components work together correctly in realistic scenarios.

## Test Categories

### 1. Tool Tests (`test_tools.py`)

Tool tests focus on the individual tools used by specialized agents:

- **Scope**: Tests for resume tools, job search tools, application tools, interview tools, and salary tools
- **Approach**: Unit tests that verify correct output structure, value ranges, and error handling
- **Coverage**: All public tool functions exposed to agents

Example:
```python
def test_analyze_resume(self):
    """Test resume analysis functionality."""
    result = analyze_resume(self.sample_resume, self.sample_job)
    
    # Verify result structure
    self.assertIn("strengths", result)
    self.assertIn("weaknesses", result)
    self.assertIn("match_score", result)
    
    # Verify constraints
    self.assertTrue(0 <= result["match_score"] <= 100)
```

### 2. Node Tests (`test_nodes.py`)

Node tests verify the behavior of graph nodes that form the workflow:

- **Scope**: Tests for all agent nodes, coordinator, planner, supervisor, and reporter
- **Approach**: Validates node interfaces, routing logic, and state transformations
- **Focus Areas**: 
  - Command structure verification
  - Routing logic validation
  - Special mode handling (e.g., deep thinking mode)
  - State transformation checks

Example:
```python
def test_supervisor_routing_logic(self):
    """Test the supervisor node routing logic."""
    # Extract available destinations from function signature
    sig = signature(supervisor_node)
    return_annotation = sig.return_annotation
    
    # Verify expected routing options
    destinations = extract_destinations(return_annotation)
    for member in TEAM_MEMBERS:
        self.assertTrue(member in destinations,
                      f"{member} should be a valid routing destination")
```

### 3. Prompt Template Tests (`test_prompts.py`)

Prompt template tests validate the template system that powers agent prompts:

- **Scope**: Tests for all agent templates and system templates
- **Approach**: Verifies template existence, variable substitution, and content inclusion
- **Focus Areas**:
  - Template file presence
  - Variable substitution functionality
  - Special content inclusion (document context, user profile)
  - Message history handling
  - Mode-specific templating (deep thinking mode)

Example:
```python
def test_document_context_inclusion(self):
    """Test document context is included in templates."""
    state = self.base_state.copy()
    state["document_context"] = {
        "resume": "Sample resume content",
        "job_description": "Sample job description"
    }
    
    result = apply_prompt_template("resume_agent", state)
    content = result[0].content
    
    self.assertIn("Sample resume content", content)
    self.assertIn("Sample job description", content)
```

### 4. Integration Tests (`test_integration.py`)

Integration tests verify end-to-end workflows across multiple components:

- **Scope**: Complete workflows involving multiple agents
- **Approach**: Process requests through the actual workflow service
- **Focus Areas**:
  - End-to-end request processing
  - Event streaming functionality
  - Multi-agent coordination
  - State propagation
  - Error handling

Example:
```python
def test_resume_analysis_query(self):
    """Test a resume analysis query."""
    request = f"Analyze this resume:\n\n{self.sample_resume}"
    
    events = asyncio.run(self.collect_events(request))
    
    self.assertTrue(len(events) > 0)
    final_events = [e for e in events if e.get("type") == "final"]
    self.assertTrue(len(final_events) > 0)
```

### 5. Performance Benchmarks (`test_performance.py`)

Performance benchmarks measure system performance to guide optimization:

- **Scope**: Various queries with different complexity levels
- **Approach**: Measures execution time, event counts, and other metrics
- **Focus Areas**:
  - Simple query performance
  - Complex workflow performance  
  - System initialization time
  - Graph compilation time
  - Statistical analysis of performance variance

Example:
```python
async def test_benchmark_suite(self):
    """Run a suite of benchmarks."""
    benchmarks = [
        {
            "name": "Simple Query",
            "request": "What skills are important for a software engineer?",
            "iterations": 2
        },
        {
            "name": "Resume Analysis",
            "request": f"Analyze this resume:\n\n{self.sample_resume}",
            "iterations": 2
        }
    ]
    
    # Run all benchmarks and save results
    benchmark_results = asyncio.run(run_all_benchmarks(benchmarks))
    self.save_benchmark_results(benchmark_results)
```

### 6. Workflow Service Tests (`test_workflow.py`)

Workflow service tests focus on the service layer that manages the agent graph:

- **Scope**: WorkflowService initialization and functionality
- **Approach**: Tests service initialization, request processing, and event formatting
- **Focus Areas**:
  - Service initialization
  - Request processing
  - Event formatting
  - Error handling

Example:
```python
def test_format_event(self):
    """Test event formatting."""
    event = {
        "messages": [AIMessage(content="Test response")]
    }
    formatted = self.service._format_event(event)
    
    self.assertEqual(formatted["type"], "final")
    self.assertEqual(formatted["content"], "Test response")
```

## Test Runner (`run_tests.py`)

The test runner provides a unified interface for executing tests:

### Features:

- **Test type selection**: Run specific test categories or all tests
- **Performance test skipping**: Option to skip time-consuming performance tests
- **Verbosity control**: Detailed or summary output
- **Comprehensive reporting**: Test count, timing, pass rate, and failure details

### Usage:

```bash
# Run all tests
python run_tests.py

# Run specific test type
python run_tests.py --type tools

# Run with verbose output
python run_tests.py --verbose

# Skip performance tests
python run_tests.py --skip-performance

# Combine options
python run_tests.py --type integration --verbose
```

## Test Data

Tests use standardized test fixtures:

- **Sample resume**: Consistent resume content for testing resume-related functionality
- **Sample job description**: Standard job posting for testing job matching and analysis
- **User profiles**: Test profiles with varying experience levels and skills
- **Document contexts**: Sample document combinations for testing context handling

## Continuous Integration

Tests are designed to be run in CI/CD pipelines:

- **Exit codes**: Test runner returns appropriate exit codes for CI systems
- **Timing information**: Performance metrics for trend analysis
- **Deterministic results**: Tests are designed to be reproducible
- **Skip options**: Long-running tests can be skipped in certain CI runs

## Writing New Tests

Guidelines for adding new tests:

1. **Follow the pattern**: Use existing tests as templates for new tests
2. **Test real behavior**: Focus on actual component behavior, not implementation details
3. **Minimize mocks**: Use real components when possible, mock only external dependencies
4. **Include edge cases**: Test error conditions and boundary cases
5. **Maintain independence**: Tests should not depend on each other's state
6. **Document purpose**: Include clear docstrings explaining test purpose
7. **Use fixtures**: Share test data through fixtures for consistency
8. **Consider performance**: Be mindful of test execution time

## Performance Benchmark Reports

Performance benchmarks generate reports with detailed metrics:

- **Timing statistics**: Average execution time, standard deviation
- **Event metrics**: Count of events generated during processing
- **Iteration data**: Raw timing data for statistical analysis
- **Timestamp information**: Test run date and time
- **System information**: Environment details when available

Reports are saved to the `benchmark_results` directory with timestamped filenames for tracking performance over time.

## Test Coverage

Current test coverage:

- **Tools**: 100% of public tool functions
- **Nodes**: 100% of workflow nodes
- **Templates**: 100% of template functionality
- **Integration**: Core workflows tested end-to-end
- **Performance**: Benchmarks for critical operations

## Special Testing Considerations

### Asynchronous Testing

Many components use asynchronous operations, requiring special testing approaches:

```python
async def collect_events(self, request, config=None):
    """Helper to collect events from a request."""
    events = []
    async for event in self.service.process_request(request, config):
        events.append(event)
    return events

def test_async_component(self):
    """Test asynchronous component."""
    events = asyncio.run(self.collect_events("Test request"))
    self.assertTrue(len(events) > 0)
```

### LLM Integration

Tests handle LLM dependencies through various strategies:

1. **Interface testing**: Verify calling patterns without executing actual LLM calls
2. **Structure verification**: Validate structures that will be processed by LLMs
3. **Output schema validation**: Ensure LLM output processors handle various formats
4. **Configuration testing**: Verify LLM configuration mechanisms

### Stream Processing

Tests for streaming functionality verify:

1. **Event generation**: Correct event sequence and content
2. **Partial updates**: Progressive information delivery
3. **End conditions**: Proper termination of streams
4. **Error propagation**: Error handling in stream processing

## Conclusion

The CareerHQ Agent System testing framework provides comprehensive coverage across all system components, ensuring reliability, performance, and correctness. The structured approach to testing enables ongoing development, optimization, and extension of the system with confidence that existing functionality remains intact.

The test suite serves as both a validation mechanism and documentation of expected system behavior, making it an essential part of the project's technical foundation.
