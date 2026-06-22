import { randomBytes, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';

const CSRF_COOKIE = 'ggr_csrf';

/** Issues a CSRF token and sets it as a secure, httpOnly-false cookie (double-submit pattern). */
export function issueCsrfToken(): string {
  const token = randomBytes(32).toString('hex');
  cookies().set(CSRF_COOKIE, token, {
    httpOnly: false, // must be readable by client JS to echo back in a header
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 2,
  });
  return token;
}

/** Validates a submitted CSRF header against the cookie value (double-submit cookie pattern). */
export function validateCsrfToken(headerToken: string | null): boolean {
  const cookieToken = cookies().get(CSRF_COOKIE)?.value;
  if (!headerToken || !cookieToken) return false;
  const a = Buffer.from(headerToken);
  const b = Buffer.from(cookieToken);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export const CSRF_HEADER_NAME = 'x-csrf-token';
export const CSRF_COOKIE_NAME = CSRF_COOKIE;
