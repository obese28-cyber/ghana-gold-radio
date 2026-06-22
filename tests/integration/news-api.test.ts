/**
 * @jest-environment node
 *
 * Integration tests for the admin News & Posts publishing workflow:
 * /api/admin/news (create) and /api/admin/news/[id] (update status).
 * Mocks the repository and auth layers so these run without a live database.
 */
import { NextRequest } from 'next/server';

const mockCreatePost = jest.fn(async (data: any) => ({ id: 'post-1', slug: data.slug }));
const mockUpdatePost = jest.fn(async (id: string, data: any) => ({ id, slug: 'kuami-eugene-spotlight-ab12', ...data }));

jest.mock('@/lib/repositories/post.repository', () => ({
  createPost: (data: any) => mockCreatePost(data),
  updatePost: (id: string, data: any) => mockUpdatePost(id, data),
  softDeletePost: jest.fn(),
}));

jest.mock('@/lib/auth/require-staff', () => ({
  requireStaff: jest.fn(async () => ({
    authorized: true,
    user: { id: 'admin-1', email: 'admin@ghanagoldradio.com' },
    role: 'admin',
  })),
}));

jest.mock('@/lib/security/sanitize', () => ({
  sanitizePlainText: (s: string) => s,
  sanitizeRichText: (s: string) => s,
}));

import { POST as createPostRoute } from '@/app/api/admin/news/route';
import { PATCH as updatePostRoute } from '@/app/api/admin/news/[id]/route';
import { requireStaff } from '@/lib/auth/require-staff';

function makeRequest(url: string, method: string, body: unknown) {
  return new NextRequest(url, {
    method,
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });
}

function lastCallOf(mock: jest.Mock): any[] {
  const call = mock.mock.calls.at(-1);
  if (!call) throw new Error('Expected the mock to have been called at least once.');
  return call;
}

const validNewPost = {
  title: 'Kuami Eugene Featured as Ghana Gold Radio Artist Spotlight',
  body: 'Kuami Eugene sits down with our editorial team to discuss his latest single and upcoming tour dates.',
  postType: 'news',
  isAiGenerated: true,
};

describe('POST /api/admin/news (create post)', () => {
  beforeEach(() => {
    mockCreatePost.mockClear();
  });

  it('creates a new post with status "draft" by default', async () => {
    const res = await createPostRoute(makeRequest('http://localhost/api/admin/news', 'POST', validNewPost));
    expect(res.status).toBe(201);

    expect(mockCreatePost).toHaveBeenCalledTimes(1);
    const [createArgs] = lastCallOf(mockCreatePost);
    expect(createArgs.status).toBe('draft');
  });

  it('keeps AI review status separate from publish status: AI-generated posts start aiReviewStatus "draft"', async () => {
    await createPostRoute(makeRequest('http://localhost/api/admin/news', 'POST', validNewPost));
    const [createArgs] = lastCallOf(mockCreatePost);
    expect(createArgs.isAiGenerated).toBe(true);
    expect(createArgs.aiReviewStatus).toBe('draft');
    expect(createArgs.status).toBe('draft');
  });

  it('marks non-AI posts as already aiReviewStatus "approved"', async () => {
    await createPostRoute(makeRequest('http://localhost/api/admin/news', 'POST', { ...validNewPost, isAiGenerated: false }));
    const [createArgs] = lastCallOf(mockCreatePost);
    expect(createArgs.aiReviewStatus).toBe('approved');
  });

  it('rejects unauthenticated requests', async () => {
    (requireStaff as jest.Mock).mockResolvedValueOnce({ authorized: false, reason: 'unauthenticated' });
    const res = await createPostRoute(makeRequest('http://localhost/api/admin/news', 'POST', validNewPost));
    expect(res.status).toBe(401);
  });
});

describe('PATCH /api/admin/news/[id] (publish workflow)', () => {
  beforeEach(() => {
    mockUpdatePost.mockClear();
  });

  it('changes a draft post to published and stamps publishedAt + reviewer', async () => {
    const res = await updatePostRoute(
      makeRequest('http://localhost/api/admin/news/post-1', 'PATCH', {
        title: 'Kuami Eugene Featured as Ghana Gold Radio Artist Spotlight',
        body: 'Updated body text long enough to pass validation.',
        status: 'published',
      }),
      { params: { id: 'post-1' } }
    );
    expect(res.status).toBe(200);

    expect(mockUpdatePost).toHaveBeenCalledTimes(1);
    const [, updateArgs] = lastCallOf(mockUpdatePost);
    expect(updateArgs.status).toBe('published');
    expect(updateArgs.publishedAt).toBeInstanceOf(Date);
    expect(updateArgs.reviewedAt).toBeInstanceOf(Date);
    expect(updateArgs.reviewedBy).toEqual({ connect: { id: 'admin-1' } });
  });

  it('allows editing an already-published post (e.g. fixing a typo) without losing its published status', async () => {
    const res = await updatePostRoute(
      makeRequest('http://localhost/api/admin/news/post-1', 'PATCH', {
        title: 'Kuami Eugene Featured as Ghana Gold Radio Artist Spotlight (Updated)',
        status: 'published',
      }),
      { params: { id: 'post-1' } }
    );
    expect(res.status).toBe(200);

    const [, updateArgs] = lastCallOf(mockUpdatePost);
    expect(updateArgs.title).toBe('Kuami Eugene Featured as Ghana Gold Radio Artist Spotlight (Updated)');
    expect(updateArgs.status).toBe('published');
  });

  it('does not stamp publishedAt/reviewedAt when status is unchanged (still draft)', async () => {
    const res = await updatePostRoute(
      makeRequest('http://localhost/api/admin/news/post-1', 'PATCH', {
        title: 'Kuami Eugene Featured as Ghana Gold Radio Artist Spotlight',
        status: 'draft',
      }),
      { params: { id: 'post-1' } }
    );
    expect(res.status).toBe(200);

    const [, updateArgs] = lastCallOf(mockUpdatePost);
    expect(updateArgs.status).toBe('draft');
    expect(updateArgs.publishedAt).toBeUndefined();
  });

  it('rejects an invalid status value', async () => {
    const res = await updatePostRoute(
      makeRequest('http://localhost/api/admin/news/post-1', 'PATCH', { status: 'live' }),
      { params: { id: 'post-1' } }
    );
    expect(res.status).toBe(422);
  });
});
