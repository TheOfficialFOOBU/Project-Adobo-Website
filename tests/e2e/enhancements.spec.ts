import { expect, test, type Page } from '@playwright/test';

/** GitHub Pages base path — the preview server only serves routes under it. */
const SITE = '/Project-Adobo-Website';

/**
 * Filter chips in the scroll-toolbar (All / Founders / Core / Members)
 * are plain buttons, not ARIA tabs. The roster is a single vertical
 * scroll rather than a tabbed panel.
 */
async function applyFilter(page: Page, label: 'All' | 'Founders' | 'Core' | 'Members') {
  await page.locator('.filter-chips button').getByText(label, { exact: true }).click();
}

test('member search shows an empty state with a working reset', async ({ page }) => {
  await page.goto(`${SITE}/`);
  await expect(page.locator('#member-search')).toBeVisible();

  await page.locator('#member-search').fill('zzzz-no-such-member');

  const emptyState = page.locator('.members-empty');
  await expect(emptyState).toBeVisible();
  await expect(page.locator('.member-row')).toHaveCount(0);

  await emptyState.getByRole('button', { name: /reset/i }).click();
  await expect(emptyState).toHaveCount(0);
  await expect(page.locator('.member-row').first()).toBeVisible();
});

test('roster toolbar state is mirrored to the URL and restored on load', async ({ page }) => {
  await page.goto(`${SITE}/`);
  await expect(page.locator('#member-search')).toBeVisible();

  await page.locator('#member-search').fill('umbrella');
  await applyFilter(page, 'Members');

  await expect(page).toHaveURL(/q=umbrella/);
  await expect(page).toHaveURL(/filter=members/);

  // A fresh load restores the filtered view from the URL.
  await page.goto(`${SITE}/?q=umbrella&filter=members`);
  await expect(page.locator('#member-search')).toHaveValue('umbrella');
  await expect(
    page.locator('.filter-chips button').getByText('Members', { exact: true })
  ).toHaveAttribute('aria-pressed', 'true');
});

test("pressing '/' focuses the roster search", async ({ page }) => {
  await page.goto(`${SITE}/`, { waitUntil: 'networkidle' });
  await expect(page.locator('#member-search')).toBeVisible();

  // Retry until the client-side key handler is attached (hydration).
  for (let i = 0; i < 10; i++) {
    await page.keyboard.press('/');
    const focused = page.locator('#member-search');
    try {
      await expect(focused).toBeFocused({ timeout: 700 });
      return;
    } catch {
      // Not hydrated yet — press again.
    }
  }
  await expect(page.locator('#member-search')).toBeFocused();
});

test('lightbox prev button is disabled on the first image', async ({ page }) => {
  await page.goto(`${SITE}/`);
  await applyFilter(page, 'Core');
  await page.locator('.member-row-photo.lightbox-target').first().click();
  await expect(page.locator('#lightbox.open')).toBeVisible();

  const prevBtn = page.locator('#lb-prev');
  const nextBtn = page.locator('#lb-next');

  // Walk back to the first image of the traversal set.
  for (let i = 0; i < 40 && (await prevBtn.isEnabled()); i++) {
    await prevBtn.click();
  }
  await expect(prevBtn).toBeDisabled();
  await expect(nextBtn).toBeEnabled();

  await nextBtn.click();
  await expect(prevBtn).toBeEnabled();
});

test('profile page shows sticky nav, share button, and back-to-top', async ({ page }) => {
  await page.goto(`${SITE}/members/foobu`);

  // Share button is present.
  await expect(page.getByRole('button', { name: 'Share profile' })).toBeVisible();

  // Sticky bar hidden until scrolled past the dossier's top edge.
  const sticky = page.locator('.profile-sticky-bar');
  await expect(sticky).not.toHaveClass(/is-visible/);
  await page.evaluate(() => window.scrollTo(0, 600));
  await expect(sticky).toHaveClass(/is-visible/);
  await sticky.locator('a').last().click();
  await expect(page.locator('.profile-dossier').first()).toBeVisible();
  await expect(page.locator('.profile-hero-text h1').first()).not.toHaveText('FOOBU');

  // Back-to-top appears after scrolling and returns to the top.
  const backToTop = page.locator('.back-to-top');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect(backToTop).toHaveClass(/is-visible/);
  await backToTop.click();
  await expect.poll(() => page.evaluate(() => window.scrollY), { timeout: 5000 }).toBeLessThan(50);
});
