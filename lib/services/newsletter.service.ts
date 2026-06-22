import { randomBytes, randomUUID } from 'crypto';
import * as newsletterRepo from '@/lib/repositories/newsletter.repository';
import { sendEmail } from '@/lib/email/mailer';
import type { NewsletterInput } from '@/lib/validation/schemas';

export async function subscribeToNewsletter(data: NewsletterInput) {
  const confirmToken = randomBytes(24).toString('hex');
  const email = data.email.toLowerCase();

  await newsletterRepo.upsertSubscriber(email, {
    fullName: data.fullName || null,
    country: data.country || null,
    preferences: {
      news: true,
      top10: true,
      diaspora: true,
      events: true,
      ...(data.preferences || {}),
    },
    confirmToken,
    isConfirmed: false,
    unsubscribeToken: randomUUID(),
  });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const confirmUrl = `${siteUrl}/api/newsletter/confirm?token=${confirmToken}`;

  await sendEmail({
    to: email,
    subject: 'Confirm your Ghana Gold Radio subscription',
    html: `<p>Akwaaba! Please confirm your subscription by clicking <a href="${confirmUrl}">this link</a>.</p>`,
  }).catch((e) => console.error('confirm email failed', e));
}

export async function confirmNewsletterSubscription(token: string) {
  const result = await newsletterRepo.confirmSubscriberByToken(token);
  return result.count > 0;
}

export async function unsubscribeFromNewsletter(token: string) {
  const result = await newsletterRepo.unsubscribeByToken(token);
  return result.count > 0;
}
