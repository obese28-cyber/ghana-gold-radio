import { NextRequest } from 'next/server';
import { isAuthorizedCronRequest } from '@/lib/security/cron-guard';
import { jsonOk, jsonError } from '@/lib/utils/api-response';
import { sendEmail } from '@/lib/email/mailer';
import { getMonthlyAnalyticsSnapshot } from '@/lib/services/analytics.service';

/**
 * Monthly job: Analytics report.
 * Compiles basic counts from Postgres (submission volume, new artists,
 * newsletter growth) and emails a summary to admins. Pair with Plausible's
 * own dashboard/API for traffic metrics.
 */
export async function POST(req: NextRequest) {
  if (!isAuthorizedCronRequest(req)) return jsonError('Unauthorized.', 401);

  const since = new Date();
  since.setMonth(since.getMonth() - 1);

  const { newSubmissions, newArtists, newSubscribers } = await getMonthlyAnalyticsSnapshot(since);

  const adminEmail = process.env.EMAIL_ADMIN_NOTIFY;
  if (adminEmail) {
    await sendEmail({
      to: adminEmail,
      subject: 'Ghana Gold Radio — Monthly Analytics Report',
      html: `
        <h2>Monthly Report</h2>
        <p>New submissions: ${newSubmissions}</p>
        <p>New artists: ${newArtists}</p>
        <p>New newsletter subscribers: ${newSubscribers}</p>
      `,
    }).catch((e) => console.error('analytics report email failed', e));
  }

  return jsonOk({ ran: 'analytics-report', status: 'ok' });
}
