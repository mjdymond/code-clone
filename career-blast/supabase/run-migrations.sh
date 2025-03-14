#!/bin/bash

# Set colors for output
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
RED="\033[0;31m"
NC="\033[0m" # No Color

echo -e "${YELLOW}=== ResumeOptimizer Database Migration ===${NC}"

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

# Project reference
PROJECT_REF="tircatiycsdtccomxxzs"

# Run the migration
echo -e "\n${YELLOW}Running database migrations...${NC}"
supabase db push --db-url "postgresql://postgres:postgres@localhost:54322/postgres" --project-ref "$PROJECT_REF"

# Check if migration was successful
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Successfully applied database migrations${NC}"
else
    echo -e "${RED}✗ Failed to apply database migrations${NC}"
    exit 1
fi

# Run the SQL script directly
echo -e "\n${YELLOW}Running SQL script directly...${NC}"
supabase sql --file ./migrations/20250314_setup_tables.sql --project-ref "$PROJECT_REF"

# Check if SQL execution was successful
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Successfully executed SQL script${NC}"
else
    echo -e "${RED}✗ Failed to execute SQL script${NC}"
    exit 1
fi

echo -e "\n${GREEN}=== Database migration completed successfully ===${NC}"
