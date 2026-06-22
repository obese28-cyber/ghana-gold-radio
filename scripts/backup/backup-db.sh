#!/usr/bin/env bash
# ============================================================
# Ghana Gold Radio — Daily database backup
# Dumps the self-hosted PostgreSQL database via DATABASE_URL, compresses, checksums,
# uploads to off-site storage (rclone target configurable), prunes
# old backups per retention policy, and pings the cron-verify endpoint.
#
# Usage: ./backup-db.sh
# Cron:  0 2 * * * /opt/ghana-gold-radio/scripts/backup/backup-db.sh >> /var/log/ggr-backup.log 2>&1
# ============================================================
set -euo pipefail

BACKUP_DIR="${BACKUP_DIR:-/var/backups/ghana-gold-radio}"
RETENTION_DAYS="${RETENTION_DAYS:-30}"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
FILENAME="ggr-db-${TIMESTAMP}.sql.gz"
FILEPATH="${BACKUP_DIR}/${FILENAME}"
SITE_URL="${NEXT_PUBLIC_SITE_URL:-https://ghanagoldradio.com}"

mkdir -p "$BACKUP_DIR"

if [ -z "${DATABASE_URL:-}" ]; then
  echo "[ERROR] DATABASE_URL is not set." >&2
  exit 1
fi

echo "[INFO] Starting backup at ${TIMESTAMP}"
pg_dump "$DATABASE_URL" --no-owner --no-privileges | gzip -9 > "$FILEPATH"

CHECKSUM=$(sha256sum "$FILEPATH" | awk '{print $1}')
echo "${CHECKSUM}  ${FILENAME}" > "${FILEPATH}.sha256"
echo "[INFO] Backup written: ${FILEPATH} (sha256: ${CHECKSUM})"

# Optional: sync to off-site storage (configure your own rclone remote)
if command -v rclone >/dev/null 2>&1 && [ -n "${RCLONE_REMOTE:-}" ]; then
  rclone copy "$FILEPATH" "${RCLONE_REMOTE}/" --quiet
  rclone copy "${FILEPATH}.sha256" "${RCLONE_REMOTE}/" --quiet
  echo "[INFO] Synced to remote: ${RCLONE_REMOTE}"
fi

# Prune backups older than retention window
find "$BACKUP_DIR" -name 'ggr-db-*.sql.gz*' -mtime "+${RETENTION_DAYS}" -delete
echo "[INFO] Pruned backups older than ${RETENTION_DAYS} days"

# Notify the app so the run is visible in activity_logs / alerting
if [ -n "${CRON_SECRET:-}" ]; then
  curl -fsS -X POST "${SITE_URL}/api/cron/backup-verify" \
    -H "Authorization: Bearer ${CRON_SECRET}" \
    -H "Content-Type: application/json" \
    -d "{\"file\":\"${FILENAME}\",\"checksum\":\"${CHECKSUM}\"}" \
    || echo "[WARN] Failed to ping backup-verify endpoint"
fi

echo "[INFO] Backup complete."
