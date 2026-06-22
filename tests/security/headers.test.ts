/**
 * Security tests: verify next.config.js ships the required security headers
 * and CSP. Run against the built config object directly (no server needed),
 * keeping this fast and CI-friendly.
 */
import nextConfig from '@/next.config.js';

describe('Security headers configuration', () => {
  it('defines a headers() function', () => {
    expect(typeof nextConfig.headers).toBe('function');
  });

  it('includes the required security headers for all routes', async () => {
    const headerGroups = await nextConfig.headers();
    const allRoutes = headerGroups.find((g) => g.source === '/:path*');
    if (!allRoutes) {
      throw new Error('Expected a header group for /:path* in next.config.js');
    }

    const headerKeys = allRoutes.headers.map((h) => h.key);
    expect(headerKeys).toEqual(
      expect.arrayContaining([
        'Strict-Transport-Security',
        'X-Frame-Options',
        'X-Content-Type-Options',
        'Referrer-Policy',
        'Permissions-Policy',
        'Content-Security-Policy',
      ])
    );
  });

  it('CSP disallows framing from arbitrary origins', async () => {
    const headerGroups = await nextConfig.headers();
    const allRoutes = headerGroups.find((g) => g.source === '/:path*');
    if (!allRoutes) {
      throw new Error('Expected a header group for /:path* in next.config.js');
    }

    const cspHeader = allRoutes.headers.find((h) => h.key === 'Content-Security-Policy');
    if (!cspHeader) {
      throw new Error('Expected a Content-Security-Policy header');
    }

    expect(cspHeader.value).toContain("frame-ancestors 'self'");
    expect(cspHeader.value).toContain("object-src 'none'");
  });

  it('disables the X-Powered-By header', () => {
    expect(nextConfig.poweredByHeader).toBe(false);
  });
});
