#!/bin/bash
echo "🏋️ FitLife Setup Script"
echo "========================"

echo "📦 Installing server dependencies..."
cd server && npm install
echo "✅ Server dependencies installed"

cd ..
echo "📦 Installing client dependencies..."
cd client && npm install
echo "✅ Client dependencies installed"

cd ..
echo ""
echo "✅ Setup complete!"
echo ""
echo "👉 Next steps:"
echo "   1. Edit server/.env with your Gemini API key and MySQL credentials"
echo "   2. Create MySQL database: CREATE DATABASE fitlife_db;"
echo "   3. Run backend:  cd server && npm start"
echo "   4. Run frontend: cd client && npm start"
echo ""
echo "🌐 App will be available at http://localhost:3000"
