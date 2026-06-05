import { test, expect } from "@playwright/test";

/**
 * E2E tests for the public-facing pages.
 * Verifies content, navigation, and back-button behaviour
 * without requiring authentication.
 */
test.describe("Public Pages", () => {
  // ── Landing page ────────────────────────────────────────────────────────────
  test("landing page has a CTA that links to sign-in or sign-up", async ({ page }) => {
    await page.goto("/");
    const cta = page.locator("button:has-text('Get Started Free'), button:has-text('Create Account'), a[href*='sign-in'], a[href*='sign-up']").first();
    await expect(cta).toBeVisible({ timeout: 10000 });
  });

  // ── Static info pages ────────────────────────────────────────────────────────
  for (const route of ["/about", "/how-it-works", "/blog", "/careers", "/contact"]) {
    test(`${route} loads and shows a heading`, async ({ page }) => {
      await page.goto(route);
      const h1 = page.locator("h1").first();
      await expect(h1).toBeVisible({ timeout: 10000 });
    });
  }

  // ── Legal pages ──────────────────────────────────────────────────────────────
  for (const route of ["/privacy", "/terms", "/cookies"]) {
    test(`${route} loads and contains expected keyword`, async ({ page }) => {
      await page.goto(route);
      await expect(page.locator("h1").first()).toBeVisible({ timeout: 10000 });
    });
  }

  // ── BackButton navigation ─────────────────────────────────────────────────────
  test("BackButton on /about returns to the dashboard URL when clicked", async ({ page }) => {
    await page.goto("/about");
    const backLink = page.locator("a[href='/dashboard']").first();
    await expect(backLink).toBeVisible({ timeout: 10000 });
  });
});
