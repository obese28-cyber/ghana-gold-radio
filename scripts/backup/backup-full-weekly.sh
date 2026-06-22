#!/usr/bin/env bash
# ============================================================
# Ghana Gold Radio — Weekly full backup
# Archives the DB dump (via backup-db.sh) plus any locally-stored
# uploads and configuration into a single tarball.
# Cron: 0 3 * * 0 /opt/ghana-gold-radio/scripts/backup/backup-full-weekly.sh
# ============================================================
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/ghana-gold-radio}"
BACKUP_DIR="${BACKUP_DIR:-/var/backups/ghana-gold-radio}"
RETENTION_WEEKS="${RETENTION_WEEKS:-8}"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
ARCHIVE="${BACKUP_DIR}/ggr-full-${TIMESTAMP}.tar.gz"

mkdir -p "$BACKUP_DIR"

# Ensure today's DB dump exists
"$(dirname "$0")/backup-db.sh"

echo "[INFO] Creating full weekly archive: ${ARCHIVE}"
tar -czf "$ARCHIVE" \
  -C "$BACKUP_DIR" $(ls "$BACKUP_DIR" | grep "ggr-db-$(date +%Y%m%d)" || true) \
  -C "$APP_DIR" .env docker-compose.yml public/uploads 2>/dev/null || true

find "$BACKUP_DIR" -name 'ggr-full-*.tar.gz' -mtime "+$((RETENTION_WEEKS * 7))" -delete

echo "[INFO] Weekly full backup complete: ${ARCHIVE}"
