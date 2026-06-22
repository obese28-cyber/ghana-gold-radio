import { prisma } from '@/lib/prisma';
import type { Prisma, SubmissionStatus } from '@prisma/client';

export function createSubmission(data: Prisma.ArtistSubmissionCreateInput) {
  return prisma.artistSubmission.create({ data, select: { id: true } });
}

export function findSubmissionById(id: string) {
  return prisma.artistSubmission.findUnique({ where: { id } });
}

export function listSubmissionsForAdmin(status?: SubmissionStatus) {
  return prisma.artistSubmission.findMany({
    where: { deletedAt: null, status },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });
}

export function updateSubmissionStatus(
  id: string,
  data: { status: SubmissionStatus; adminNotes?: string; reviewedById: string }
) {
  return prisma.artistSubmission.update({
    where: { id },
    data: {
      status: data.status,
      adminNotes: data.adminNotes,
      reviewedById: data.reviewedById,
      reviewedAt: new Date(),
    },
    select: { id: true, email: true, stageName: true, status: true },
  });
}

export function countPendingSubmissions() {
  return prisma.artistSubmission.count({ where: { status: 'pending', deletedAt: null } });
}
