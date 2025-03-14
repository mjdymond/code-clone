# ResumeOptimizer Supabase Edge Functions

This directory contains the Supabase Edge Functions that power the AI and processing features of the ResumeOptimizer application.

## Overview

These serverless functions handle resource-intensive operations that are better suited for server-side processing, such as document parsing, job scraping, resume analysis, and generating rewrite suggestions.

## Functions

### 1. `parse-document`

Parses uploaded resume documents (PDF, DOCX) and extracts structured content.

- **Input**: File content (base64), file type, file name
- **Output**: Extracted text content and structured sections
- **Dependencies**: PDF.js for PDF parsing

### 2. `analyze-resume`

Analyzes a resume against a job description using AI to identify matches, gaps, and provide recommendations.

- **Input**: Resume content, job description
- **Output**: Match score, keyword matches, skill gaps, section analysis, ATS compatibility
- **Dependencies**: OpenAI GPT-4o (with Anthropic Claude as fallback)

### 3. `scrape-job`

Scrapes job postings from URLs to extract structured job information.

- **Input**: Job posting URL
- **Output**: Job title, company, description, responsibilities, qualifications
- **Dependencies**: Deno DOM for HTML parsing

### 4. `generate-rewrite`

Generates optimized rewrites for resume sections tailored to specific job descriptions.

- **Input**: Resume section, original content, job description
- **Output**: Suggested rewrite for the section
- **Dependencies**: OpenAI GPT-4o (with Anthropic Claude as fallback)

## Setup

### Prerequisites

1. Supabase CLI installed
2. Supabase project created
3. API keys for OpenAI and/or Anthropic

### Configuration

1. Create a `supabase.env` file with your API keys and configuration:

```
# OpenAI API Key for AI-powered features
OPENAI_API_KEY=your_openai_api_key_here

# Anthropic API Key (fallback for OpenAI)
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Supabase project URL and anon key for database access
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

2. Deploy the functions to your Supabase project:

```bash
supabase functions deploy parse-document
supabase functions deploy analyze-resume
supabase functions deploy scrape-job
supabase functions deploy generate-rewrite
```

3. Set environment variables for the functions:

```bash
supabase secrets set --env-file ./supabase.env
```

## Local Development

To run the functions locally for development:

```bash
supabase start
supabase functions serve --env-file ./supabase.env
```

## Security

These functions use JWT authentication to ensure only authenticated users can access them. The client-side services pass the user's JWT token when making requests to these functions.

## Error Handling

All functions include comprehensive error handling to provide meaningful error messages to the client. If an AI service fails, some functions include fallback mechanisms to ensure the application remains functional.
