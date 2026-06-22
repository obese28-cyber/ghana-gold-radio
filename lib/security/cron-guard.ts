import { NextRequest } from 'next/server';

/**
 * Validates the shared-secret bearer token sent by the host's cron scheduler
 * (cron job / systemd timer hitting these API routes via curl).
 * Set CRON_SECRET in the environment and pass it as:
 *   Authorization: Bearer <CRON_SECRET>
 */
export function isAuthorizedCronRequest(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const header = req.headers.get('authorization');
  return header === `Bearer ${secret}`;
}
