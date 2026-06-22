import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

export function findSongById(id: string) {
  return prisma.song.findUnique({ where: { id }, include: { artist: true } });
}

export function createSong(data: Prisma.SongCreateInput) {
  return prisma.song.create({ data, select: { id: true, slug: true } });
}

export function updateSong(id: string, data: Prisma.SongUpdateInput) {
  return prisma.song.update({ where: { id }, data, select: { id: true } });
}
