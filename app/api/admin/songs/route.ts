import { NextRequest } from 'next/server';
import { z } from 'zod';
import { requireStaff } from '@/lib/auth/require-staff';
import { jsonOk, jsonError } from '@/lib/utils/api-response';
import { slugify } from '@/lib/utils/slugify';
import { sanitizePlainText } from '@/lib/security/sanitize';
import { createSong } from '@/lib/repositories/song.repository';

const schema = z.object({
  title: z.string().trim().min(1).max(200),
  artistId: z.string().uuid('Select an artist.'),
  genre: z.string().trim().max(40).optional(),
  releaseDate: z.string().trim().optional().or(z.literal('')),
  officialYoutubeUrl: z.string().url().optional().or(z.literal('')),
  coverArtUrl: z.string().url().optional().or(z.literal('')),
});

export async function POST(req: NextRequest) {
  const auth = await requireStaff(['admin', 'editor']);
  if (!auth.authorized) return jsonError('Unauthorized.', 401);

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return jsonError('Validation failed.', 422);

  const slug = `${slugify(parsed.data.title)}-${Math.random().toString(36).slice(2, 6)}`;

  try {
    const created = await createSong({
      title: sanitizePlainText(parsed.data.title),
      slug,
      artist: { connect: { id: parsed.data.artistId } },
      genre: parsed.data.genre || null,
      releaseDate: parsed.data.releaseDate ? new Date(parsed.data.releaseDate) : null,
      officialYoutubeUrl: parsed.data.officialYoutubeUrl || null,
      coverArtUrl: parsed.data.coverArtUrl || null,
      createdBy: { connect: { id: auth.user.id } },
    });
    return jsonOk(created, 201);
  } catch (err) {
    console.error('admin create song error', err);
    return jsonError('Failed to create song. Check that the selected artist exists.', 500);
  }
}
