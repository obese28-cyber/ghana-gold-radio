import DOMPurify from 'isomorphic-dompurify';

/** Strips all HTML/script content — use for plain-text fields (names, titles, etc). */
export function sanitizePlainText(input: string): string {
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }).trim();
}

/** Allows a minimal safe HTML subset — use for rich text bodies (news posts, bios). */
export function sanitizeRichText(input: string): string {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ['p', 'b', 'strong', 'i', 'em', 'a', 'ul', 'ol', 'li', 'br', 'h2', 'h3', 'blockquote'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
  });
}

/** Basic allowlist check for image MIME types, used before accepting uploads. */
export function isAllowedImageType(mime: string): boolean {
  const allowed = (process.env.ALLOWED_IMAGE_TYPES || 'image/jpeg,image/png,image/webp').split(',');
  return allowed.includes(mime);
}

export function isAllowedAudioType(mime: string): boolean {
  const allowed = (process.env.ALLOWED_AUDIO_TYPES || 'audio/mpeg,audio/wav,audio/x-m4a').split(',');
  return allowed.includes(mime);
}

export function isWithinUploadSizeLimit(bytes: number): boolean {
  const maxMb = Number(process.env.MAX_UPLOAD_MB || 15);
  return bytes <= maxMb * 1024 * 1024;
}
