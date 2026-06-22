import * as submissionRepo from '@/lib/repositories/submission.repository';
import * as activityLogRepo from '@/lib/repositories/activity-log.repository';
import { notifyAdminNewSubmission, notifyArtistSubmissionReceived, notifyArtistStatusChange } from '@/lib/email/mailer';
import { sanitizePlainText, sanitizeRichText } from '@/lib/security/sanitize';
import type { ArtistSubmissionInput } from '@/lib/validation/schemas';
import type { SubmissionStatus } from '@prisma/client';

export async function submitArtistApplication(data: ArtistSubmissionInput, ip: string) {
  const created = await submissionRepo.createSubmission({
    stageName: sanitizePlainText(data.stageName),
    legalName: sanitizePlainText(data.legalName),
    email: data.email.toLowerCase(),
    phone: data.phone || null,
    whatsapp: data.whatsapp || null,
    country: sanitizePlainText(data.country),
    city: data.city ? sanitizePlainText(data.city) : null,
    genre: sanitizePlainText(data.genre),
    songTitle: sanitizePlainText(data.songTitle),
    officialYoutubeUrl: data.officialYoutubeUrl || null,
    streamingLinks: data.streamingLinks || {},
    artistBio: data.artistBio ? sanitizeRichText(data.artistBio) : null,
    socialLinks: data.socialLinks || {},
    pressPhotoUrl: data.pressPhotoUrl || null,
    demoUploadUrl: data.demoUploadUrl || null,
    rightsOwnershipDeclared: data.rightsOwnershipDeclared,
    promotionalPermissionDeclared: data.promotionalPermissionDeclared,
    consentRecordedAt: new Date(),
    consentIp: ip,
    status: 'pending',
  });

  await Promise.allSettled([
    notifyAdminNewSubmission({
      stageName: data.stageName,
      songTitle: data.songTitle,
      email: data.email,
      genre: data.genre,
      country: data.country,
    }),
    notifyArtistSubmissionReceived(data.email, data.stageName),
    activityLogRepo.logActivity({
      action: 'submission.created',
      entityType: 'artist_submission',
      entityId: created.id,
      ipAddress: ip,
    }),
  ]);

  return created;
}

export async function changeSubmissionStatus(
  id: string,
  status: SubmissionStatus,
  adminNotes: string | undefined,
  reviewerId: string,
  reviewerEmail: string
) {
  const updated = await submissionRepo.updateSubmissionStatus(id, { status, adminNotes, reviewedById: reviewerId });

  await activityLogRepo.logActivity({
    actorId: reviewerId,
    actorEmail: reviewerEmail,
    action: 'submission.status_changed',
    entityType: 'artist_submission',
    entityId: id,
    metadata: { status },
  });

  if (['approved', 'rejected', 'published'].includes(status)) {
    await notifyArtistStatusChange(updated.email, updated.stageName, status).catch(() => {});
  }

  return updated;
}
