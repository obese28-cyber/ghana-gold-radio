import { getServerSession } from 'next-auth';
import { authOptions } from './auth-options';
import { prisma } from '@/lib/prisma';

export type StaffRole = 'admin' | 'editor' | 'moderator';

/**
 * Verifies the current request belongs to an authenticated staff user.
 * Use at the top of every admin API route and admin server component.
 * Re-checks isActive/deletedAt against the DB (not just the JWT) so a
 * deactivated account loses access immediately, not just after token expiry.
 */
export async function requireStaff(roles: StaffRole[] = ['admin', 'editor', 'moderator']) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { authorized: false as const, reason: 'unauthenticated' as const };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, email: true, role: true, isActive: true, deletedAt: true },
  });

  if (!user || user.deletedAt || !user.isActive) {
    return { authorized: false as const, reason: 'no_profile' as const };
  }

  if (!roles.includes(user.role as StaffRole)) {
    return { authorized: false as const, reason: 'forbidden' as const };
  }

  return {
    authorized: true as const,
    user: { id: user.id, email: user.email },
    role: user.role as StaffRole,
  };
}
