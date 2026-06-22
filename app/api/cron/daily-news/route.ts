import { NextRequest } from 'next/server';
import { isAuthorizedCronRequest } from '@/lib/security/cron-guard';
import { jsonOk, jsonError } from '@/lib/utils/api-response';
import { logActivity } from '@/lib/repositories/activity-log.repository';

/**
 * Daily job: News draft generation.
 * In production, wire this to your news-source ingestion (RSS/API) and call
 * generateAiContent(buildNewsSummaryPrompt(...)) per source item, then insert
 * a Post row via lib/repositories/post.repository.ts with status='draft' and
 * aiReviewStatus='draft'. This stub records a run log entry so cron health
 * is observable end-to-end.
 */
export async function POST(req: NextRequest) {
  if (!isAuthorizedCronRequest(req)) return jsonError('Unauthorized.', 401);

  await logActivity({
    actorEmail: 'cron@ghanagoldradio.com',
    action: 'cron.daily_news_draft',
    entityType: 'system',
    metadata: { ranAt: new Date().toISOString() },
  });

  return jsonOk({ ran: 'daily-news', status: 'ok' });
}
