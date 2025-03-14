#!/bin/bash

# Deployment script for Supabase Edge Functions

# Set colors for output
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
RED="\033[0;31m"
NC="\033[0m" # No Color

echo -e "${YELLOW}=== ResumeOptimizer Edge Functions Deployment ===${NC}"

# Check if supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo -e "${RED}Error: Supabase CLI is not installed.${NC}"
    echo -e "Please install it using: brew install supabase/tap/supabase"
    exit 1
 fi

# Check if logged in to Supabase
echo -e "${YELLOW}Checking Supabase login status...${NC}"
supabase projects list &> /dev/null
if [ $? -ne 0 ]; then
    echo -e "${YELLOW}You need to log in to Supabase CLI first.${NC}"
    supabase login
fi

# Deploy all functions
deploy_function() {
    local function_name=$1
    echo -e "\n${YELLOW}Deploying ${function_name} function...${NC}"
    supabase functions deploy ${function_name} --project-ref tircatiycsdtccomxxzs
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Successfully deployed ${function_name} function${NC}"
    else
        echo -e "${RED}✗ Failed to deploy ${function_name} function${NC}"
        exit 1
    fi
}

# Deploy each function
deploy_function "parse-document"
deploy_function "analyze-resume"
deploy_function "scrape-job"
deploy_function "generate-rewrite"

# Set secrets for the functions
echo -e "\n${YELLOW}Setting up environment variables...${NC}"

# Read from supabase.env file
if [ -f "supabase.env" ]; then
    echo -e "${YELLOW}Reading environment variables from supabase.env...${NC}"
    
    # Set OpenAI API key
    OPENAI_API_KEY=$(grep OPENAI_API_KEY supabase.env | cut -d '=' -f2)
    if [ ! -z "$OPENAI_API_KEY" ]; then
        echo -e "Setting OPENAI_API_KEY..."
        supabase secrets set OPENAI_API_KEY="$OPENAI_API_KEY" --project-ref tircatiycsdtccomxxzs
    fi
    
    # Set Anthropic API key if present
    ANTHROPIC_API_KEY=$(grep ANTHROPIC_API_KEY supabase.env | cut -d '=' -f2)
    if [ ! -z "$ANTHROPIC_API_KEY" ]; then
        echo -e "Setting ANTHROPIC_API_KEY..."
        supabase secrets set ANTHROPIC_API_KEY="$ANTHROPIC_API_KEY" --project-ref tircatiycsdtccomxxzs
    fi
    
    # Set PDFJS worker URL
    PDFJS_WORKER_URL=$(grep PDFJS_WORKER_URL supabase.env | cut -d '=' -f2)
    if [ ! -z "$PDFJS_WORKER_URL" ]; then
        echo -e "Setting PDFJS_WORKER_URL..."
        supabase secrets set PDFJS_WORKER_URL="$PDFJS_WORKER_URL" --project-ref tircatiycsdtccomxxzs
    fi
    
    echo -e "${GREEN}✓ Environment variables set successfully${NC}"
else
    echo -e "${RED}Warning: supabase.env file not found. Environment variables not set.${NC}"
    echo -e "Please set the environment variables manually using:"
    echo -e "supabase secrets set OPENAI_API_KEY=your_api_key --project-ref tircatiycsdtccomxxzs"
    echo -e "supabase secrets set PDFJS_WORKER_URL=https://cdn.jsdelivr.net/npm/pdfjs-dist@3.4.120/build/pdf.worker.min.js --project-ref tircatiycsdtccomxxzs"
fi

echo -e "\n${GREEN}=== Deployment completed successfully ===${NC}"
echo -e "${YELLOW}You can now test the functions using the test-curl.sh script.${NC}"
echo -e "Run: ./test-curl.sh"
