#!/bin/bash

# BOLFT-FCT Multi-site Deployment Script
# This script builds both main-web and admin-web and deploys them to Firebase.

set -e # Exit on error

echo "----------------------------------------------------"
echo "🚀 Starting BOLFT-FCT Deployment Process"
echo "----------------------------------------------------"

# 1. Build Main Web
echo "📦 Building Main Web Application..."
cd main-web
npm run build
cd ..

# 2. Build Admin Web
echo "📦 Building Admin Web Application..."
cd admin-web
npm run build
cd ..

# 3. Deploy to Firebase (Hosting & Firestore Rules)
echo "🔥 Deploying to Firebase..."
firebase deploy

echo "----------------------------------------------------"
echo "✅ Deployment Complete!"
echo "Main:  https://bolftfct-church.web.app"
echo "Admin: https://bolftfct-admin.web.app"
echo "----------------------------------------------------"
