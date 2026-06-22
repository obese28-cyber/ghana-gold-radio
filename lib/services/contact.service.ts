import * as contactRepo from '@/lib/repositories/contact.repository';
import { sendEmail } from '@/lib/email/mailer';
import { sanitizePlainText, sanitizeRichText } from '@/lib/security/sanitize';
import type { ContactInput } from '@/lib/validation/schemas';

export async function submitContactMessage(data: ContactInput) {
  await contactRepo.createContactMessage({
    name: sanitizePlainText(data.name),
    email: data.email.toLowerCase(),
    category: data.category,
    subject: data.subject ? sanitizePlainText(data.subject) : null,
    message: sanitizeRichText(data.message),
  });

  const adminEmail = process.env.EMAIL_ADMIN_NOTIFY;
  if (adminEmail) {
    await sendEmail({
      to: adminEmail,
      subject: `New contact message: ${data.category}`,
      html: `<p><strong>From:</strong> ${data.name} (${data.email})</p><p>${data.message}</p>`,
      replyTo: data.email,
    }).catch((e) => console.error('contact notify failed', e));
  }
}
