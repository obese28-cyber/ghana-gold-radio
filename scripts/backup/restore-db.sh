#!/usr/bin/env bash
# ============================================================
# Ghana Gold Radio — Database restore
# Usage: ./restore-db.sh /var/backups/ghana-gold-radio/ggr-db-20260101-020000.sql.gz
# WARNING: this overwrites the target database. Confirm DATABASE_URL
# points to the intended instance before running.
# ============================================================
set -euo pipefail

if [ -z "${1:-}" ]; then
  echo "Usage: $0 <path-to-backup.sql.gz>" >&2
  exit 1
fi

BACKUP_FILE="$1"

if [ ! -f "$BACKUP_FILE" ]; then
  echo "[ERROR] Backup file not found: ${BACKUP_FILE}" >&2
  exit 1
fi

if [ -f "${BACKUP_FILE}.sha256" ]; then
  echo "[INFO] Verifying checksum..."
  (cd "$(dirname "$BACKUP_FILE")" && sha256sum -c "$(basename "$BACKUP_FILE").sha256")
fi

if [ -z "${DATABASE_URL:-}" ]; then
  echo "[ERROR] DATABASE_URL is not set." >&2
  exit 1
fi

read -p "This will OVERWRITE the database at the configured DATABASE_URL. Type 'yes' to continue: " CONFIRM
if [ "$CONFIRM" != "yes" ]; then
  echo "Aborted."
  exit 1
fi

echo "[INFO] Restoring from ${BACKUP_FILE}..."
gunzip -c "$BACKUP_FILE" | psql "$DATABASE_URL"
echo "[INFO] Restore complete. Verify the app and run a health check at /api/health."
