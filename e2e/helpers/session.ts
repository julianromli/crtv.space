import type { BrowserContext } from "@playwright/test"

const DEFAULT_PLAYWRIGHT_BASE_URL = "http://127.0.0.1:45123"

function resolvePlaywrightBaseUrl() {
  const candidate = process.env.PLAYWRIGHT_BASE_URL ?? DEFAULT_PLAYWRIGHT_BASE_URL

  try {
    return new URL(candidate).toString()
  } catch {
    return DEFAULT_PLAYWRIGHT_BASE_URL
  }
}

export async function setAuthedSessionCookie(context: BrowserContext) {
  const baseUrl = resolvePlaywrightBaseUrl()

  await context.addCookies([
    {
      name: "crtv_auth",
      value: "session-token",
      url: baseUrl,
    },
  ])
}

async function setOnboardingState(context: BrowserContext, usernameCompleted: boolean) {
  const baseUrl = resolvePlaywrightBaseUrl()
  const onboardingApiUrl = new URL("/api/onboarding", baseUrl).toString()

  const response = await context.request.patch(onboardingApiUrl, {
    data: { usernameCompleted },
  })

  if (!response.ok()) {
    throw new Error(`Failed to seed onboarding state: ${response.status()} ${response.statusText()}`)
  }

  await context.addCookies([
    {
      name: "crtv_onboarding_completed",
      value: usernameCompleted ? "1" : "0",
      url: baseUrl,
    },
  ])
}

export async function setOnboardingComplete(context: BrowserContext) {
  await setOnboardingState(context, true)
}

export async function setOnboardingIncomplete(context: BrowserContext) {
  await setOnboardingState(context, false)
}
