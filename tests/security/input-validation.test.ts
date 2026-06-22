import { artistSubmissionSchema, contactSchema } from '@/lib/validation/schemas';
import { sanitizePlainText, sanitizeRichText } from '@/lib/security/sanitize';

describe('XSS / injection defenses', () => {
  it('sanitizePlainText strips script tags entirely', () => {
    const result = sanitizePlainText('<script>alert(1)</script>Hello');
    expect(result).not.toContain('<script>');
    expect(result).toContain('Hello');
  });

  it('sanitizeRichText strips disallowed tags but keeps safe ones', () => {
    const result = sanitizeRichText('<p>Hello</p><script>alert(1)</script><img src=x onerror=alert(1)>');
    expect(result).toContain('<p>Hello</p>');
    expect(result).not.toContain('<script>');
    expect(result).not.toContain('onerror');
  });

  it('rejects oversized bio input at the schema layer (DoS guard)', () => {
    const hugeBio = 'a'.repeat(5000);
    const result = artistSubmissionSchema.safeParse({
      stageName: 'Test',
      legalName: 'Test Legal',
      email: 'a@b.com',
      country: 'Ghana',
      genre: 'Highlife',
      songTitle: 'Song',
      artistBio: hugeBio,
      rightsOwnershipDeclared: true,
      promotionalPermissionDeclared: true,
      turnstileToken: 'tok',
    });
    expect(result.success).toBe(false);
  });

  it('rejects contact messages exceeding max length', () => {
    const result = contactSchema.safeParse({
      name: 'Test',
      email: 'a@b.com',
      message: 'a'.repeat(5000),
      turnstileToken: 'tok',
    });
    expect(result.success).toBe(false);
  });
});
