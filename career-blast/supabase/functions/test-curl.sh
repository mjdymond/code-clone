#!/bin/bash

# Test script for Edge Functions using curl
# This script simulates API calls to the deployed Edge Functions

# Set your Supabase URL and anon key
SUPABASE_URL="https://tircatiycsdtccomxxzs.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpcmNhdGl5Y3NkdGNjb214eHpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4NzMyNjQsImV4cCI6MjA1NzQ0OTI2NH0.ufFAoLU-xprMESEwkEo74vAaE3k-qJExPyzN43YEHBM"

echo "=== Testing Edge Functions with curl ==="

# Test analyze-resume function
echo "\n=== Testing analyze-resume function ==="
curl -X POST "${SUPABASE_URL}/functions/v1/analyze-resume" \
  -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"resumeContent":"Professional software engineer with 5 years of experience in TypeScript and React.", "jobDescription":"Looking for a senior software engineer with React and TypeScript experience."}'

# Test generate-rewrite function
echo "\n=== Testing generate-rewrite function ==="
curl -X POST "${SUPABASE_URL}/functions/v1/generate-rewrite" \
  -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"section":"experience", "originalContent":"Developed web applications using React and TypeScript.", "jobDescription":"Looking for a developer with React and TypeScript experience."}'

# Test scrape-job function
echo "\n=== Testing scrape-job function ==="
curl -X POST "${SUPABASE_URL}/functions/v1/scrape-job" \
  -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com/job-posting"}'

# Note: parse-document function requires base64 file content which is too large for this example
echo "\n=== Note on parse-document function ==="
echo "The parse-document function requires base64 file content which is too large for this example."
echo "To test it, you would need to encode a PDF or DOCX file and send it in the request."

echo "\n=== Tests completed ==="
