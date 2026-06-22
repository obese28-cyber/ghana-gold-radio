import { RateLimiterMemory } from 'rate-limiter-flexible';

/**
 * In-memory rate limiter, suitable for a single-instance Hetzner VPS deployment.
 * If scaling to multiple app instances, swap RateLimiterMemory for
 * RateLimiterRedis backed by a shared Redis instance.
 */
const windowSeconds = Number(process.env.RATE_LIMIT_WINDOW_SECONDS || 60);
const maxRequests = Number(process.env.RATE_LIMIT_MAX_REQUESTS || 20);

const limiters = new Map<string, RateLimiterMemory>();

function getLimiter(bucket: string, points: number, duration: number) {
  const key = `${bucket}:${points}:${duration}`;
  if (!limiters.has(key)) {
    limiters.set(key, new RateLimiterMemory({ points, duration }));
  }
  return limiters.get(key)!;
}

export interface RateLimitResult {
  allowed: boolean;
  remainingPoints?: number;
  msBeforeNext?: number;
}

/**
 * Consume one point from the named bucket for the given identifier (IP, email, etc).
 * Use a distinct `bucket` per route (e.g. 'submissions', 'newsletter', 'contact', 'ai-tools').
 */
export async function checkRateLimit(
  bucket: string,
  identifier: string,
  opts: { points?: number; durationSeconds?: number } = {}
): Promise<RateLimitResult> {
  const limiter = getLimiter(bucket, opts.points ?? maxRequests, opts.durationSeconds ?? windowSeconds);
  try {
    const res = await limiter.consume(identifier);
    return { allowed: true, remainingPoints: res.remainingPoints, msBeforeNext: res.msBeforeNext };
  } catch (rejected: any) {
    return { allowed: false, remainingPoints: 0, msBeforeNext: rejected?.msBeforeNext };
  }
}

/** Extracts a best-effort client IP from a Next.js Request, honoring Cloudflare headers. */
export function getClientIp(headers: Headers): string {
  return (
    headers.get('cf-connecting-ip') ||
    headers.get('x-real-ip') ||
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown'
  );
}
