import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("homepage loads successfully", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/.+/); // Any non-empty title
    await expect(page.locator("body")).toBeVisible();
  });

  test("homepage has a root h1 heading", async ({ page }) => {
    await page.goto("/");
    const h1 = page.locator("h1").first();
    await expect(h1).toBeVisible({ timeout: 10000 });
  });

  test("homepage navigation links work", async ({ page }) => {
    await page.goto("/");
    // Check that major nav links or buttons exist (e.g. Clerk sign-in modal triggers)
    const signInLink = page.locator("button:has-text('Get Started Free'), a[href*='sign-in'], a[href*='login']").first();
    await expect(signInLink).toBeVisible({ timeout: 10000 });
  });

  test("upgrade page loads", async ({ page }) => {
    await page.goto("/upgrade");
    await expect(page.getByText(/upgrade/i).first()).toBeVisible({ timeout: 10000 });
  });
});
