import * as sponsorRepo from '@/lib/repositories/sponsor.repository';
import { sendEmail } from '@/lib/email/mailer';
import { sanitizePlainText, sanitizeRichText } from '@/lib/security/sanitize';
import type { SponsorInquiryInput } from '@/lib/validation/schemas';

export async function submitSponsorInquiry(data: SponsorInquiryInput) {
  await sponsorRepo.createSponsorInquiry({
    companyName: sanitizePlainText(data.companyName),
    contactName: sanitizePlainText(data.contactName),
    email: data.email.toLowerCase(),
    phone: data.phone || null,
    packageInterest: data.packageInterest || null,
    budgetRange: data.budgetRange || null,
    message: data.message ? sanitizeRichText(data.message) : null,
    status: 'new',
  });

  const adminEmail = process.env.EMAIL_ADMIN_NOTIFY;
  if (adminEmail) {
    await sendEmail({
      to: adminEmail,
      subject: `New sponsor inquiry: ${data.companyName}`,
      html: `<p><strong>Company:</strong> ${data.companyName}</p><p><strong>Contact:</strong> ${data.contactName} (${data.email})</p><p>${data.message ?? ''}</p>`,
      replyTo: data.email,
    }).catch((e) => console.error('sponsor notify failed', e));
  }
}
