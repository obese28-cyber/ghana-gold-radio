/**
 * @jest-environment node
 *
 * Unit tests for lib/repositories/post.repository.ts query-building logic.
 * Verifies that every public-facing read (used by /news, /news/[slug], and
 * the homepage "Latest Music News" section) is scoped to status: 'published',
 * so drafts and posts pending review never leak onto public pages.
 */
const mockFindMany = jest.fn(async (_args?: any) => [] as any[]);
const mockFindFirst = jest.fn(async (_args?: any) => null as any);

jest.mock('@/lib/prisma', () => ({
  prisma: {
    post: {
      findMany: (args: any) => mockFindMany(args),
      findFirst: (args: any) => mockFindFirst(args),
    },
  },
}));

import { findPublishedPosts, findPostsByCategory, findPostBySlug, listPostsForAdmin } from '@/lib/repositories/post.repository';

function lastArgsOf(mock: jest.Mock): any {
  const call = mock.mock.calls.at(-1);
  if (!call) throw new Error('Expected the mock to have been called at least once.');
  return call[0];
}

describe('post.repository — public visibility scoping', () => {
  beforeEach(() => {
    mockFindMany.mockClear();
    mockFindFirst.mockClear();
  });

  it('findPublishedPosts only queries status: "published"', async () => {
    await findPublishedPosts({});
    const { where } = lastArgsOf(mockFindMany);
    expect(where.status).toBe('published');
    expect(where.deletedAt).toBeNull();
  });

  it('findPublishedPosts orders by publishedAt desc (newest first, for the homepage and /news)', async () => {
    await findPublishedPosts({ limit: 3 });
    const { orderBy, take } = lastArgsOf(mockFindMany);
    expect(orderBy).toEqual({ publishedAt: 'desc' });
    expect(take).toBe(3);
  });

  it('findPostsByCategory only queries status: "published"', async () => {
    await findPostsByCategory('category-1');
    const { where } = lastArgsOf(mockFindMany);
    expect(where.status).toBe('published');
    expect(where.categoryId).toBe('category-1');
  });

  it('findPostBySlug (used by /news/[slug]) only matches status: "published"', async () => {
    await findPostBySlug('kuami-eugene-spotlight-ab12');
    const { where } = lastArgsOf(mockFindFirst);
    expect(where.status).toBe('published');
    expect(where.slug).toBe('kuami-eugene-spotlight-ab12');
  });

  it('listPostsForAdmin (used by the admin News and Posts list) is NOT restricted to published, so drafts are visible to editors', async () => {
    await listPostsForAdmin();
    const { where } = lastArgsOf(mockFindMany);
    expect(where.status).toBeUndefined();
    expect(where.deletedAt).toBeNull();
  });
});
