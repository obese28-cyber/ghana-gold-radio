import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

export function createSponsorInquiry(data: Prisma.SponsorInquiryCreateInput) {
  return prisma.sponsorInquiry.create({ data, select: { id: true } });
}

export function listSponsorInquiriesForAdmin() {
  return prisma.sponsorInquiry.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });
}

export function findActiveSponsors() {
  return prisma.sponsor.findMany({ where: { isActive: true, deletedAt: null } });
}
