#!/bin/bash

echo "🚀 Inventory Management System - Setup & Run Script"
echo "=================================================="
echo ""

# Check if .NET SDK is installed
if ! command -v dotnet &> /dev/null; then
    echo "❌ .NET SDK is not installed"
    echo ""
    echo "📥 Installing .NET SDK..."
    echo ""
    echo "Please install .NET 8 SDK from:"
    echo "https://dotnet.microsoft.com/download/dotnet/8.0"
    echo ""
    echo "For macOS, you can:"
    echo "1. Download the .pkg installer from the link above"
    echo "2. Or install Homebrew first, then run: brew install --cask dotnet-sdk"
    echo ""
    echo "After installation, restart your terminal and run this script again."
    exit 1
fi

echo "✅ .NET SDK found: $(dotnet --version)"
echo "✅ Node.js found: $(node --version)"
echo ""

# Check if frontend dependencies are installed
if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend
    npm install
    cd ..
fi

# Start backend
echo "🔧 Starting Backend API..."
cd src/IMS.API
dotnet restore
echo ""
echo "✅ Backend starting on http://localhost:5000"
echo "✅ Swagger UI: http://localhost:5000/swagger"
echo ""
dotnet run &
BACKEND_PID=$!
cd ../..

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "🎨 Starting Frontend..."
cd frontend
echo ""
echo "✅ Frontend starting on http://localhost:3000"
echo ""
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "=================================================="
echo "✅ Both services are starting!"
echo ""
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend:  http://localhost:5000"
echo "📚 Swagger:  http://localhost:5000/swagger"
echo ""
echo "🔐 Login Credentials:"
echo "   Email: admin@ims.com"
echo "   Password: admin123"
echo ""
echo "Press Ctrl+C to stop both services"
echo "=================================================="

# Wait for user interrupt
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM
wait
