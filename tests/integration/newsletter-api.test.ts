/**
 * @jest-environment node
 */
import { POST } from '@/app/api/newsletter/route';
import { NextRequest } from 'next/server';

jest.mock('@/lib/services/newsletter.service', () => ({
  subscribeToNewsletter: jest.fn(async () => undefined),
}));

jest.mock('@/lib/email/mailer', () => ({
  sendEmail: jest.fn(async () => undefined),
}));

jest.mock('@/lib/security/turnstile', () => ({
  verifyTurnstile: jest.fn(async () => true),
}));

function makeRequest(body: unknown) {
  return new NextRequest('http://localhost/api/newsletter', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('POST /api/newsletter', () => {
  it('subscribes a valid email', async () => {
    const res = await POST(makeRequest({ email: 'fan@example.com', turnstileToken: 'tok' }));
    expect(res.status).toBe(201);
  });

  it('rejects an invalid email', async () => {
    const res = await POST(makeRequest({ email: 'not-an-email', turnstileToken: 'tok' }));
    expect(res.status).toBe(422);
  });
});
