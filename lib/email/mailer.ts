import nodemailer from 'nodemailer';

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (transporter) return transporter;
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  return transporter;
}

export interface SendEmailInput {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

export async function sendEmail({ to, subject, html, text, replyTo }: SendEmailInput) {
  const from = process.env.EMAIL_FROM || 'Ghana Gold Radio <no-reply@ghanagoldradio.com>';
  return getTransporter().sendMail({ from, to, subject, html, text, replyTo });
}

export async function notifyAdminNewSubmission(submission: {
  stageName: string;
  songTitle: string;
  email: string;
  genre: string;
  country: string;
}) {
  const adminEmail = process.env.EMAIL_ADMIN_NOTIFY;
  if (!adminEmail) return;
  await sendEmail({
    to: adminEmail,
    subject: `New artist submission: ${submission.stageName} — "${submission.songTitle}"`,
    html: `
      <h2>New Artist Submission</h2>
      <p><strong>Stage name:</strong> ${submission.stageName}</p>
      <p><strong>Song title:</strong> ${submission.songTitle}</p>
      <p><strong>Genre:</strong> ${submission.genre}</p>
      <p><strong>Country:</strong> ${submission.country}</p>
      <p><strong>Email:</strong> ${submission.email}</p>
      <p>Review it in the <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/submissions">admin dashboard</a>.</p>
    `,
  });
}

export async function notifyArtistSubmissionReceived(to: string, stageName: string) {
  await sendEmail({
    to,
    subject: 'We received your submission — Ghana Gold Radio',
    html: `
      <h2>Akwaaba, ${stageName}! 🎶</h2>
      <p>Thank you for submitting your music to Ghana Gold Radio. Our team will review your submission and reach out with next steps.</p>
      <p><em>The Sound of Home, Anywhere in the World.</em></p>
      <p>— The Ghana Gold Radio Team</p>
    `,
  });
}

export async function notifyArtistStatusChange(to: string, stageName: string, status: string) {
  const statusMessages: Record<string, string> = {
    approved: 'Great news — your submission has been approved!',
    rejected: "Thank you for your submission. After review, we're unable to feature it at this time.",
    published: 'Your music is now live on Ghana Gold Radio!',
  };
  await sendEmail({
    to,
    subject: `Update on your Ghana Gold Radio submission`,
    html: `
      <h2>Hi ${stageName},</h2>
      <p>${statusMessages[status] || `Your submission status has been updated to: ${status}.`}</p>
      <p>— The Ghana Gold Radio Team</p>
    `,
  });
}
