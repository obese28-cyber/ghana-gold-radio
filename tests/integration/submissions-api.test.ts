/**
 * @jest-environment node
 *
 * Integration tests for /api/submissions.
 * Mocks the application service and email sender so these run without a
 * live database. End-to-end coverage should use a disposable PostgreSQL DB.
 */
import { POST } from '@/app/api/submissions/route';
import { NextRequest } from 'next/server';

jest.mock('@/lib/services/submission.service', () => ({
  submitArtistApplication: jest.fn(async () => ({ id: 'test-id-123' })),
}));

jest.mock('@/lib/email/mailer', () => ({
  notifyAdminNewSubmission: jest.fn(async () => undefined),
  notifyArtistSubmissionReceived: jest.fn(async () => undefined),
}));

jest.mock('@/lib/security/turnstile', () => ({
  verifyTurnstile: jest.fn(async () => true),
}));

// isomorphic-dompurify pulls in jsdom (ESM-only transitive deps) which the
// default Jest CJS transform can't parse. Sanitization itself is covered by
// tests/security/input-validation.test.ts — here we only test route logic.
jest.mock('@/lib/security/sanitize', () => ({
  sanitizePlainText: (s: string) => s,
  sanitizeRichText: (s: string) => s,
}));

function makeRequest(body: unknown) {
  return new NextRequest('http://localhost/api/submissions', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });
}

const validPayload = {
  stageName: 'Kwame Star',
  legalName: 'Kwame Asante',
  email: 'kwame@example.com',
  country: 'Ghana',
  genre: 'Highlife',
  songTitle: 'Adwoa',
  rightsOwnershipDeclared: true,
  promotionalPermissionDeclared: true,
  turnstileToken: 'test-token',
};

describe('POST /api/submissions', () => {
  it('returns 201 and an id for a valid submission', async () => {
    const res = await POST(makeRequest(validPayload));
    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.id).toBe('test-id-123');
  });

  it('returns 422 when consent fields are missing', async () => {
    const { rightsOwnershipDeclared, ...invalid } = validPayload;
    const res = await POST(makeRequest(invalid));
    expect(res.status).toBe(422);
  });

  it('silently no-ops on honeypot fill (anti-spam)', async () => {
    const res = await POST(makeRequest({ ...validPayload, honeypot: 'bot-filled' }));
    const json = await res.json();
    expect(res.status).toBe(201);
    expect(json.data.id).toBeNull();
  });

  it('returns 400 for invalid JSON body', async () => {
    const req = new NextRequest('http://localhost/api/submissions', {
      method: 'POST',
      body: '{not valid json',
      headers: { 'Content-Type': 'application/json' },
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
