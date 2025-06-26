#!/bin/bash
set -euo pipefail

if ! command -v node >/dev/null 2>&1; then
  echo "Installing Node.js..."
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
fi

# Ensure npm is available
if ! command -v npm >/dev/null 2>&1; then
  echo "npm is required but was not found" >&2
  exit 1
fi

npm ci --no-audit --prefer-offline

npm run lint || true
npm run check-types
npm run build
