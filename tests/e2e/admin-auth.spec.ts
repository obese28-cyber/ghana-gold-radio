import { test, expect } from '@playwright/test';

test.describe('Admin auth gate', () => {
  test('redirects unauthenticated users from /admin to /admin/login', async ({ page }) => {
    await page.goto('/admin');
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test('redirects unauthenticated users from a nested admin route', async ({ page }) => {
    await page.goto('/admin/submissions');
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test('login page renders the sign-in form', async ({ page }) => {
    await page.goto('/admin/login');
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
  });
});
