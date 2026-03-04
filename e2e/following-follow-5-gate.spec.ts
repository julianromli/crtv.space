import { expect, test } from "@playwright/test";
import { setAuthedSessionCookie, setOnboardingComplete } from "./helpers/session";

test.describe("/following follow-5 completion gate", () => {
  test.setTimeout(120_000);

  test.beforeEach(async ({ context }) => {
    await setAuthedSessionCookie(context);
    await setOnboardingComplete(context);
  });

  test("locks the feed when count is below threshold", async ({ page }) => {
    await page.goto("/following?count=4");

    await expect(
      page.getByRole("heading", { name: "Unlock your following feed" }),
    ).toBeVisible();
    await expect(page.getByText("Progress: 4/5")).toBeVisible();
    await expect(page.getByText("Following feed unlocked.")).toHaveCount(0);
  });

  test("unlocks the feed when count reaches threshold", async ({ page }) => {
    await page.goto("/following?count=5");

    await expect(page.getByText("Following feed unlocked.")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Unlock your following feed" }),
    ).toHaveCount(0);
  });
});
