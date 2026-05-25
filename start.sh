#!/bin/bash

echo ""
echo "============================================"
echo "  💊  MedRemind - Smart Prescription Manager"
echo "============================================"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found! Please install from https://nodejs.org"
    exit 1
fi

# Install dependencies if needed
if [ ! -d "backend/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd backend && npm install && cd ..
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend && npm install && cd ..
fi

echo "🚀 Starting backend on http://localhost:5000"
cd backend && npm run dev &
BACKEND_PID=$!

sleep 2

echo "🌐 Starting frontend on http://localhost:5173"
cd ../frontend && npm run dev &
FRONTEND_PID=$!

sleep 4
echo ""
echo "✅ MedRemind is running!"
echo "📱 Open: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop both servers"

# Open browser
if [[ "$OSTYPE" == "darwin"* ]]; then
    open http://localhost:5173
else
    xdg-open http://localhost:5173 2>/dev/null
fi

wait $BACKEND_PID $FRONTEND_PID
