#!/bin/bash

# 🚀 Quick Deployment Script for Explore Ida

echo "🚀 Deploying Explore Ida..."
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "❌ Git not initialized. Run: git init"
    exit 1
fi

# Check for uncommitted changes
if [[ -n $(git status -s) ]]; then
    echo "📝 You have uncommitted changes. Committing..."
    git add .
    read -p "Enter commit message: " commit_msg
    git commit -m "$commit_msg"
fi

# Check if remote exists
if ! git remote | grep -q 'origin'; then
    echo "❌ No git remote 'origin' found."
    echo "   Add your repository: git remote add origin <your-repo-url>"
    exit 1
fi

# Push to GitHub
echo "📤 Pushing to GitHub..."
git push origin main

echo ""
echo "✅ Code pushed to GitHub!"
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Deploy Backend to Render:"
echo "   → Visit: https://render.com"
echo "   → New Web Service → Connect your repo"
echo "   → Root directory: backend"
echo "   → Add environment variables (see DEPLOYMENT.md)"
echo ""
echo "2. Deploy Frontend to Vercel:"
echo "   → Visit: https://vercel.com"
echo "   → Import your repo"
echo "   → Root directory: frontend"
echo "   → Add VITE_API_BASE_URL env var"
echo ""
echo "📚 Full instructions: See DEPLOYMENT.md"
echo ""
echo "🎉 Happy deploying!"
