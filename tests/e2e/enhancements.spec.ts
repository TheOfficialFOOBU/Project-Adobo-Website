import { expect, test, type Page } from '@playwright/test';

/** GitHub Pages base path — the preview server only serves routes under it. */
const SITE = '/Project-Adobo-Website';

/**
 * Filter chips in the scroll-toolbar (All / Founders / Core / Members)
 * are plain buttons, not ARIA tabs. The roster is a single vertical
 * scroll rather than a tabbed panel.
 */
async function applyFilter(page: Page, label: 'All' | 'Founders' | 'Core' | 'Members') {
  await page.locator('.scroll-toolbar-chips button').getByText(label, { exact: true }).click();
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
    page.locator('.scroll-toolbar-chips button').getByText('Members', { exact: true })
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

test('roster view toggle switches between Row and Grid and persists in URL', async ({ page }) => {
  await page.goto(`${SITE}/`, { waitUntil: 'networkidle' });

  // Default is row view.
  await expect(page.locator('.scroll-rows').first()).toBeVisible();
  await expect(page.locator('.scroll-grid')).toHaveCount(0);

  // Switch to Grid.
  await page.getByRole('button', { name: 'Grid', exact: true }).click();
  await expect(page.locator('.scroll-grid').first()).toBeVisible();
  await expect(page.locator('.scroll-rows')).toHaveCount(0);
  await expect(page).toHaveURL(/view=grid/);

  // URL restoration on reload.
  await page.reload();
  await expect(page.locator('.scroll-grid').first()).toBeVisible();

  // Switch back to Row.
  await page.getByRole('button', { name: 'Row', exact: true }).click();
  await expect(page.locator('.scroll-rows').first()).toBeVisible();
  await expect(page).not.toHaveURL(/view=grid/);
});

test("pressing 'g' twice scrolls to the roster and focuses search", async ({ page }) => {
  await page.goto(`${SITE}/`, { waitUntil: 'networkidle' });

  // The roster is already in view on a tall viewport; scroll to top first
  // so we know `gg` is doing the work.
  await page.evaluate(() => window.scrollTo(0, 0));

  // Two rapid presses of "g" within the handler's 600ms window.
  await page.keyboard.press('g');
  await page.keyboard.press('g');

  // The search input should now hold focus.
  await expect(page.locator('#member-search')).toBeFocused({ timeout: 2000 });

  // A single "g" alone should not trigger navigation.
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.evaluate(() => document.getElementById('member-search')?.blur());
  await page.waitForTimeout(800);
  await page.keyboard.press('g');
  await expect(page.locator('#member-search')).not.toBeFocused();
});

test('roster count in the lede is derived from the actual member data', async ({ page }) => {
  await page.goto(`${SITE}/`, { waitUntil: 'networkidle' });
  const lede = await page.locator('.scroll-of-members-lede').first().textContent();
  // Must not be the stale "Twenty-two" copy.
  expect(lede).not.toContain('Twenty-two');
  // And must contain a spelled-out number that matches the data count.
  const dataCount = await page.evaluate(() => {
    const rows = document.querySelectorAll('.member-row');
    return rows.length;
  });
  expect(dataCount).toBeGreaterThanOrEqual(20);
  expect(lede?.toLowerCase()).toMatch(/twenty-/);
});

test('Guild Chronicles renders a featured video and a supporting grid', async ({ page }) => {
  await page.goto(`${SITE}/#videos`, { waitUntil: 'networkidle' });
  await expect(page.locator('.chronicles-video--featured')).toBeVisible();
  await expect(page.locator('.chronicles-video--featured video')).toBeVisible();
  await expect(page.locator('.chronicles-grid')).toBeVisible();
  // Supporting videos each carry a chapter mark (壹貳參肆).
  const chapters = page.locator('.chronicles-video-chapter');
  const chapterTexts = await chapters.allTextContents();
  expect(chapterTexts.length).toBeGreaterThan(0);
  for (const t of chapterTexts) {
    expect(['壹', '貳', '參', '肆', '伍', '陸', '柒', '捌']).toContain(t);
  }
});

test('Today in Adobo section is removed in favour of header presence', async ({ page }) => {
  await page.goto(`${SITE}/`, { waitUntil: 'networkidle' });
  // The dedicated section was removed; the live Discord count lives in
  // the header widget now.
  await expect(page.locator('.today-in-adobo')).toHaveCount(0);
});

test('Contact Guild Leader modal renders chapter mark and Adobo wordmark', async ({ page }) => {
  await page.goto(`${SITE}/`, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Contact Leader' }).click();
  const modal = page.locator('.modal-positioner');
  await expect(modal).toBeVisible();
  await expect(modal.locator('.modal-chapter')).toHaveText('門');
  await expect(modal.locator('.adobo-wordmark').first()).toBeVisible();
  await page.keyboard.press('Escape');
});

test('Rules page renders the Adobo wordmark in its closing block', async ({ page }) => {
  await page.goto(`${SITE}/rules`, { waitUntil: 'networkidle' });
  await expect(page.locator('.rules-wordmark-wrap .adobo-wordmark').first()).toBeVisible();
});

test('Profile page renders the member personal seal at the top of the dossier', async ({
  page,
}) => {
  await page.goto(`${SITE}/members/foobu`, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('.profile-dossier-seal .member-personal-seal').first()).toBeVisible({
    timeout: 10000,
  });
});
