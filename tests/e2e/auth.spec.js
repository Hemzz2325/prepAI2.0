import { test, expect } from "@playwright/test";

test.describe("Authentication Protection", () => {
  test("unauthenticated user accessing /dashboard is redirected to sign-in", async ({ page }) => {
    // Clear all cookies and storage to ensure we are unauthenticated
    await page.context().clearCookies();
    await page.goto("/dashboard");

    // Clerk redirects to /sign-in when the user is not authenticated
    await expect(page).toHaveURL(/sign-in|login/, { timeout: 10000 });
  });

  test("sign-in page loads and contains the sign-in form", async ({ page }) => {
    await page.goto("/sign-in");
    await expect(page).toHaveURL(/sign-in/);
    // Clerk renders a form with an email/phone input
    const emailInput = page.locator("input[name='identifier'], input[type='email']");
    await expect(emailInput).toBeVisible({ timeout: 10000 });
  });
});
