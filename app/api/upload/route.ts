import { NextRequest } from 'next/server';
import { jsonOk, jsonError } from '@/lib/utils/api-response';
import { saveUploadedFile, UploadValidationError, type UploadCategory } from '@/lib/storage/local-storage';
import { checkRateLimit, getClientIp } from '@/lib/security/rate-limit';

const ALLOWED_CATEGORIES: UploadCategory[] = ['press-photos', 'demos', 'avatars', 'misc'];

/**
 * Generic upload endpoint backing the local file storage layer.
 * Public (anonymous) uploads are limited to the categories used by the
 * artist submission form (press-photos, demos) and rate-limited per IP;
 * avatar/misc uploads from the admin dashboard are unrestricted by rate
 * limit but still go through the same validation.
 */
export async function POST(req: NextRequest) {
  const ip = getClientIp(req.headers);
  const rate = await checkRateLimit('upload', ip, { points: 10, durationSeconds: 600 });
  if (!rate.allowed) return jsonError('Too many uploads. Please try again later.', 429);

  const formData = await req.formData().catch(() => null);
  if (!formData) return jsonError('Invalid form data.', 400);

  const file = formData.get('file');
  const category = String(formData.get('category') || 'misc') as UploadCategory;

  if (!(file instanceof File)) return jsonError('No file provided.', 400);
  if (!ALLOWED_CATEGORIES.includes(category)) return jsonError('Invalid upload category.', 400);

  try {
    const saved = await saveUploadedFile(file, category);
    return jsonOk(saved, 201);
  } catch (err) {
    if (err instanceof UploadValidationError) return jsonError(err.message, 422);
    console.error('upload error', err);
    return jsonError('Upload failed.', 500);
  }
}
