import { expect, test } from "@playwright/test";
import { setAuthedSessionCookie, setOnboardingComplete } from "./helpers/session";

test.describe("/workspace canonical redirect", () => {
  test("redirects /workspace to /canvas without a redirect loop", async ({ page, context }) => {
    await setAuthedSessionCookie(context);
    await setOnboardingComplete(context);

    const response = await page.goto("/workspace", { waitUntil: "domcontentloaded" });

    expect(response).not.toBeNull();

    const responseRequest = response!.request();
    const redirectHops = [];
    let cursor = responseRequest.redirectedFrom();
    while (cursor) {
      redirectHops.push(new URL(cursor.url()).pathname);
      cursor = cursor.redirectedFrom();
    }

    await expect(page).toHaveURL(/\/canvas$/);
    expect(new URL(page.url()).pathname).toBe("/canvas");
    expect(redirectHops).toContain("/workspace");
    expect(redirectHops.filter((path) => path === "/workspace")).toHaveLength(1);
  });
});
