import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

export function upsertSubscriber(email: string, data: Omit<Prisma.NewsletterSubscriberCreateInput, 'email'>) {
  return prisma.newsletterSubscriber.upsert({
    where: { email },
    update: data,
    create: { email, ...data },
    select: { id: true },
  });
}

export function confirmSubscriberByToken(token: string) {
  return prisma.newsletterSubscriber.updateMany({
    where: { confirmToken: token },
    data: { isConfirmed: true, confirmedAt: new Date(), confirmToken: null },
  });
}

export function unsubscribeByToken(token: string) {
  return prisma.newsletterSubscriber.updateMany({
    where: { unsubscribeToken: token },
    data: { unsubscribedAt: new Date() },
  });
}

export function listSubscribersForAdmin() {
  return prisma.newsletterSubscriber.findMany({
    orderBy: { createdAt: 'desc' },
    take: 200,
  });
}

export function countActiveSubscribers() {
  return prisma.newsletterSubscriber.count({ where: { unsubscribedAt: null } });
}
