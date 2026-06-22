import { NextRequest } from 'next/server';
import { isAuthorizedCronRequest } from '@/lib/security/cron-guard';
import { jsonOk, jsonError } from '@/lib/utils/api-response';
import { logActivity } from '@/lib/repositories/activity-log.repository';

/**
 * Daily job: Backup verification.
 * The actual backup is taken by scripts/backup/backup-db.sh (see docs/BACKUP.md).
 * This endpoint is pinged by that script after a successful backup+checksum,
 * so failures are visible in activity_logs / alerting rather than silent.
 */
export async function POST(req: NextRequest) {
  if (!isAuthorizedCronRequest(req)) return jsonError('Unauthorized.', 401);

  const body = await req.json().catch(() => ({}));

  await logActivity({
    actorEmail: 'cron@ghanagoldradio.com',
    action: 'cron.backup_verify',
    entityType: 'system',
    metadata: { ranAt: new Date().toISOString(), ...body },
  });

  return jsonOk({ ran: 'backup-verify', status: 'ok' });
}
