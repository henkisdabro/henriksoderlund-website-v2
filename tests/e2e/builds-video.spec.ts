import { test, expect } from './fixtures';

// The /builds overlay plays a looping screen recording (#54). It has to stay
// on its poster frame for visitors who prefer reduced motion, and carry
// native controls so anyone can pause it (WCAG 2.2.2).

// The recordings are H.264, which the open-source headless shell cannot
// decode, so this spec takes full Chrome, as bfcache.spec.ts does.
test.use({ channel: 'chrome' });

const openVideoBuild = async (page: import('@playwright/test').Page) => {
  await page.goto('/builds');
  await page.locator('.build-card--video .build-shot').first().click();
  const video = page.locator('#build-dialog video');
  await expect(video).toBeVisible();
  return video;
};

const paused = (video: import('@playwright/test').Locator) =>
  video.evaluate((v: HTMLVideoElement) => v.paused);

test('the overlay recording plays, and its native controls pause it', async ({ page }) => {
  const video = await openVideoBuild(page);
  await expect.poll(() => paused(video)).toBe(false);
  await expect(video).toHaveAttribute('controls', '');

  await video.focus();
  await page.keyboard.press('Space');
  await expect.poll(() => paused(video)).toBe(true);

  await video.click();
  await expect.poll(() => paused(video)).toBe(false);
  await video.click();
  await expect.poll(() => paused(video)).toBe(true);
});

test.describe('with reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('the overlay recording stays on its poster frame', async ({ page }) => {
    const video = await openVideoBuild(page);
    // Give a play() call, if one were made, time to start the recording.
    await page.waitForTimeout(500);
    expect(await paused(video)).toBe(true);
  });
});

test('a refused play() raises no unhandled rejection', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.addInitScript(() => {
    HTMLMediaElement.prototype.play = () => Promise.reject(new DOMException('refused', 'NotAllowedError'));
  });
  await openVideoBuild(page);
  await page.waitForTimeout(500);
  expect(errors).toEqual([]);
});
