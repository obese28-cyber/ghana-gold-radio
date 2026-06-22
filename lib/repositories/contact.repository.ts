import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

export function createContactMessage(data: Prisma.ContactMessageCreateInput) {
  return prisma.contactMessage.create({ data, select: { id: true } });
}
