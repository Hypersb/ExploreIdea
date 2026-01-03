#!/bin/bash

# Explore Ida - Start Script
# This script starts the development environment

echo "🚀 Starting Explore Ida Development Environment..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if .env files exist
if [ ! -f backend/.env ]; then
    echo -e "${RED}❌ backend/.env not found!${NC}"
    echo "Copying from .env.example..."
    cp backend/.env.example backend/.env
    echo -e "${BLUE}⚠️  Please edit backend/.env with your API keys${NC}"
fi

if [ ! -f frontend/.env ]; then
    echo -e "${RED}❌ frontend/.env not found!${NC}"
    echo "Copying from .env.example..."
    cp frontend/.env.example frontend/.env
fi

# Check if MongoDB is running (optional)
if command -v mongod &> /dev/null; then
    if ! pgrep -x "mongod" > /dev/null; then
        echo -e "${BLUE}ℹ️  MongoDB not running. Starting MongoDB...${NC}"
        mongod --fork --logpath /var/log/mongodb.log --dbpath /var/lib/mongodb 2>/dev/null || echo "MongoDB start failed (optional)"
    else
        echo -e "${GREEN}✅ MongoDB is running${NC}"
    fi
fi

# Check if Redis is running (optional)
if command -v redis-server &> /dev/null; then
    if ! pgrep -x "redis-server" > /dev/null; then
        echo -e "${BLUE}ℹ️  Redis not running. Starting Redis...${NC}"
        redis-server --daemonize yes 2>/dev/null || echo "Redis start failed (optional)"
    else
        echo -e "${GREEN}✅ Redis is running${NC}"
    fi
fi

# Start backend
echo -e "${BLUE}🔧 Starting Backend...${NC}"
cd backend
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python -m venv venv
fi

source venv/bin/activate 2>/dev/null || . venv/Scripts/activate 2>/dev/null

echo "Installing backend dependencies..."
pip install -r requirements.txt > /dev/null 2>&1

echo -e "${GREEN}✅ Starting FastAPI server on http://localhost:8000${NC}"
uvicorn app.main:app --reload --port 8000 &
BACKEND_PID=$!

# Start frontend
cd ../frontend
echo -e "${BLUE}🎨 Starting Frontend...${NC}"

if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install > /dev/null 2>&1
fi

echo -e "${GREEN}✅ Starting React app on http://localhost:5173${NC}"
npm run dev &
FRONTEND_PID=$!

# Wait a bit for servers to start
sleep 3

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}🎉 Explore Ida is running!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "Frontend: ${BLUE}http://localhost:5173${NC}"
echo -e "Backend API: ${BLUE}http://localhost:8000${NC}"
echo -e "API Docs: ${BLUE}http://localhost:8000/docs${NC}"
echo ""
echo -e "Press ${RED}Ctrl+C${NC} to stop all servers"
echo ""

# Wait for interrupt
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT

wait
