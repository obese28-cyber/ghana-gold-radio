# Backup & Recovery

Run `scripts/backup/backup-db.sh` daily and `scripts/backup/backup-full-weekly.sh` weekly. Database dumps are compressed, checksummed, retained for 30 days by default, and can be copied off-site with `RCLONE_REMOTE`.

The full weekly archive includes the current database dump, `.env`, Compose configuration, and local uploads. Keep off-site copies encrypted.

To restore, run `scripts/backup/restore-db.sh <backup.sql.gz>` with `DATABASE_URL` set to the intended PostgreSQL instance. The script verifies its checksum and requires an explicit confirmation. Afterward run `npm run db:migrate`, check `/api/health`, and verify an admin login.
