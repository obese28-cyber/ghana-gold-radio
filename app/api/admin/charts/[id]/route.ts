import { NextRequest } from 'next/server';
import { z } from 'zod';
import { requireStaff } from '@/lib/auth/require-staff';
import { jsonOk, jsonError } from '@/lib/utils/api-response';
import { updateChart, upsertChartItem } from '@/lib/repositories/chart.repository';

const updateSchema = z.object({
  isPublished: z.boolean().optional(),
  aiCommentary: z.string().max(3000).optional(),
  aiReviewStatus: z.enum(['draft', 'flagged', 'approved', 'rejected', 'published']).optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireStaff(['admin', 'editor']);
  if (!auth.authorized) return jsonError('Unauthorized.', 401);

  const parsed = updateSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return jsonError('Validation failed.', 422);

  const updates: Record<string, unknown> = {};
  if (parsed.data.isPublished !== undefined) {
    updates.isPublished = parsed.data.isPublished;
    if (parsed.data.isPublished) updates.publishedAt = new Date();
  }
  if (parsed.data.aiCommentary !== undefined) updates.aiCommentary = parsed.data.aiCommentary;
  if (parsed.data.aiReviewStatus) updates.aiReviewStatus = parsed.data.aiReviewStatus;

  try {
    const updated = await updateChart(params.id, updates);
    return jsonOk(updated);
  } catch (err) {
    console.error('admin update chart error', err);
    return jsonError('Failed to update chart.', 500);
  }
}

const itemSchema = z.object({
  songId: z.string().uuid(),
  rank: z.number().int().min(1).max(10),
  previousRank: z.number().int().min(1).max(10).nullable().optional(),
});

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireStaff(['admin', 'editor']);
  if (!auth.authorized) return jsonError('Unauthorized.', 401);

  const parsed = itemSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return jsonError('Validation failed.', 422);

  try {
    const item = await upsertChartItem(params.id, parsed.data.songId, parsed.data.rank, parsed.data.previousRank);
    return jsonOk(item, 201);
  } catch (err) {
    console.error('admin add chart item error', err);
    return jsonError('Failed to add chart item.', 500);
  }
}
