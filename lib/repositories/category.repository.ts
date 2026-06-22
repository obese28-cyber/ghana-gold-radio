import { prisma } from '@/lib/prisma';
import type { PostCategoryType } from '@prisma/client';

export function findActiveCategories(type?: PostCategoryType) {
  return prisma.category.findMany({
    where: { isActive: true, type },
    orderBy: { sortOrder: 'asc' },
  });
}

export function findCategoryBySlugAndType(slug: string, type: PostCategoryType) {
  return prisma.category.findFirst({ where: { slug, type } });
}

export function listAllCategoriesForAdmin() {
  return prisma.category.findMany({
    where: { deletedAt: null },
    orderBy: [{ type: 'asc' }, { sortOrder: 'asc' }],
  });
}
