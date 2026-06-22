import { NextRequest } from 'next/server';
import { z } from 'zod';
import { requireStaff } from '@/lib/auth/require-staff';
import { jsonOk, jsonError } from '@/lib/utils/api-response';
import { sanitizePlainText, sanitizeRichText } from '@/lib/security/sanitize';
import { findArtistById, updateArtist, softDeleteArtist } from '@/lib/repositories/artist.repository';

const updateSchema = z.object({
  stageName: z.string().trim().min(2).max(100).optional(),
  bio: z.string().trim().max(3000).optional(),
  genres: z.array(z.string().trim().max(40)).optional(),
  isFeatured: z.boolean().optional(),
  verified: z.boolean().optional(),
  permissionStatus: z.enum(['unknown', 'requested', 'granted', 'denied', 'expired']).optional(),
});

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireStaff();
  if (!auth.authorized) return jsonError('Unauthorized.', 401);

  const artist = await findArtistById(params.id);
  if (!artist) return jsonError('Artist not found.', 404);
  return jsonOk(artist);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireStaff(['admin', 'editor']);
  if (!auth.authorized) return jsonError('Unauthorized.', 401);

  const parsed = updateSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return jsonError('Validation failed.', 422);

  const updates: Record<string, unknown> = {};
  if (parsed.data.stageName) updates.stageName = sanitizePlainText(parsed.data.stageName);
  if (parsed.data.bio !== undefined) updates.bio = sanitizeRichText(parsed.data.bio);
  if (parsed.data.genres) updates.genres = parsed.data.genres;
  if (parsed.data.isFeatured !== undefined) updates.isFeatured = parsed.data.isFeatured;
  if (parsed.data.verified !== undefined) updates.verified = parsed.data.verified;
  if (parsed.data.permissionStatus) updates.permissionStatus = parsed.data.permissionStatus;

  try {
    const updated = await updateArtist(params.id, updates);
    return jsonOk(updated);
  } catch (err) {
    console.error('admin update artist error', err);
    return jsonError('Failed to update artist.', 500);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireStaff(['admin']);
  if (!auth.authorized) return jsonError('Unauthorized.', 401);

  try {
    await softDeleteArtist(params.id);
    return jsonOk({ deleted: true });
  } catch (err) {
    console.error('admin delete artist error', err);
    return jsonError('Failed to delete artist.', 500);
  }
}
