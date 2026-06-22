import { NextRequest } from 'next/server';
import { isAuthorizedCronRequest } from '@/lib/security/cron-guard';
import { jsonOk, jsonError } from '@/lib/utils/api-response';
import { createChart } from '@/lib/repositories/chart.repository';
import { logActivity } from '@/lib/repositories/activity-log.repository';

/**
 * Weekly job: Top 10 draft generation.
 * Creates an empty draft chart row for the upcoming week (isPublished=false)
 * so editors only need to fill in rankings + run the AI commentary tool.
 */
export async function POST(req: NextRequest) {
  if (!isAuthorizedCronRequest(req)) return jsonError('Unauthorized.', 401);

  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setUTCDate(now.getUTCDate() - now.getUTCDay() + 1); // Monday
  const weekEnd = new Date(weekStart);
  weekEnd.setUTCDate(weekStart.getUTCDate() + 6);

  try {
    await createChart({ weekStartDate: weekStart, weekEndDate: weekEnd, title: 'Top 10 Ghana Songs' });
  } catch (err: any) {
    // Ignore unique-constraint conflicts (chart for this week already exists)
    if (err?.code !== 'P2002') console.error('weekly-top10 cron error', err);
  }

  await logActivity({
    actorEmail: 'cron@ghanagoldradio.com',
    action: 'cron.weekly_top10_draft',
    entityType: 'system',
    metadata: { weekStart: weekStart.toISOString() },
  });

  return jsonOk({ ran: 'weekly-top10', status: 'ok' });
}
