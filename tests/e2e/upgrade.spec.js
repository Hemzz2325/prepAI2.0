import { test, expect } from "@playwright/test";

/**
 * E2E tests for the /upgrade page and Razorpay payment flow.
 * Tests what is possible without real credentials:
 * the UI renders correctly and the upgrade button is present.
 */
test.describe("Upgrade / Payment Page", () => {
  test("upgrade page loads with a visible heading", async ({ page }) => {
    await page.goto("/upgrade");
    const heading = page.locator("h1, h2").first();
    await expect(heading).toBeVisible({ timeout: 10000 });
  });

  test("upgrade page shows a price or plan description", async ({ page }) => {
    await page.goto("/upgrade");
    // Should mention ₹, Pro, or a price somewhere
    const body = page.locator("body");
    await expect(body).toContainText(/pro|₹|price|upgrade/i, { timeout: 10000 });
  });

  test("upgrade page has a payment/upgrade CTA button", async ({ page }) => {
    await page.goto("/upgrade");
    // Look for a button or link mentioning upgrade / pay / pro
    const cta = page.locator("button, a").filter({ hasText: /upgrade|pay|get pro/i }).first();
    await expect(cta).toBeVisible({ timeout: 10000 });
  });

  test("upgrade page is accessible without authentication", async ({ page }) => {
    await page.context().clearCookies();
    const response = await page.goto("/upgrade");
    // Should not return 404 or 500
    expect(response?.status()).toBeLessThan(400);
  });
});
