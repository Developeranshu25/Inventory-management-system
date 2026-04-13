#!/bin/bash
echo "🔧 Starting Backend API..."
cd "$(dirname "$0")/src/IMS.API"
if ! command -v dotnet &> /dev/null; then
    echo "❌ .NET SDK not found!"
    echo "Please install .NET 8 SDK from: https://dotnet.microsoft.com/download/dotnet/8.0"
    exit 1
fi
echo "✅ .NET SDK: $(dotnet --version)"
dotnet restore
echo ""
echo "🚀 Starting backend on http://localhost:5050"
echo "📚 Swagger UI: http://localhost:5050/swagger"
echo ""
# Fix for macOS FileSystemWatcher stack overflow
export DOTNET_USE_POLLING_FILE_WATCHER=1
dotnet run
