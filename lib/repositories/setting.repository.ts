import { prisma } from '@/lib/prisma';

export function listAllSettings() {
  return prisma.siteSetting.findMany({ orderBy: { key: 'asc' } });
}

export function getSetting(key: string) {
  return prisma.siteSetting.findUnique({ where: { key } });
}
