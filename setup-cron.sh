#!/bin/bash

################################################################################
# Link Expiration Job - Cron Setup Script
################################################################################
#
# This script helps you set up automated scheduling for the link expiration
# job using cron. It will guide you through the process and configure
# everything automatically.
#
# Usage:
#   ./setup-cron.sh
#
################################################################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

print_header() {
    echo -e "${BLUE}"
    echo "╔════════════════════════════════════════════════════════════════════════════╗"
    echo "║              Link Expiration Job - Cron Setup Wizard                      ║"
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

check_prerequisites() {
    print_info "Checking prerequisites..."
    
    # Check if cron is installed
    if ! command -v crontab &> /dev/null; then
        print_error "cron is not installed"
        echo "Install with: sudo apt-get install cron"
        exit 1
    fi
    print_success "cron is installed"
    
    # Check if run-job.sh exists and is executable
    if [ ! -f "$SCRIPT_DIR/run-job.sh" ]; then
        print_error "run-job.sh not found"
        exit 1
    fi
    
    if [ ! -x "$SCRIPT_DIR/run-job.sh" ]; then
        print_warning "run-job.sh is not executable, fixing..."
        chmod +x "$SCRIPT_DIR/run-job.sh"
    fi
    print_success "run-job.sh is ready"
    
    # Check for DATABASE_URL
    if [ ! -f "$SCRIPT_DIR/.env" ] && [ -z "$DATABASE_URL" ]; then
        print_warning "DATABASE_URL not configured"
        echo ""
        echo "You need to set DATABASE_URL before scheduling."
        echo "Options:"
        echo "  1. Create .env file: echo 'DATABASE_URL=mysql://...' > .env"
        echo "  2. We'll configure it in the cron job directly"
        echo ""
        read -p "Do you want to continue? (y/n): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    else
        print_success "DATABASE_URL is configured"
    fi
}

select_schedule() {
    echo ""
    print_info "Select execution schedule:"
    echo ""
    echo "1) Daily at 2:00 AM (Recommended)"
    echo "2) Daily at 3:00 AM"
    echo "3) Every 12 hours (2 AM and 2 PM)"
    echo "4) Every 6 hours"
    echo "5) Weekly (Mondays at 2 AM)"
    echo "6) Custom schedule"
    echo ""
    read -p "Enter your choice (1-6): " choice
    
    case $choice in
        1)
            CRON_SCHEDULE="0 2 * * *"
            SCHEDULE_DESC="Daily at 2:00 AM"
            ;;
        2)
            CRON_SCHEDULE="0 3 * * *"
            SCHEDULE_DESC="Daily at 3:00 AM"
            ;;
        3)
            CRON_SCHEDULE="0 2,14 * * *"
            SCHEDULE_DESC="Every 12 hours (2 AM and 2 PM)"
            ;;
        4)
            CRON_SCHEDULE="0 */6 * * *"
            SCHEDULE_DESC="Every 6 hours"
            ;;
        5)
            CRON_SCHEDULE="0 2 * * 1"
            SCHEDULE_DESC="Weekly on Mondays at 2:00 AM"
            ;;
        6)
            echo ""
            print_info "Enter custom cron schedule (e.g., '0 2 * * *'):"
            read -p "Schedule: " CRON_SCHEDULE
            SCHEDULE_DESC="Custom: $CRON_SCHEDULE"
            ;;
        *)
            print_error "Invalid choice"
            exit 1
            ;;
    esac
    
    echo ""
    print_success "Selected: $SCHEDULE_DESC"
}

configure_logging() {
    echo ""
    print_info "Configure logging:"
    echo ""
    echo "1) /var/log/link-expiration.log (Recommended)"
    echo "2) $SCRIPT_DIR/logs/expiration.log"
    echo "3) No logging (not recommended)"
    echo ""
    read -p "Enter your choice (1-3): " choice
    
    case $choice in
        1)
            LOG_FILE="/var/log/link-expiration.log"
            # Create log file if it doesn't exist
            sudo touch "$LOG_FILE" 2>/dev/null || {
                print_warning "Cannot create $LOG_FILE, using local log instead"
                LOG_FILE="$SCRIPT_DIR/logs/expiration.log"
                mkdir -p "$SCRIPT_DIR/logs"
            }
            ;;
        2)
            LOG_FILE="$SCRIPT_DIR/logs/expiration.log"
            mkdir -p "$SCRIPT_DIR/logs"
            ;;
        3)
            LOG_FILE="/dev/null"
            ;;
        *)
            print_error "Invalid choice"
            exit 1
            ;;
    esac
    
    print_success "Log file: $LOG_FILE"
}

check_database_url() {
    echo ""
    if [ -f "$SCRIPT_DIR/.env" ]; then
        print_info "DATABASE_URL will be loaded from .env file"
        USE_ENV_FILE=true
    else
        print_warning "No .env file found"
        echo ""
        read -p "Do you want to set DATABASE_URL in the cron job? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            echo ""
            print_info "Enter your DATABASE_URL:"
            read -s DATABASE_URL_INPUT
            echo ""
            USE_ENV_FILE=false
        else
            print_error "DATABASE_URL is required"
            exit 1
        fi
    fi
}

create_cron_job() {
    echo ""
    print_info "Creating cron job..."
    
    # Build cron command
    if [ "$USE_ENV_FILE" = true ]; then
        CRON_COMMAND="cd $SCRIPT_DIR && $SCRIPT_DIR/run-job.sh >> $LOG_FILE 2>&1"
    else
        CRON_COMMAND="cd $SCRIPT_DIR && DATABASE_URL='$DATABASE_URL_INPUT' $SCRIPT_DIR/run-job.sh >> $LOG_FILE 2>&1"
    fi
    
    # Full cron line
    CRON_LINE="$CRON_SCHEDULE $CRON_COMMAND"
    
    # Check if job already exists
    if crontab -l 2>/dev/null | grep -q "run-job.sh"; then
        print_warning "Existing cron job found for run-job.sh"
        echo ""
        read -p "Do you want to replace it? (y/n): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_info "Keeping existing cron job"
            exit 0
        fi
        
        # Remove existing job
        crontab -l 2>/dev/null | grep -v "run-job.sh" | crontab -
        print_success "Removed existing cron job"
    fi
    
    # Add new cron job
    (crontab -l 2>/dev/null; echo "$CRON_LINE") | crontab -
    
    print_success "Cron job created successfully!"
}

show_summary() {
    echo ""
    echo -e "${GREEN}"
    echo "╔════════════════════════════════════════════════════════════════════════════╗"
    echo "║                         SETUP COMPLETED SUCCESSFULLY                       ║"
    echo "╚════════════════════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    echo ""
    echo "📋 Configuration Summary:"
    echo "   Schedule: $SCHEDULE_DESC"
    echo "   Log File: $LOG_FILE"
    echo "   Script: $SCRIPT_DIR/run-job.sh"
    echo ""
    echo "🔍 Verify Installation:"
    echo "   crontab -l"
    echo ""
    echo "📊 View Logs:"
    echo "   tail -f $LOG_FILE"
    echo ""
    echo "🧪 Test Manually:"
    echo "   cd $SCRIPT_DIR && ./run-job.sh"
    echo ""
    echo "❌ Remove Cron Job:"
    echo "   crontab -e  # Then delete the line containing 'run-job.sh'"
    echo ""
    print_success "Link expiration job is now scheduled!"
}

main() {
    print_header
    check_prerequisites
    select_schedule
    configure_logging
    check_database_url
    create_cron_job
    show_summary
}

main
