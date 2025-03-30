.PHONY: setup test test-tools test-nodes test-prompts test-integration test-performance clean lint format verify benchmark

# Setup environment
setup:
	python -m pip install --upgrade pip
	pip install -r requirements.txt
	pip install pytest pytest-asyncio pytest-cov black isort mypy pre-commit

# Run all tests (except performance)
test:
	python run_tests.py --skip-performance

# Run specific test groups
test-tools:
	python run_tests.py --type tools

test-nodes:
	python run_tests.py --type nodes

test-prompts:
	python run_tests.py --type prompts

test-integration:
	python run_tests.py --type integration

test-workflow:
	python run_tests.py --type workflow

# Run performance tests
test-performance:
	python run_tests.py --type performance

# Run all tests with verbose output
test-verbose:
	python run_tests.py --verbose

# Run with test coverage report
test-coverage:
	pytest --cov=src tests/

# Clean up environment
clean:
	rm -rf __pycache__
	rm -rf src/__pycache__
	rm -rf tests/__pycache__
	rm -rf .pytest_cache
	rm -rf .coverage
	rm -rf htmlcov
	find . -type d -name __pycache__ -exec rm -rf {} +

# Lint code
lint:
	black src/ tests/
	isort src/ tests/
	mypy src/

# Format code
format:
	black src/ tests/
	isort src/ tests/

# Verify installation
verify:
	python verify_installation.py

# Run benchmarks only
benchmark:
	python run_tests.py --type performance --verbose

# Start server
server:
	python server.py

# Start CLI tool
cli:
	python main.py
