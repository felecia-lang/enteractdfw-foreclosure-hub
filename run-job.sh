#!/bin/bash

################################################################################
# Link Expiration Job - Quick Execution Script
################################################################################
#
# This script provides a convenient wrapper for executing the link expiration
# job with proper error handling and environment validation.
#
# Usage:
#   ./run-job.sh                    # Use .env file
#   ./run-job.sh --env production   # Use .env.production
#   DATABASE_URL="..." ./run-job.sh # Use inline variable
#
################################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

################################################################################
# Functions
################################################################################

print_header() {
    echo -e "${BLUE}"
    echo "╔════════════════════════════════════════════════════════════════════════════╗"
    echo "║              Link Expiration Job - Execution Script                       ║"
    echo "╚════════════════════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

check_dependencies() {
    print_info "Checking dependencies..."
    
    # Check for Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed"
        exit 1
    fi
    print_success "Node.js found: $(node --version)"
    
    # Check for pnpm
    if ! command -v pnpm &> /dev/null; then
        print_error "pnpm is not installed"
        print_info "Install with: npm install -g pnpm"
        exit 1
    fi
    print_success "pnpm found: $(pnpm --version)"
    
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        print_warning "node_modules not found, installing dependencies..."
        pnpm install
    else
        print_success "Dependencies installed"
    fi
}

load_environment() {
    local env_file=".env"
    
    # Check for --env flag
    if [ "$1" == "--env" ] && [ -n "$2" ]; then
        env_file=".env.$2"
    fi
    
    # Check if DATABASE_URL is already set
    if [ -n "$DATABASE_URL" ]; then
        print_success "DATABASE_URL found in environment"
        return 0
    fi
    
    # Try to load from .env file
    if [ -f "$env_file" ]; then
        print_info "Loading environment from $env_file"
        export $(cat "$env_file" | grep -v '^#' | xargs)
        
        if [ -n "$DATABASE_URL" ]; then
            print_success "DATABASE_URL loaded from $env_file"
            return 0
        fi
    fi
    
    # DATABASE_URL not found
    print_error "DATABASE_URL not found"
    echo ""
    echo "Please set DATABASE_URL using one of these methods:"
    echo ""
    echo "1. Create .env file:"
    echo "   echo 'DATABASE_URL=mysql://user:pass@host:3306/db' > .env"
    echo ""
    echo "2. Export environment variable:"
    echo "   export DATABASE_URL='mysql://user:pass@host:3306/db'"
    echo ""
    echo "3. Pass inline:"
    echo "   DATABASE_URL='mysql://user:pass@host:3306/db' ./run-job.sh"
    echo ""
    exit 1
}

validate_database_connection() {
    print_info "Validating database connection..."
    
    # Extract host and port from DATABASE_URL
    if [[ $DATABASE_URL =~ mysql://[^@]+@([^:/]+):?([0-9]*) ]]; then
        local host="${BASH_REMATCH[1]}"
        local port="${BASH_REMATCH[2]:-3306}"
        
        # Try to connect (timeout after 5 seconds)
        if timeout 5 bash -c "cat < /dev/null > /dev/tcp/$host/$port" 2>/dev/null; then
            print_success "Database host is reachable ($host:$port)"
        else
            print_warning "Cannot reach database host ($host:$port)"
            print_info "Continuing anyway - connection may still work..."
        fi
    else
        print_warning "Could not parse DATABASE_URL for validation"
    fi
}

run_job() {
    print_info "Executing link expiration job..."
    echo ""
    
    # Run the job
    if npx tsx run-link-expiration-report.ts; then
        echo ""
        print_success "Job completed successfully!"
        
        # Show latest report
        if [ -d "reports" ]; then
            local latest_report=$(ls -t reports/*.txt 2>/dev/null | head -1)
            if [ -n "$latest_report" ]; then
                echo ""
                print_info "Latest report: $latest_report"
            fi
        fi
        
        return 0
    else
        echo ""
        print_error "Job failed with errors"
        return 1
    fi
}

show_help() {
    echo "Link Expiration Job - Execution Script"
    echo ""
    echo "Usage:"
    echo "  ./run-job.sh                    Use .env file"
    echo "  ./run-job.sh --env production   Use .env.production"
    echo "  ./run-job.sh --help             Show this help"
    echo ""
    echo "Environment:"
    echo "  DATABASE_URL    MySQL connection string (required)"
    echo ""
    echo "Examples:"
    echo "  ./run-job.sh"
    echo "  DATABASE_URL='mysql://...' ./run-job.sh"
    echo "  ./run-job.sh --env staging"
    echo ""
}

################################################################################
# Main Execution
################################################################################

main() {
    # Check for help flag
    if [ "$1" == "--help" ] || [ "$1" == "-h" ]; then
        show_help
        exit 0
    fi
    
    print_header
    
    # Step 1: Check dependencies
    check_dependencies
    echo ""
    
    # Step 2: Load environment
    load_environment "$@"
    echo ""
    
    # Step 3: Validate connection
    validate_database_connection
    echo ""
    
    # Step 4: Run the job
    if run_job; then
        exit 0
    else
        exit 1
    fi
}

# Execute main function
main "$@"
