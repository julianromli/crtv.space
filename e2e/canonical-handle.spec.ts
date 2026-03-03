import { expect, test } from "@playwright/test"

test.describe("canonical handle routes", () => {
  test("redirects mixed-case @handle to lowercase canonical URL", async ({ page }) => {
    await page.goto("/@Faiz-Intifada", { waitUntil: "domcontentloaded" })
    await expect(page).toHaveURL(/\/@faiz-intifada$/)
  })

  test("redirects encoded @handle to canonical URL", async ({ page }) => {
    await page.goto("/%40Faiz-Intifada", { waitUntil: "domcontentloaded" })
    await expect(page).toHaveURL(/\/@faiz-intifada$/)
  })

  test("serves canonical /@handle without additional redirect", async ({ page }) => {
    const response = await page.goto("/@faiz-intifada", { waitUntil: "domcontentloaded" })
    expect(response).not.toBeNull()

    const request = response!.request()
    expect(request.redirectedFrom()).toBeNull()

    const currentUrl = new URL(page.url())
    expect(currentUrl.pathname).toBe("/@faiz-intifada")
  })
})
