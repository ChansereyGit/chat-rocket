#!/bin/bash

echo "🚀 ChatFlow Database Setup Script"
echo "=================================="
echo ""

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed."
    echo "📦 Installing PostgreSQL..."
    
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        brew install postgresql@14
        brew services start postgresql@14
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        sudo apt-get update
        sudo apt-get install -y postgresql postgresql-contrib
        sudo systemctl start postgresql
    else
        echo "❌ Unsupported OS. Please install PostgreSQL manually."
        exit 1
    fi
else
    echo "✅ PostgreSQL is already installed"
fi

# Check if PostgreSQL is running
if ! pg_isready &> /dev/null; then
    echo "⚠️  PostgreSQL is not running. Starting..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew services start postgresql@14
    else
        sudo systemctl start postgresql
    fi
    sleep 2
fi

echo ""
echo "📊 Creating database and user..."
echo ""

# Create database and user
psql postgres << EOF
-- Create database if not exists
SELECT 'CREATE DATABASE chatflow'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'chatflow')\gexec

-- Create user if not exists (for PostgreSQL 14+)
DO \$\$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_user WHERE usename = 'root') THEN
        CREATE USER root WITH PASSWORD 'Admin';
    END IF;
END
\$\$;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE chatflow TO root;

-- Connect to chatflow database
\c chatflow

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO root;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO root;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO root;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO root;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO root;

EOF

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Database setup completed successfully!"
    echo ""
    echo "📝 Database Details:"
    echo "   Database: chatflow"
    echo "   User: root"
    echo "   Password: Admin"
    echo "   Host: localhost"
    echo "   Port: 5432"
    echo ""
    echo "🔗 Connection String:"
    echo "   postgresql://root:Admin@localhost:5432/chatflow"
    echo ""
    echo "🧪 Test connection:"
    echo "   psql -U root -d chatflow -h localhost"
    echo ""
else
    echo ""
    echo "❌ Database setup failed. Please check the errors above."
    exit 1
fi
