import { test, expect } from '@playwright/test';

test.describe('Home page', () => {
  test('loads and shows the hero, tagline, and primary CTAs', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Ghana Gold Radio', level: 1 })).toBeVisible();
    await expect(page.getByText('The Sound of Home, Anywhere in the World.')).toBeVisible();
    await expect(page.getByRole('link', { name: /explore top 10/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /submit your music/i })).toBeVisible();
  });

  test('header navigation links are present', async ({ page }) => {
    await page.goto('/');
    for (const label of ['Top 10', 'Artists', 'Highlife', 'Gospel', 'News', 'Diaspora']) {
      await expect(page.getByRole('link', { name: label, exact: true }).first()).toBeVisible();
    }
  });

  test('is responsive on mobile viewports', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await expect(page.getByRole('button', { name: /open menu/i })).toBeVisible();
  });
});
