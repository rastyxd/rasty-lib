#!/bin/bash

# Link-in-Bio Quick Setup Script

echo "🚀 Setting up Link-in-Bio project..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm found"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Copy environment files
if [ ! -f .dev.vars ]; then
    echo "📝 Creating .dev.vars file..."
    cp .dev.vars.example .dev.vars
    echo "⚠️  Please update .dev.vars with your Clerk keys"
else
    echo "✅ .dev.vars already exists"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Sign up for Clerk at https://clerk.com and get your API keys"
echo "2. Update .dev.vars with your Clerk keys"
echo "3. Run: npx wrangler d1 create link-in-bio-db"
echo "4. Update wrangler.toml with the database ID"
echo "5. Run: npm run db:generate"
echo "6. Run: npx wrangler d1 execute link-in-bio-db --local --file=./schema.sql"
echo "7. Run: npm run dev"
echo ""
echo "📚 See README.md for detailed instructions"
