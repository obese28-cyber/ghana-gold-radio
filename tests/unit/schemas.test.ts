import {
  artistSubmissionSchema,
  newsletterSchema,
  contactSchema,
  sponsorInquirySchema,
} from '@/lib/validation/schemas';

describe('artistSubmissionSchema', () => {
  const base = {
    stageName: 'Kwame Star',
    legalName: 'Kwame Asante',
    email: 'kwame@example.com',
    country: 'Ghana',
    genre: 'Highlife',
    songTitle: 'Adwoa',
    rightsOwnershipDeclared: true,
    promotionalPermissionDeclared: true,
    turnstileToken: 'token-123',
  };

  it('accepts a valid submission', () => {
    const result = artistSubmissionSchema.safeParse(base);
    expect(result.success).toBe(true);
  });

  it('rejects when rights ownership is not declared', () => {
    const result = artistSubmissionSchema.safeParse({ ...base, rightsOwnershipDeclared: false });
    expect(result.success).toBe(false);
  });

  it('rejects when promotional permission is not declared', () => {
    const result = artistSubmissionSchema.safeParse({ ...base, promotionalPermissionDeclared: false });
    expect(result.success).toBe(false);
  });

  it('rejects an invalid email', () => {
    const result = artistSubmissionSchema.safeParse({ ...base, email: 'not-an-email' });
    expect(result.success).toBe(false);
  });

  it('rejects honeypot-filled submissions at the schema boundary if non-empty', () => {
    const result = artistSubmissionSchema.safeParse({ ...base, honeypot: 'spammer filled this' });
    expect(result.success).toBe(false);
  });

  it('rejects a non-https/invalid YouTube URL format', () => {
    const result = artistSubmissionSchema.safeParse({ ...base, officialYoutubeUrl: 'not a url' });
    expect(result.success).toBe(false);
  });
});

describe('newsletterSchema', () => {
  it('accepts a minimal valid signup', () => {
    const result = newsletterSchema.safeParse({ email: 'fan@example.com', turnstileToken: 'tok' });
    expect(result.success).toBe(true);
  });

  it('rejects missing email', () => {
    const result = newsletterSchema.safeParse({ turnstileToken: 'tok' });
    expect(result.success).toBe(false);
  });
});

describe('contactSchema', () => {
  it('rejects a message under 10 characters', () => {
    const result = contactSchema.safeParse({
      name: 'Ama',
      email: 'ama@example.com',
      message: 'hi',
      turnstileToken: 'tok',
    });
    expect(result.success).toBe(false);
  });
});

describe('sponsorInquirySchema', () => {
  it('accepts a valid inquiry', () => {
    const result = sponsorInquirySchema.safeParse({
      companyName: 'Diaspora Bank',
      contactName: 'Yaw Boateng',
      email: 'yaw@example.com',
      turnstileToken: 'tok',
    });
    expect(result.success).toBe(true);
  });
});
