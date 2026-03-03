import { expect, test } from "@playwright/test";

test.describe("/@faiz-intifada profile lock visual states", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("locked state visual baseline", async ({ page }) => {
    await page.goto("/@faiz-intifada", { waitUntil: "domcontentloaded" });

    await expect(page.getByText("Portfolio is locked")).toBeVisible();
    await expect(page.locator("main")).toHaveScreenshot(
      "profile-faiz-locked-main.png",
    );
  });

  test("unlocked state visual baseline", async ({ page }) => {
    await page.goto("/@faiz-intifada?viewerMode=logged_in", {
      waitUntil: "domcontentloaded",
    });

    await expect(page.getByText("Portfolio is locked")).toHaveCount(0);
    await expect(page.locator("main")).toHaveScreenshot(
      "profile-faiz-unlocked-main.png",
    );
  });
});
