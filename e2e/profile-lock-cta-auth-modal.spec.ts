import { expect, test } from "@playwright/test";

test.describe("/@faiz-intifada lock CTA auth modal", () => {
  test("opens auth modal from lock CTA and closes it", async ({ page }) => {
    await page.goto("/@faiz-intifada", { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle");

    await page.getByRole("button", { name: "Sign In", exact: true }).click();

    await expect(
      page.getByRole("heading", { name: "Sign in required" }),
    ).toBeVisible();
    await expect(
      page.getByText(
        "Create an account or sign in to unlock this creator's private sections.",
      ),
    ).toBeVisible();

    await page.getByRole("button", { name: "Maybe later" }).click();

    await expect(
      page.getByRole("heading", { name: "Sign in required" }),
    ).toHaveCount(0);
  });
});
