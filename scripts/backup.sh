#!/bin/bash

# Make sure to install
# sudo apt update
# sudo apt install postgresql-client

# Create backup directory if it doesn't exist
mkdir -p backup

# Database credentials
DB_NAME="store"
DB_USER="pearlThoughts"
DB_PASSWORD="pt034"
DB_HOST="localhost"
DB_PORT="5432"

# Backup file name with timestamp
BACKUP_FILE="backup/${DB_NAME}_$(date +%Y%m%d%H%M%S).sql"

# Export password to avoid prompt
export PGPASSWORD=$DB_PASSWORD

# Run pg_dump to create a backup
pg_dump -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -F c -b -v -f $BACKUP_FILE

# Unset the password variable
unset PGPASSWORD

echo "Backup completed: $BACKUP_FILE"