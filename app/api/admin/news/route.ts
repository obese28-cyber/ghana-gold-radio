import { NextRequest } from 'next/server';
import { z } from 'zod';
import { requireStaff } from '@/lib/auth/require-staff';
import { jsonOk, jsonError } from '@/lib/utils/api-response';
import { slugify } from '@/lib/utils/slugify';
import { sanitizePlainText, sanitizeRichText } from '@/lib/security/sanitize';
import { createPost } from '@/lib/repositories/post.repository';

const schema = z.object({
  title: z.string().trim().min(2).max(200),
  excerpt: z.string().trim().max(400).optional(),
  body: z.string().trim().min(10).max(20000),
  postType: z.enum(['news', 'diaspora_update', 'event', 'highlife', 'gospel', 'afrobeats_hiplife', 'general']),
  categoryId: z.string().uuid().optional(),
  sourceName: z.string().trim().max(200).optional(),
  sourceUrl: z.string().url().optional().or(z.literal('')),
  featuredImageUrl: z.string().url().optional().or(z.literal('')),
  isAiGenerated: z.boolean().default(false),
});

export async function POST(req: NextRequest) {
  const auth = await requireStaff(['admin', 'editor']);
  if (!auth.authorized) return jsonError('Unauthorized.', 401);

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return jsonError('Validation failed.', 422);

  const slug = `${slugify(parsed.data.title)}-${Math.random().toString(36).slice(2, 6)}`;

  try {
    const created = await createPost({
      title: sanitizePlainText(parsed.data.title),
      slug,
      excerpt: parsed.data.excerpt ? sanitizePlainText(parsed.data.excerpt) : null,
      body: sanitizeRichText(parsed.data.body),
      postType: parsed.data.postType,
      category: parsed.data.categoryId ? { connect: { id: parsed.data.categoryId } } : undefined,
      sourceName: parsed.data.sourceName || null,
      sourceUrl: parsed.data.sourceUrl || null,
      featuredImageUrl: parsed.data.featuredImageUrl || null,
      isAiGenerated: parsed.data.isAiGenerated,
      aiReviewStatus: parsed.data.isAiGenerated ? 'draft' : 'approved',
      status: 'draft',
      author: { connect: { id: auth.user.id } },
    });
    return jsonOk(created, 201);
  } catch (err) {
    console.error('admin create post error', err);
    return jsonError('Failed to create post.', 500);
  }
}
