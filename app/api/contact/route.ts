import { NextRequest } from 'next/server';
import { contactSchema, formatZodError } from '@/lib/validation/schemas';
import { checkRateLimit, getClientIp } from '@/lib/security/rate-limit';
import { verifyTurnstile } from '@/lib/security/turnstile';
import { jsonOk, jsonError } from '@/lib/utils/api-response';
import { submitContactMessage } from '@/lib/services/contact.service';

export async function POST(req: NextRequest) {
  const ip = getClientIp(req.headers);
  const rate = await checkRateLimit('contact', ip, { points: 8, durationSeconds: 600 });
  if (!rate.allowed) return jsonError('Too many requests. Please try again later.', 429);

  const body = await req.json().catch(() => null);
  if (!body) return jsonError('Invalid request body.', 400);
  if (body.honeypot) return jsonOk({ sent: true }, 201);

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) return jsonError('Validation failed.', 422, formatZodError(parsed.error));

  const ok = await verifyTurnstile(parsed.data.turnstileToken, ip);
  if (!ok && process.env.NODE_ENV === 'production') return jsonError('Spam verification failed.', 403);

  try {
    await submitContactMessage(parsed.data);
    return jsonOk({ sent: true }, 201);
  } catch (err) {
    console.error('contact submit error', err);
    return jsonError('Failed to send message.', 500);
  }
}
