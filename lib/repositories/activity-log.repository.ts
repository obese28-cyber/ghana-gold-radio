import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export function logActivity(input: {
  actorId?: string | null;
  actorEmail?: string | null;
  action: string;
  entityType?: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}) {
  return prisma.activityLog.create({
    data: {
      actorId: input.actorId ?? null,
      actorEmail: input.actorEmail ?? null,
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId,
      metadata: (input.metadata ?? {}) as Prisma.InputJsonValue,
      ipAddress: input.ipAddress,
      userAgent: input.userAgent,
    },
  });
}

export function pruneActivityLogsBefore(cutoff: Date) {
  return prisma.activityLog.deleteMany({ where: { createdAt: { lt: cutoff } } });
}
