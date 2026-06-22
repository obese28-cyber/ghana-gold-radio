import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

export function findManyArtists(args: {
  query?: string;
  genre?: string;
  limit?: number;
}) {
  const where: Prisma.ArtistWhereInput = { deletedAt: null };
  if (args.query) where.stageName = { contains: args.query, mode: 'insensitive' };
  if (args.genre) where.genres = { has: args.genre };

  return prisma.artist.findMany({
    where,
    orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
    take: args.limit ?? 100,
  });
}

export function findArtistBySlug(slug: string) {
  return prisma.artist.findFirst({
    where: { slug, deletedAt: null },
    include: { songs: { where: { deletedAt: null, isActive: true } } },
  });
}

export function findArtistById(id: string) {
  return prisma.artist.findUnique({ where: { id } });
}

export function findFeaturedArtist() {
  return prisma.artist.findFirst({
    where: { isFeatured: true, deletedAt: null },
  });
}

export function findFeaturedArtistCandidates() {
  return prisma.artist.findMany({
    where: { verified: true, isFeatured: false, deletedAt: null },
    select: { id: true },
    take: 50,
  });
}

export function createArtist(data: Prisma.ArtistCreateInput) {
  return prisma.artist.create({ data, select: { id: true, slug: true } });
}

export function updateArtist(id: string, data: Prisma.ArtistUpdateInput) {
  return prisma.artist.update({ where: { id }, data, select: { id: true } });
}

export function softDeleteArtist(id: string) {
  return prisma.artist.update({ where: { id }, data: { deletedAt: new Date() } });
}

export function clearFeaturedArtists() {
  return prisma.artist.updateMany({ where: { isFeatured: true }, data: { isFeatured: false } });
}

export function setFeaturedArtist(id: string) {
  return prisma.artist.update({ where: { id }, data: { isFeatured: true } });
}

export function countArtists() {
  return prisma.artist.count({ where: { deletedAt: null } });
}

export function listArtistsForAdmin() {
  return prisma.artist.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });
}
