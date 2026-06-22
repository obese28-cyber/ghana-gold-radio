/**
 * Cloudflare Turnstile verification (free CAPTCHA alternative).
 * Used as anti-spam protection on all public intake forms
 * (submissions, newsletter, contact, sponsor inquiries).
 */
export async function verifyTurnstile(token: string, remoteIp?: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    // Fail closed in production, but allow local dev without a configured key.
    return process.env.NODE_ENV !== 'production';
  }

  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: token, ...(remoteIp ? { remoteip: remoteIp } : {}) }),
    });
    const data = await res.json();
    return Boolean(data.success);
  } catch {
    return false;
  }
}
