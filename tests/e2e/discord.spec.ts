import { expect, test } from '@playwright/test';

const SITE = '/Project-Adobo-Website';

test('footer widget swaps to a static card when Discord is blocked', async ({ page }) => {
  // Simulate an ad blocker / firewall dropping the widget iframe.
  await page.route(/discord\.com\/widget/, (route) => route.abort());
  await page.goto(`${SITE}/`);

  const fallback = page.locator('.discord-fallback');
  await expect(fallback).toBeVisible({ timeout: 15000 });
  await expect(fallback.getByRole('link', { name: /join us on discord/i })).toBeAttached();
  await expect(page.locator('.discord-iframe')).toHaveCount(0);
});

test('copy-invite buttons render in the hero and contact sections', async ({ page }) => {
  await page.goto(`${SITE}/`);
  await expect(page.getByRole('button', { name: 'Copy invite' }).first()).toBeVisible();
  await page.locator('#contact').scrollIntoViewIfNeeded();
  await expect(page.locator('#contact .copy-invite-button')).toBeVisible();
});

test('profile pages omit the Discord presence block when no id is set', async ({ page }) => {
  await page.goto(`${SITE}/members/foobu`);
  // FOOBU has no discordId yet — nothing should render, and it must not error.
  await expect(page.locator('.discord-presence')).toHaveCount(0);
});
