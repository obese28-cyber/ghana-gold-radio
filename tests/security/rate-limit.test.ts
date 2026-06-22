import { checkRateLimit } from '@/lib/security/rate-limit';

describe('Rate limiting', () => {
  it('allows requests within the configured limit', async () => {
    const result = await checkRateLimit('test-bucket-1', '1.2.3.4', { points: 3, durationSeconds: 60 });
    expect(result.allowed).toBe(true);
  });

  it('blocks requests once the limit is exceeded', async () => {
    const id = '5.6.7.8';
    const bucket = 'test-bucket-2';
    await checkRateLimit(bucket, id, { points: 2, durationSeconds: 60 });
    await checkRateLimit(bucket, id, { points: 2, durationSeconds: 60 });
    const third = await checkRateLimit(bucket, id, { points: 2, durationSeconds: 60 });
    expect(third.allowed).toBe(false);
  });

  it('tracks distinct identifiers independently', async () => {
    const bucket = 'test-bucket-3';
    await checkRateLimit(bucket, 'ip-a', { points: 1, durationSeconds: 60 });
    const ipB = await checkRateLimit(bucket, 'ip-b', { points: 1, durationSeconds: 60 });
    expect(ipB.allowed).toBe(true);
  });
});
