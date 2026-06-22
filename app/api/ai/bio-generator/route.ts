import { NextRequest } from 'next/server';
import { requireStaff } from '@/lib/auth/require-staff';
import { aiBioRequestSchema, formatZodError } from '@/lib/validation/schemas';
import { generateAiContent, buildBioPrompt } from '@/lib/ai';
import { jsonOk, jsonError } from '@/lib/utils/api-response';
import { checkRateLimit } from '@/lib/security/rate-limit';

/**
 * Drafts an artist bio. Output is NEVER auto-published — it is returned to the
 * admin AI Tools dashboard for review, and the caller is responsible for
 * persisting it with ai_review_status='draft' / bio_ai_generated=true.
 */
export async function POST(req: NextRequest) {
  const auth = await requireStaff(['admin', 'editor']);
  if (!auth.authorized) return jsonError('Unauthorized.', 401);

  const rate = await checkRateLimit('ai-tools', auth.user.id, { points: 30, durationSeconds: 3600 });
  if (!rate.allowed) return jsonError('AI rate limit exceeded. Try again later.', 429);

  const body = await req.json().catch(() => null);
  const parsed = aiBioRequestSchema.safeParse(body);
  if (!parsed.success) return jsonError('Validation failed.', 422, formatZodError(parsed.error));

  try {
    const result = await generateAiContent({ prompt: buildBioPrompt(parsed.data) });
    return jsonOk({ ...result, requiresApproval: true });
  } catch (err) {
    return jsonError(err instanceof Error ? err.message : 'AI generation failed.', 502);
  }
}
