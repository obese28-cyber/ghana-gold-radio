import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';
import { isAllowedImageType, isAllowedAudioType, isWithinUploadSizeLimit } from '@/lib/security/sanitize';

export type UploadCategory = 'press-photos' | 'demos' | 'avatars' | 'misc';
const UPLOAD_ROOT = process.env.UPLOADS_DIR || path.join(process.cwd(), 'public', 'uploads');

export interface SavedFile {
  url: string;
  filename: string;
  sizeBytes: number;
  mimeType: string;
}

export class UploadValidationError extends Error {}

function safeExtension(filename: string) {
  const extension = path.extname(filename).toLowerCase().replace(/[^a-z0-9.]/g, '');
  return extension.length > 0 && extension.length <= 10 ? extension : '';
}

export async function saveUploadedFile(file: File, category: UploadCategory): Promise<SavedFile> {
  const isAudio = category === 'demos';
  const allowed = isAudio ? isAllowedAudioType(file.type) : isAllowedImageType(file.type);
  if (!allowed) {
    throw new UploadValidationError(isAudio
      ? 'Unsupported audio file type. Allowed: MP3, WAV, M4A.'
      : 'Unsupported image file type. Allowed: JPEG, PNG, WEBP.');
  }
  if (!isWithinUploadSizeLimit(file.size)) {
    throw new UploadValidationError(`File exceeds the ${Number(process.env.MAX_UPLOAD_MB || 15)}MB upload limit.`);
  }
  const destination = path.join(UPLOAD_ROOT, category);
  await mkdir(destination, { recursive: true });
  const filename = `${randomUUID()}${safeExtension(file.name)}`;
  await writeFile(path.join(destination, filename), Buffer.from(await file.arrayBuffer()));
  return { url: `/uploads/${category}/${filename}`, filename, sizeBytes: file.size, mimeType: file.type };
}
