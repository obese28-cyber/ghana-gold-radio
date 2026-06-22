#!/usr/bin/env bash
# ============================================================
# Ghana Gold Radio — Rollback script
# Reverts to the previous git commit and redeploys. For database
# rollbacks, use scripts/backup/restore-db.sh with the last known-good backup.
# ============================================================
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/ghana-gold-radio}"
cd "$APP_DIR"

PREVIOUS_COMMIT=$(git rev-parse HEAD~1)
echo "[INFO] Rolling back to commit: ${PREVIOUS_COMMIT}"

read -p "Confirm rollback to ${PREVIOUS_COMMIT}? (yes/no): " CONFIRM
if [ "$CONFIRM" != "yes" ]; then
  echo "Aborted."
  exit 1
fi

git checkout "$PREVIOUS_COMMIT"
docker compose build app
docker compose up -d --no-deps --build app

echo "[INFO] Rollback complete. Verify /api/health and application logs."
echo "[INFO] If a database rollback is also required, run scripts/backup/restore-db.sh <backup-file>."
