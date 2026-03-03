import { expect, test } from "@playwright/test";

test.describe("/following follow-5 completion gate", () => {
  test.setTimeout(120_000);

  test.beforeEach(async ({ request }) => {
    const patchResponse = await request.patch("/api/onboarding", {
      data: { usernameCompleted: true },
    });
    expect(patchResponse.ok()).toBeTruthy();

    const onboardingResponse = await request.get("/api/onboarding");
    expect(onboardingResponse.ok()).toBeTruthy();
    await expect(onboardingResponse.json()).resolves.toMatchObject({
      onboarding: { usernameCompleted: true },
    });
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
