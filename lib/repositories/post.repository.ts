import { prisma } from '@/lib/prisma';
import type { Prisma, PostCategoryType, PostStatus } from '@prisma/client';

export function findPublishedPosts(args: { postType?: PostCategoryType; query?: string; limit?: number }) {
  const where: Prisma.PostWhereInput = { status: 'published', deletedAt: null };
  if (args.postType) where.postType = args.postType;
  if (args.query) where.title = { contains: args.query, mode: 'insensitive' };

  return prisma.post.findMany({
    where,
    orderBy: { publishedAt: 'desc' },
    take: args.limit ?? 30,
  });
}

export function findPostsByCategory(categoryId: string) {
  return prisma.post.findMany({
    where: { categoryId, status: 'published', deletedAt: null },
    orderBy: { publishedAt: 'desc' },
  });
}

export function findPostBySlug(slug: string) {
  return prisma.post.findFirst({ where: { slug, status: 'published', deletedAt: null } });
}

export function findPostById(id: string) {
  return prisma.post.findUnique({ where: { id } });
}

export function listPostsForAdmin() {
  return prisma.post.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });
}

export function createPost(data: Prisma.PostCreateInput) {
  return prisma.post.create({ data, select: { id: true, slug: true } });
}

export function updatePost(id: string, data: Prisma.PostUpdateInput) {
  return prisma.post.update({ where: { id }, data, select: { id: true, slug: true } });
}

export function softDeletePost(id: string) {
  return prisma.post.update({ where: { id }, data: { deletedAt: new Date(), status: 'archived' as PostStatus } });
}

export function countDraftAiPosts() {
  return prisma.post.count({ where: { aiReviewStatus: 'draft', isAiGenerated: true, deletedAt: null } });
}
