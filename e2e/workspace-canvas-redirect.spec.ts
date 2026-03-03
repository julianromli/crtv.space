import { expect, test } from "@playwright/test";

test.describe("/workspace canonical redirect", () => {
  test("redirects /workspace to /canvas without a redirect loop", async ({ page }) => {
    const response = await page.goto("/workspace", { waitUntil: "domcontentloaded" });

    expect(response).not.toBeNull();

    const request = response!.request();
    const redirectedFrom = request.redirectedFrom();

    expect(redirectedFrom).not.toBeNull();
    expect(new URL(redirectedFrom!.url()).pathname).toBe("/workspace");
    expect(redirectedFrom!.redirectedFrom()).toBeNull();

    await expect(page).toHaveURL(/\/canvas$/);
    expect(new URL(page.url()).pathname).toBe("/canvas");
  });
});
