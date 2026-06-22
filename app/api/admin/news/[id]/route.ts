import { NextRequest } from 'next/server';
import { z } from 'zod';
import { requireStaff } from '@/lib/auth/require-staff';
import { jsonOk, jsonError } from '@/lib/utils/api-response';
import { sanitizePlainText, sanitizeRichText } from '@/lib/security/sanitize';
import { updatePost, softDeletePost } from '@/lib/repositories/post.repository';

const schema = z.object({
  title: z.string().trim().min(2).max(200).optional(),
  excerpt: z.string().trim().max(400).optional(),
  body: z.string().trim().min(10).max(20000).optional(),
  status: z.enum(['draft', 'pending_review', 'published', 'archived']).optional(),
  aiReviewStatus: z.enum(['draft', 'flagged', 'approved', 'rejected', 'published']).optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireStaff(['admin', 'editor']);
  if (!auth.authorized) return jsonError('Unauthorized.', 401);

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return jsonError('Validation failed.', 422);

  const updates: Record<string, unknown> = {};
  if (parsed.data.title) updates.title = sanitizePlainText(parsed.data.title);
  if (parsed.data.excerpt !== undefined) updates.excerpt = sanitizePlainText(parsed.data.excerpt);
  if (parsed.data.body) updates.body = sanitizeRichText(parsed.data.body);
  if (parsed.data.status) {
    updates.status = parsed.data.status;
    if (parsed.data.status === 'published') {
      updates.publishedAt = new Date();
      updates.reviewedBy = { connect: { id: auth.user.id } };
      updates.reviewedAt = new Date();
    }
  }
  if (parsed.data.aiReviewStatus) updates.aiReviewStatus = parsed.data.aiReviewStatus;

  try {
    const updated = await updatePost(params.id, updates);
    return jsonOk(updated);
  } catch (err) {
    console.error('admin update post error', err);
    return jsonError('Failed to update post.', 500);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireStaff(['admin', 'editor']);
  if (!auth.authorized) return jsonError('Unauthorized.', 401);

  try {
    await softDeletePost(params.id);
    return jsonOk({ deleted: true });
  } catch (err) {
    console.error('admin delete post error', err);
    return jsonError('Failed to delete post.', 500);
  }
}
