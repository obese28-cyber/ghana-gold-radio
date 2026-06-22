import { test, expect } from '@playwright/test';

test.describe('Submit Your Music flow', () => {
  test('shows validation when consent checkboxes are unchecked', async ({ page }) => {
    await page.goto('/submit');
    await page.getByLabel('Stage Name').fill('Test Artist');
    await page.getByLabel('Legal Name').fill('Test Legal Name');
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Country').fill('Ghana');
    await page.getByLabel('Song Title').fill('Test Song');

    // Required checkboxes are left unchecked — native HTML5 validation should block submit
    await page.getByRole('button', { name: /submit music/i }).click();

    // The form should not show the success state since consent wasn't given
    await expect(page.getByText('Submission Received!')).not.toBeVisible();
  });

  test('renders all required fields', async ({ page }) => {
    await page.goto('/submit');
    await expect(page.getByLabel('Stage Name')).toBeVisible();
    await expect(page.getByLabel('Legal Name')).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Country')).toBeVisible();
    await expect(page.getByLabel('Song Title')).toBeVisible();
    await expect(page.getByText(/rights to this music/i)).toBeVisible();
    await expect(page.getByText(/promotional purposes only/i)).toBeVisible();
  });
});
