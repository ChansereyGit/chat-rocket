#!/bin/bash

echo "🛑 Stopping ChatFlow Application"
echo "================================"

if [ -f .chatflow.pid ]; then
    while read pid; do
        if ps -p $pid > /dev/null 2>&1; then
            echo "Stopping process $pid..."
            kill $pid 2>/dev/null
        fi
    done < .chatflow.pid
    rm -f .chatflow.pid
    echo "✅ ChatFlow stopped"
else
    echo "⚠️  No running ChatFlow processes found"
    
    # Try to find and kill processes by port
    echo "Checking for processes on ports 3000 and 8080..."
    
    # Kill process on port 3000 (frontend)
    lsof -ti:3000 | xargs kill -9 2>/dev/null
    
    # Kill process on port 8080 (backend)
    lsof -ti:8080 | xargs kill -9 2>/dev/null
    
    echo "✅ Cleaned up processes on ports 3000 and 8080"
fi

# Clean up log files
rm -f backend.log frontend.log

echo "Done!"
