#!/bin/bash

# Commands to deploy Supabase Edge Functions for ResumeOptimizer

# Deploy each function
supabase functions deploy parse-document --project-ref tircatiycsdtccomxxzs
supabase functions deploy analyze-resume --project-ref tircatiycsdtccomxxzs
supabase functions deploy scrape-job --project-ref tircatiycsdtccomxxzs
supabase functions deploy generate-rewrite --project-ref tircatiycsdtccomxxzs

# Set environment variables
supabase secrets set OPENAI_API_KEY="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" --project-ref tircatiycsdtccomxxzs

supabase secrets set ANTHROPIC_API_KEY="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" --project-ref tircatiycsdtccomxxzs

supabase secrets set PDFJS_WORKER_URL="https://cdn.jsdelivr.net/npm/pdfjs-dist@3.4.120/build/pdf.worker.min.js" --project-ref tircatiycsdtccomxxzs

# Test commands for invoking the functions

# Test analyze-resume function
curl -L -X POST \
  'https://tircatiycsdtccomxxzs.supabase.co/functions/v1/analyze-resume' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpcmNhdGl5Y3NkdGNjb214eHpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4NzMyNjQsImV4cCI6MjA1NzQ0OTI2NH0.ufFAoLU-xprMESEwkEo74vAaE3k-qJExPyzN43YEHBM' \
  -H 'Content-Type: application/json' \
  --data '{"resumeContent":"Professional software engineer with 5 years of experience in TypeScript and React.", "jobDescription":"Looking for a senior software engineer with React and TypeScript experience."}'

# Test generate-rewrite function
curl -L -X POST \
  'https://tircatiycsdtccomxxzs.supabase.co/functions/v1/generate-rewrite' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpcmNhdGl5Y3NkdGNjb214eHpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4NzMyNjQsImV4cCI6MjA1NzQ0OTI2NH0.ufFAoLU-xprMESEwkEo74vAaE3k-qJExPyzN43YEHBM' \
  -H 'Content-Type: application/json' \
  --data '{"section":"experience", "originalContent":"Developed web applications using React and TypeScript.", "jobDescription":"Looking for a developer with React and TypeScript experience."}'

# Test scrape-job function
curl -L -X POST \
  'https://tircatiycsdtccomxxzs.supabase.co/functions/v1/scrape-job' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpcmNhdGl5Y3NkdGNjb214eHpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4NzMyNjQsImV4cCI6MjA1NzQ0OTI2NH0.ufFAoLU-xprMESEwkEo74vAaE3k-qJExPyzN43YEHBM' \
  -H 'Content-Type: application/json' \
  --data '{"url":"https://example.com/job-posting"}'
