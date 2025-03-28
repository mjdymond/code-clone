# CareerHQ Agent System

A multi-agent AI framework for career assistance based on LangGraph and LangChain.

## Project Overview

The CareerHQ Agent System is designed to provide comprehensive career assistance through specialized AI agents. Each agent focuses on specific career-related tasks such as resume optimization, job searching, application tracking, interview preparation, and salary negotiation.

For detailed information, see the [Project Overview](./project-overview.md) document.

## Getting Started

### Prerequisites

- Python 3.9+
- OpenAI API key (or other supported LLM provider)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/careerhq-agents.git
cd careerhq-agents
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your API keys
```

## Project Structure

```
/careerhq-agents
├── src/                     # Source code
│   ├── agents/              # Agent definitions
│   ├── api/                 # API endpoints
│   ├── config/              # Configuration files
│   ├── graph/               # Workflow graph definitions
│   ├── llms/                # LLM interfaces
│   ├── prompts/             # Agent prompts
│   ├── service/             # Service layer
│   ├── tools/               # Tool implementations
│   └── utils/               # Utility functions
├── static/                  # Static files
├── tests/                   # Test files
├── server.py                # Server entry point (future)
└── main.py                  # CLI entry point (future)
```

## Current Status

The project is in early development. See the [Project Status](./project-status.md) document for details on completed components and next steps.

## Contributing

This project is currently in development and not yet open for external contributions.

## License

[MIT License](LICENSE)
