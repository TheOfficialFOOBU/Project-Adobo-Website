import { expect, test, type Page } from '@playwright/test';

/** GitHub Pages base path — the preview server only serves routes under it. */
const SITE = '/Project-Adobo-Website';

async function openMembersTab(page: Page) {
  await page.getByRole('tab', { name: 'Members', exact: true }).click();
  await expect(page.locator('#member-search')).toBeVisible();
}

test('member search shows an empty state with a working reset', async ({ page }) => {
  await page.goto(`${SITE}/`);
  await openMembersTab(page);

  await page.locator('#member-search').fill('zzzz-no-such-member');
  // Search filters every roster tab now, so each panel renders its own
  // empty state — target the Members panel's.
  const emptyState = page.locator('#members-tab .members-empty');
  await expect(emptyState).toBeVisible();
  await expect(page.locator('#members-list')).toHaveCount(0);

  await emptyState.getByRole('button', { name: /reset/i }).click();
  await expect(emptyState).toHaveCount(0);
  await expect(page.locator('#members-list .member-card').first()).toBeVisible();
});

test('roster toolbar state is mirrored to the URL and restored on load', async ({ page }) => {
  await page.goto(`${SITE}/`);
  await openMembersTab(page);

  await page.locator('#member-search').fill('umbrella');
  await page.getByRole('button', { name: 'Healer' }).click();

  await expect(page).toHaveURL(/q=umbrella/);
  await expect(page).toHaveURL(/role=Healer/);

  // A fresh load restores the filtered view from the URL.
  await page.goto(`${SITE}/?q=umbrella&role=Healer`);
  await openMembersTab(page);
  await expect(page.locator('#member-search')).toHaveValue('umbrella');
  await expect(page.getByRole('button', { name: 'Healer' })).toHaveAttribute(
    'aria-pressed',
    'true'
  );
});

test("pressing '/' opens the members tab and focuses search", async ({ page }) => {
  await page.goto(`${SITE}/`, { waitUntil: 'networkidle' });
  await expect(page.getByRole('tab', { name: 'Members', exact: true })).toBeVisible();

  // Retry until the client-side key handler is attached (hydration).
  for (let i = 0; i < 10; i++) {
    await page.keyboard.press('/');
    const focused = page.locator('#member-search');
    try {
      await expect(focused).toBeFocused({ timeout: 700 });
      return;
    } catch {
      // Not hydrated / tab not switched yet — press again.
    }
  }
  await expect(page.locator('#member-search')).toBeFocused();
});

test('lightbox prev button is disabled on the first image', async ({ page }) => {
  await page.goto(`${SITE}/`);
  await page.getByRole('tab', { name: 'Core Members' }).click();
  await page.locator('#core-tab .member-card img.lightbox-target').first().click();
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

  // Sticky bar hidden until scrolled past the card's top edge.
  const sticky = page.locator('.profile-sticky-bar');
  await expect(sticky).not.toHaveClass(/is-visible/);
  await page.evaluate(() => window.scrollTo(0, 600));
  await expect(sticky).toHaveClass(/is-visible/);
  await sticky.locator('a').last().click();
  await expect(page.locator('.profile-card h1')).not.toHaveText('FOOBU');

  // Back-to-top appears after scrolling and returns to the top.
  const backToTop = page.locator('.back-to-top');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect(backToTop).toHaveClass(/is-visible/);
  await backToTop.click();
  await expect.poll(() => page.evaluate(() => window.scrollY), { timeout: 5000 }).toBeLessThan(50);
});
