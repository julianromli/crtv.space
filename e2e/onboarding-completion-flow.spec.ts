import { expect, test } from "@playwright/test"
import { setAuthedSessionCookie, setOnboardingComplete, setOnboardingIncomplete } from "./helpers/session"

test.describe("onboarding completion flow", () => {
  test("authenticated onboarding-incomplete user is gated, then can reach /explore after completion", async ({
    page,
    context,
  }) => {
    await setAuthedSessionCookie(context)
    await setOnboardingIncomplete(context)

    await page.goto("/explore", { waitUntil: "domcontentloaded" })
    let currentUrl = new URL(page.url())
    expect(currentUrl.pathname).toBe("/onboarding")
    expect(currentUrl.searchParams.get("next")).toBe("/explore")

    await setOnboardingComplete(context)
    await page.goto("/", { waitUntil: "domcontentloaded" })
    await expect(page).toHaveURL(/\/explore$/)
  })
})
