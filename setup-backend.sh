#!/bin/bash

echo "🚀 Setting up Movie Recommendar Backend..."

# Navigate to backend directory
cd backend

echo "📦 Installing backend dependencies..."
npm install

echo "✅ Backend setup complete!"

echo ""
echo "🔧 Next steps:"
echo "1. Copy .env.example to .env and configure your environment variables"
echo "2. Make sure MongoDB is running on your system"
echo "3. Run 'npm run dev' to start the backend server"
echo ""
echo "📝 Required environment variables:"
echo "- MONGODB_URI (e.g., mongodb://localhost:27017/movie-recommendar)"
echo "- JWT_SECRET (your secret key for JWT tokens)"
echo "- GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET (for Google OAuth)"
echo "- FRONTEND_URL (e.g., http://localhost:3000)"
echo ""
echo "🎯 Backend will be available at: http://localhost:5000"
