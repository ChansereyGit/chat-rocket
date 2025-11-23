#!/bin/bash

echo "🚀 Starting ChatFlow Application"
echo "================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if PostgreSQL is running
echo -e "${BLUE}📊 Checking PostgreSQL...${NC}"
if ! pg_isready &> /dev/null; then
    echo -e "${YELLOW}⚠️  PostgreSQL is not running. Starting...${NC}"
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew services start postgresql@14
    else
        sudo systemctl start postgresql
    fi
    sleep 2
fi

if pg_isready &> /dev/null; then
    echo -e "${GREEN}✅ PostgreSQL is running${NC}"
else
    echo -e "${YELLOW}❌ Failed to start PostgreSQL${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}🔧 Starting Backend (Spring Boot)...${NC}"
echo "   Port: 8080"
echo "   URL: http://localhost:8080"
echo ""

# Start backend in background
cd chatFlow
./mvnw spring-boot:run > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

echo -e "${GREEN}✅ Backend started (PID: $BACKEND_PID)${NC}"
echo "   Logs: backend.log"

# Wait for backend to start
echo ""
echo -e "${BLUE}⏳ Waiting for backend to be ready...${NC}"
for i in {1..30}; do
    if curl -s http://localhost:8080/api/auth/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Backend is ready!${NC}"
        break
    fi
    echo -n "."
    sleep 2
done

echo ""
echo ""
echo -e "${BLUE}🎨 Starting Frontend (React + Vite)...${NC}"
echo "   Port: 3000"
echo "   URL: http://localhost:3000"
echo ""

# Start frontend
npm start > frontend.log 2>&1 &
FRONTEND_PID=$!

echo -e "${GREEN}✅ Frontend started (PID: $FRONTEND_PID)${NC}"
echo "   Logs: frontend.log"

echo ""
echo "================================"
echo -e "${GREEN}🎉 ChatFlow is running!${NC}"
echo "================================"
echo ""
echo "📱 Frontend: http://localhost:3000"
echo "🔌 Backend:  http://localhost:8080"
echo "📊 API Docs: http://localhost:8080/api/auth/health"
echo ""
echo "🔑 Demo Credentials:"
echo "   admin@chatflow.com / password123"
echo "   user@chatflow.com / password123"
echo "   jane@chatflow.com / password123"
echo ""
echo "📝 Logs:"
echo "   Backend:  tail -f backend.log"
echo "   Frontend: tail -f frontend.log"
echo ""
echo "🛑 To stop:"
echo "   kill $BACKEND_PID $FRONTEND_PID"
echo "   Or press Ctrl+C"
echo ""

# Save PIDs to file for easy cleanup
echo "$BACKEND_PID" > .chatflow.pid
echo "$FRONTEND_PID" >> .chatflow.pid

# Wait for user interrupt
trap "echo ''; echo 'Stopping ChatFlow...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; rm -f .chatflow.pid; exit 0" INT

# Keep script running
wait
