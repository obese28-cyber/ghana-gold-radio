import { NextRequest } from 'next/server';
import { isAuthorizedCronRequest } from '@/lib/security/cron-guard';
import { jsonOk, jsonError } from '@/lib/utils/api-response';
import { pruneActivityLogsBefore, logActivity } from '@/lib/repositories/activity-log.repository';

/**
 * Monthly job: Database optimization.
 * Prunes old activity_logs. Postgres autovacuum already handles routine
 * VACUUM/ANALYZE on the Docker-hosted database; trigger a manual `VACUUM`
 * from psql if ever needed (see docs/DATABASE.md).
 */
export async function POST(req: NextRequest) {
  if (!isAuthorizedCronRequest(req)) return jsonError('Unauthorized.', 401);

  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - 6);

  try {
    await pruneActivityLogsBefore(cutoff);
  } catch (err) {
    console.error('monthly-optimize prune error', err);
  }

  await logActivity({
    actorEmail: 'cron@ghanagoldradio.com',
    action: 'cron.monthly_optimize',
    entityType: 'system',
    metadata: { prunedBefore: cutoff.toISOString() },
  });

  return jsonOk({ ran: 'monthly-optimize', status: 'ok' });
}
