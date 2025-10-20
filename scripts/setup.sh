#!/bin/bash

# Setup script for Hackathon Review System

echo "🚀 Setting up Hackathon Review System..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "⚙️ Creating .env file..."
    cat > .env << EOF
# API Configuration
REACT_APP_API_URL=http://localhost:3001

# Optional: Enable debug mode
REACT_APP_DEBUG=false
EOF
    echo "✅ .env file created"
else
    echo "✅ .env file already exists"
fi

echo "🎉 Setup complete!"
echo ""
echo "To start the development server, run:"
echo "  npm start"
echo ""
echo "To build for production, run:"
echo "  npm run build"
echo ""
echo "To run tests, run:"
echo "  npm test"
