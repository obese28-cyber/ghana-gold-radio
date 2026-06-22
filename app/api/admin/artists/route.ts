import { NextRequest } from 'next/server';
import { z } from 'zod';
import { requireStaff } from '@/lib/auth/require-staff';
import { jsonOk, jsonError } from '@/lib/utils/api-response';
import { slugify } from '@/lib/utils/slugify';
import { sanitizePlainText, sanitizeRichText } from '@/lib/security/sanitize';
import { createArtist } from '@/lib/repositories/artist.repository';

const schema = z.object({
  stageName: z.string().trim().min(2).max(100),
  legalName: z.string().trim().max(100).optional(),
  bio: z.string().trim().max(3000).optional(),
  genres: z.array(z.string().trim().max(40)).max(8).default([]),
  country: z.string().trim().max(60).default('Ghana'),
  city: z.string().trim().max(60).optional(),
  pressPhotoUrl: z.string().url().optional().or(z.literal('')),
  isFeatured: z.boolean().default(false),
  verified: z.boolean().default(false),
});

export async function POST(req: NextRequest) {
  const auth = await requireStaff(['admin', 'editor']);
  if (!auth.authorized) return jsonError('Unauthorized.', 401);

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return jsonError('Validation failed.', 422);

  const slug = `${slugify(parsed.data.stageName)}-${Math.random().toString(36).slice(2, 6)}`;

  try {
    const created = await createArtist({
      stageName: sanitizePlainText(parsed.data.stageName),
      legalName: parsed.data.legalName ? sanitizePlainText(parsed.data.legalName) : null,
      slug,
      bio: parsed.data.bio ? sanitizeRichText(parsed.data.bio) : null,
      genres: parsed.data.genres,
      country: parsed.data.country,
      city: parsed.data.city || null,
      pressPhotoUrl: parsed.data.pressPhotoUrl || null,
      isFeatured: parsed.data.isFeatured,
      verified: parsed.data.verified,
      createdBy: { connect: { id: auth.user.id } },
    });
    return jsonOk(created, 201);
  } catch (err) {
    console.error('admin create artist error', err);
    return jsonError('Failed to create artist.', 500);
  }
}
