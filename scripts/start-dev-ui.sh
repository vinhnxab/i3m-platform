#!/bin/bash

# Start UI development server directly
set -e

echo "🚀 Starting UI development server..."

# Navigate to UI directory
cd /home/vinhnx/i3m-platform/ui/master-dashboard

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Set environment variables
export NODE_ENV=development
export VITE_API_BASE_URL=http://localhost:8080

echo "🔗 Starting development server..."
echo "📱 Access your app at: http://localhost:5173"
echo "🔌 API Gateway should be running at: http://localhost:8080"
echo ""
echo "💡 Features:"
echo "   - Hot reload enabled"
echo "   - File watching enabled"
echo "   - No Kubernetes needed!"
echo ""

# Start development server
npm run dev -- --host 0.0.0.0
