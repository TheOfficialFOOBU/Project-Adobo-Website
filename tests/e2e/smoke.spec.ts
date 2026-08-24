import { expect, test, type Page } from '@playwright/test';

const SHOT_DIR = 'test-results/screenshots';

/** GitHub Pages base path — the preview server only serves routes under it. */
const SITE = '/Project-Adobo-Website';

/**
 * Scroll through the whole page to trigger every [data-animate] reveal
 * (IntersectionObserver does not fire during Playwright's virtual
 * full-page screenshot scroll), then return to the top.
 */
async function revealAll(page: Page) {
  await page.evaluate(async () => {
    await new Promise<void>((resolve) => {
      let y = 0;
      const step = () => {
        y += 600;
        window.scrollTo(0, y);
        if (y >= document.body.scrollHeight) resolve();
        else setTimeout(step, 60);
      };
      step();
    });
  });
  await page.waitForTimeout(900); // allow the 0.75s reveal transitions to finish
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
}

test('homepage renders with full functionality and captures design snapshots', async ({ page }) => {
  // Pin the OS scheme so the inline theme script boots deterministically dark.
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');

  // Page + branding
  await expect(page).toHaveTitle(/Adobo Guild - Where Winds Meet/);
  await expect(page.locator('.logo-text')).toHaveText('ADOBO');
  await expect(page.locator('.hero h1')).toBeVisible();

  // Roster tabs + flip cards (founders panel is active by default).
  // NOTE: clicking the card's center hits the photo, which intentionally
  // opens the lightbox instead of flipping — so flip via keyboard (Enter),
  // mirroring the original accessibility behavior.
  const founders = page.locator('#team [data-state="active"] .member-card');
  await expect(founders.first()).toBeVisible();
  await founders.first().press('Enter');
  await expect(founders.first()).toHaveClass(/is-flipped/);

  await page.getByRole('tab', { name: 'Core Members' }).click();
  await expect(page.locator('#core-tab .member-card').first()).toBeVisible();

  // Members tab: search present + surfaced sort control works
  await page.getByRole('tab', { name: 'Members', exact: true }).click();
  const sortSelect = page.locator('#sort-select');
  await expect(sortSelect).toBeVisible();
  await sortSelect.selectOption('weapon');
  await expect(page.locator('#members-list .member-card')).toHaveCount(12);

  // Lightbox from a member photo (Core tab re-selected; see note below).
  // Activity images are intentionally NOT used here: the hover overlay
  // (opacity 0, pointer-events enabled) sits above them and swallows
  // clicks — identical to the original site.
  await page.getByRole('tab', { name: 'Core Members' }).click();
  await page.locator('#core-tab .member-card img.lightbox-target').first().click();
  await expect(page.locator('#lightbox.open')).toBeVisible();
  await expect(page.locator('#lb-image')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('#lightbox.open')).toHaveCount(0);

  // Contact leader modal (Radix dialog)
  await page.getByRole('button', { name: 'Contact Leader' }).click();
  const modal = page.locator('[role="dialog"].modal-positioner');
  await expect(modal.locator('.modal-title')).toHaveText('Contact Guild Leader');
  await page.keyboard.press('Escape');
  await expect(modal).toHaveCount(0);

  // Background music toggle injected and present
  await expect(page.getByRole('button', { name: 'Toggle background music' })).toBeVisible();

  // Theme toggle flips <html data-theme> and persists across reloads
  const themeToggle = page.getByRole('button', { name: /Switch to (light|dark) theme/ });
  await expect(themeToggle).toBeVisible();
  await themeToggle.click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  // Return to the default dark theme so the design snapshots stay canonical.
  await page.getByRole('button', { name: 'Switch to dark theme' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

  // Design snapshots at desktop / tablet / mobile viewports
  for (const [width, height, name] of [
    [1366, 900, 'desktop'],
    [820, 1180, 'tablet'],
    [390, 844, 'mobile'],
  ] as const) {
    await page.setViewportSize({ width, height });
    await page.goto('/');
    await revealAll(page);
    await page.screenshot({ path: `${SHOT_DIR}/${name}.png`, fullPage: true });
  }
});

test('activity lightbox deep-links via URL hash', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto(`${SITE}/#activity-prison-break`);
  await expect(page.locator('#lightbox.open')).toBeVisible();
  await expect(page.locator('#lb-image')).toBeVisible();
  await expect(page.locator('#lb-caption')).toHaveText('Tournament Victory');

  // Closing the viewer clears the hash.
  await page.keyboard.press('Escape');
  await expect(page.locator('#lightbox.open')).toHaveCount(0);
  await expect(page).not.toHaveURL(/#/);
});

test('member profile pages render statically and cross-link', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto(`${SITE}/members/foobu`);
  await expect(page.locator('.profile-card h1')).toHaveText('FOOBU');
  await expect(page.locator('.profile-badge')).toHaveText('Guild Master');

  // Prev/next roster navigation reaches another profile.
  await page.locator('.profile-nav a').last().click();
  await expect(page.locator('.profile-card h1')).not.toHaveText('FOOBU');

  // Unknown slugs hit the branded 404.
  const missing = await page.goto(`${SITE}/members/does-not-exist`);
  expect(missing?.status()).toBe(404);
});

test('returning home from a member profile re-arms scroll reveals', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto(`${SITE}/`);
  await expect(page.locator('.hero h1')).toBeVisible();

  // Flip the first founder card (keyboard — see note in the smoke test above)
  // and follow the client-side link to the profile page.
  const founders = page.locator('#team [data-state="active"] .member-card');
  await founders.first().press('Enter');
  await page.locator('.member-profile-link').first().click();
  await expect(page.locator('.profile-card h1')).toBeVisible();

  // “Back to the Guild” — another client-side (next/link) navigation.
  await page.locator('.profile-back').click();
  await expect(page).toHaveURL(/\/Project-Adobo-Website\/?$/);

  // Regression guard: the freshly mounted home sections used to stay at
  // opacity 0 because the reveal observer never saw the new DOM.
  await page.locator('#team').scrollIntoViewIfNeeded();
  await expect(page.locator('#team')).toHaveClass(/in-view/, { timeout: 5000 });
  await expect(page.locator('#team')).toHaveCSS('opacity', '1');

  // Scrolling further up must keep revealing (observer still live).
  await page.locator('#philosophy').scrollIntoViewIfNeeded();
  await expect(page.locator('#philosophy')).toHaveClass(/in-view/);
});

test('unknown route serves the branded 404', async ({ page }) => {
  const response = await page.goto('/does-not-exist', { waitUntil: 'domcontentloaded' });
  expect(response?.status()).toBe(404);
  await expect(page.locator('.cta-button')).toHaveText('Back to Home');
});
