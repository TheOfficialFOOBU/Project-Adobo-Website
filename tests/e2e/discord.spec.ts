import { expect, test } from '@playwright/test';

const SITE = '/Project-Adobo-Website';

test('footer widget shows a static card when Discord is blocked', async ({ page }) => {
  // Simulate an ad blocker / firewall dropping the widget iframe.
  await page.route(/discord\.com\/widget/, (route) => route.abort());
  await page.goto(`${SITE}/`);

  const fallback = page.locator('.discord-fallback');
  await expect(fallback).toBeVisible({ timeout: 15000 });
  // Widget starts disabled — shows a button, not a link
  await expect(fallback.getByRole('button', { name: /show online members/i })).toBeVisible();
  await expect(page.locator('.discord-iframe')).toHaveCount(0);
});

test('copy-invite buttons render in the hero and contact sections', async ({ page }) => {
  await page.goto(`${SITE}/`);
  await expect(page.getByRole('button', { name: 'Copy invite' }).first()).toBeVisible();
  await page.locator('#contact').scrollIntoViewIfNeeded();
  await expect(page.locator('#contact .copy-invite-button')).toBeVisible();
});

test('profile pages render the Discord block only when an id is set', async ({ page }) => {
  // FOOBU has a discordId — deep link must be present.
  await page.goto(`${SITE}/members/foobu`);
  const presence = page.locator('.discord-presence');
  await expect(presence.getByRole('link', { name: /open discord profile/i })).toHaveAttribute(
    'href',
    'https://discord.com/users/897027480534286386'
  );

  // Members without an id render nothing and must not error.
  await page.goto(`${SITE}/members/swaggo`);
  await expect(page.locator('.discord-presence')).toHaveCount(0);
});

test('recruitment banner shows on home, persists dismissal, stays off profiles', async ({
  page,
}) => {
  await page.goto(`${SITE}/`);
  const banner = page.locator('.recruit-banner');
  await expect(banner).toBeVisible();
  await expect(banner.locator('.chip', { hasText: 'Nameless Sword' })).toBeVisible();

  await banner.getByRole('button', { name: 'Dismiss' }).click();
  await expect(banner).toHaveCount(0);

  await page.reload();
  await expect(page.locator('.recruit-banner')).toHaveCount(0);

  await page.goto(`${SITE}/members/foobu`);
  await expect(page.locator('.recruit-banner')).toHaveCount(0);
});
