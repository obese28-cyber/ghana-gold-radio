import { test, expect } from '@playwright/test';

test.describe('SEO basics', () => {
  test('home page has title, meta description, and canonical link', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Ghana Gold Radio/);
    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBeTruthy();
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonical).toBeTruthy();
  });

  test('robots.txt is served and references the sitemap', async ({ request }) => {
    const res = await request.get('/robots.txt');
    expect(res.ok()).toBeTruthy();
    const body = await res.text();
    expect(body).toContain('Sitemap:');
    expect(body).toContain('Disallow: /admin');
  });

  test('home page includes Organization JSON-LD', async ({ page }) => {
    await page.goto('/');
    const jsonLd = await page.locator('script[type="application/ld+json"]').first().textContent();
    expect(jsonLd).toContain('"@type":"Organization"');
  });
});
