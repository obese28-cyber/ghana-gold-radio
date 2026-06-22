import { prisma } from '@/lib/prisma';
import { jsonOk, jsonError } from '@/lib/utils/api-response';

/**
 * Health check endpoint for uptime monitoring (UptimeRobot, Cloudflare Health
 * Checks, etc.) and Docker HEALTHCHECK. Verifies the app is up and can reach
 * the local PostgreSQL database via Prisma.
 */
export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return jsonOk({ status: 'ok', time: new Date().toISOString() });
  } catch (err) {
    return jsonError('Health check failed.', 503, err instanceof Error ? err.message : 'unknown');
  }
}
