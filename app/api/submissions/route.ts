import { NextRequest } from 'next/server';
import { artistSubmissionSchema, formatZodError } from '@/lib/validation/schemas';
import { checkRateLimit, getClientIp } from '@/lib/security/rate-limit';
import { verifyTurnstile } from '@/lib/security/turnstile';
import { jsonOk, jsonError } from '@/lib/utils/api-response';
import { submitArtistApplication } from '@/lib/services/submission.service';

export async function POST(req: NextRequest) {
  const ip = getClientIp(req.headers);

  const rate = await checkRateLimit('submissions', ip, { points: 5, durationSeconds: 600 });
  if (!rate.allowed) return jsonError('Too many submissions. Please try again later.', 429);

  const body = await req.json().catch(() => null);
  if (!body) return jsonError('Invalid request body.', 400);

  // Honeypot — if filled, silently report success to not tip off bots, but drop it.
  if (body.honeypot) return jsonOk({ id: null }, 201);

  const parsed = artistSubmissionSchema.safeParse(body);
  if (!parsed.success) return jsonError('Validation failed.', 422, formatZodError(parsed.error));

  const ok = await verifyTurnstile(parsed.data.turnstileToken, ip);
  if (!ok && process.env.NODE_ENV === 'production') {
    return jsonError('Spam verification failed.', 403);
  }

  try {
    const created = await submitArtistApplication(parsed.data, ip);
    return jsonOk({ id: created.id }, 201);
  } catch (err) {
    console.error('submission insert error', err);
    return jsonError('Failed to save submission.', 500);
  }
}
