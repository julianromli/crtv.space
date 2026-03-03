import { expect, test } from "@playwright/test"
import { setAuthedSessionCookie, setOnboardingComplete, setOnboardingIncomplete } from "./helpers/session"

test.describe("route access matrix", () => {
  test("logged-out user can access public routes without middleware redirect", async ({ page }) => {
    const publicRoutes = ["/", "/pricing", "/about", "/@faiz-intifada"]

    for (const route of publicRoutes) {
      await page.goto(route, { waitUntil: "domcontentloaded" })
      const currentUrl = new URL(page.url())
      expect(currentUrl.pathname).toBe(route)
    }
  })

  test("logged-out user is redirected to / with next on protected routes", async ({ page }) => {
    const protectedRoutes = ["/explore", "/following", "/search", "/analytics", "/canvas", "/billing"]

    for (const route of protectedRoutes) {
      await page.goto(`${route}?probe=1`, { waitUntil: "domcontentloaded" })
      const currentUrl = new URL(page.url())
      expect(currentUrl.pathname).toBe("/")
      expect(currentUrl.searchParams.get("next")).toBe(`${route}?probe=1`)
    }
  })

  test("logged-in onboarding-incomplete user is redirected to /onboarding with next", async ({
    page,
    context,
  }) => {
    await setAuthedSessionCookie(context)
    await setOnboardingIncomplete(context)

    const protectedRoutes = ["/explore", "/following", "/search", "/analytics", "/canvas", "/billing"]

    for (const route of protectedRoutes) {
      await page.goto(`${route}?probe=1`, { waitUntil: "domcontentloaded" })
      const currentUrl = new URL(page.url())
      expect(currentUrl.pathname).toBe("/onboarding")
      expect(currentUrl.searchParams.get("next")).toBe(`${route}?probe=1`)
    }

    await page.goto("/onboarding", { waitUntil: "domcontentloaded" })
    const onboardingUrl = new URL(page.url())
    expect(onboardingUrl.pathname).toBe("/onboarding")
  })

  test("logged-in onboarding-complete user can access protected routes", async ({ page, context }) => {
    await setAuthedSessionCookie(context)
    await setOnboardingComplete(context)

    const protectedRoutes = ["/explore", "/following", "/search", "/analytics", "/canvas", "/billing"]

    for (const route of protectedRoutes) {
      await page.goto(route, { waitUntil: "domcontentloaded" })
      const currentUrl = new URL(page.url())
      expect(currentUrl.pathname).toBe(route)
    }
  })

  test("logged-in user landing on / is redirected to /explore", async ({ page, context }) => {
    await setAuthedSessionCookie(context)
    await setOnboardingComplete(context)

    await page.goto("/", { waitUntil: "domcontentloaded" })
    await expect(page).toHaveURL(/\/explore$/)
  })
})
