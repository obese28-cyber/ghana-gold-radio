#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/ghana-gold-radio}"
cd "$APP_DIR"

git pull origin main
docker compose build app
docker compose up -d postgres
docker compose run --rm app npx prisma migrate deploy
docker compose run --rm app npm run db:seed
docker compose up -d --no-deps app nginx

for i in $(seq 1 10); do
  if curl -fsS http://localhost:3000/api/health >/dev/null 2>&1; then
    echo "Application is healthy."
    exit 0
  fi
  sleep 3
done

echo "Application health check failed." >&2
exit 1
