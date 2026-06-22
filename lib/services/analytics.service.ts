import * as submissionRepo from '@/lib/repositories/submission.repository';
import * as artistRepo from '@/lib/repositories/artist.repository';
import * as newsletterRepo from '@/lib/repositories/newsletter.repository';
import * as postRepo from '@/lib/repositories/post.repository';
import { prisma } from '@/lib/prisma';

export async function getAdminDashboardStats() {
  const [pendingSubmissions, totalArtists, activeSubscribers, pendingAiDrafts] = await Promise.all([
    submissionRepo.countPendingSubmissions(),
    artistRepo.countArtists(),
    newsletterRepo.countActiveSubscribers(),
    postRepo.countDraftAiPosts(),
  ]);

  return { pendingSubmissions, totalArtists, activeSubscribers, pendingAiDrafts };
}

export async function getMonthlyAnalyticsSnapshot(since: Date) {
  const [newSubmissions, newArtists, newSubscribers] = await Promise.all([
    prisma.artistSubmission.count({ where: { createdAt: { gte: since } } }),
    prisma.artist.count({ where: { createdAt: { gte: since } } }),
    prisma.newsletterSubscriber.count({ where: { createdAt: { gte: since } } }),
  ]);

  return { newSubmissions, newArtists, newSubscribers };
}
