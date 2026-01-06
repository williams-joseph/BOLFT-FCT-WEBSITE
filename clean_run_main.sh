#!/bin/bash

# Navigate to the main-web directory
cd "$(dirname "$0")/main-web" || exit

echo "=========================================="
echo "    BOLFT MAIN WEB - CLEAN & RUN SCRIPT   "
echo "=========================================="

# 1. Stop any process running on port 3002
echo "[1/4] Checking for processes on port 3002..."
PID=$(lsof -ti:3002)
if [ -n "$PID" ]; then
  echo "      Killing process $PID on port 3002..."
  kill -9 $PID
else
  echo "      Port 3002 is free."
fi

# 2. Clean build artifacts and cache
echo "[2/4] Cleaning build artifacts and cache..."
rm -rf dist
rm -rf .angular
# rm -rf node_modules # Uncomment if a full dependency reset is needed

# 3. Ensure dependencies are installed
echo "[3/4] Checking dependencies..."
if [ ! -d "node_modules" ]; then
    echo "      Installing dependencies..."
    npm install
fi

# 4. Run the application on port 3002
echo "[4/4] Starting Main Web on port 3002..."
echo "      Local:   http://localhost:3002"
echo "      Network: http://192.168.0.145:3002"
echo "=========================================="

npm run dev -- --port 3002 --host 0.0.0.0
