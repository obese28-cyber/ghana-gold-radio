import { NextRequest } from 'next/server';
import { isAuthorizedCronRequest } from '@/lib/security/cron-guard';
import { jsonOk, jsonError } from '@/lib/utils/api-response';
import { prisma } from '@/lib/prisma';
import { logActivity } from '@/lib/repositories/activity-log.repository';

/**
 * Weekly job: Newsletter draft.
 * Gathers the latest published chart + news + diaspora posts as raw
 * "highlights" input for the AI newsletter generator tool, and logs that a
 * draft is ready for an editor to generate and approve in /admin/ai-tools.
 */
export async function POST(req: NextRequest) {
  if (!isAuthorizedCronRequest(req)) return jsonError('Unauthorized.', 401);

  const since = new Date();
  since.setDate(since.getDate() - 7);

  const posts = await prisma.post.findMany({
    where: { status: 'published', publishedAt: { gte: since } },
    select: { title: true, postType: true },
    take: 20,
  });

  await logActivity({
    actorEmail: 'cron@ghanagoldradio.com',
    action: 'cron.newsletter_draft_ready',
    entityType: 'system',
    metadata: { highlightCount: posts.length },
  });

  return jsonOk({ ran: 'newsletter-draft', status: 'ok', highlights: posts });
}
