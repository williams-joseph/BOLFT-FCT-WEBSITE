#!/bin/bash

# Navigate to the admin-web directory
cd "$(dirname "$0")/admin-web" || exit

echo "=========================================="
echo "   BOLFT WEB ADMIN - CLEAN & RUN SCRIPT   "
echo "=========================================="

# 1. Stop any process running on port 3001
echo "[1/4] Checking for processes on port 3001..."
PID=$(lsof -ti:3001)
if [ -n "$PID" ]; then
  echo "      Killing process $PID on port 3001..."
  kill -9 $PID
else
  echo "      Port 3001 is free."
fi

# 2. Clean build artifacts and cache
echo "[2/4] Cleaning build artifacts and cache..."
rm -rf dist
rm -rf .angular
# rm -rf node_modules # Uncomment if a full dependency reset is needed

# 3. Ensure dependencies are installed (optional but good for 'clean' build)
echo "[3/4] Checking dependencies..."
if [ ! -d "node_modules" ]; then
    echo "      Installing dependencies..."
    npm install
fi

# 4. Run the application on port 3001
echo "[4/4] Starting Admin Web on port 3001..."
echo "      Local:   http://localhost:3001"
echo "      Network: http://192.168.0.145:3001"
echo "=========================================="

# Use --host 0.0.0.0 to allow external access
npm run dev -- --port 3001 --host 0.0.0.0
