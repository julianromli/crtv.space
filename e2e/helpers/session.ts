import type { BrowserContext } from "@playwright/test"

export async function setAuthedSessionCookie(context: BrowserContext) {
  await context.addCookies([
    {
      name: "crtv_auth",
      value: "session-token",
      path: "/",
      domain: "127.0.0.1",
    },
  ])
}

export async function setOnboardingComplete(context: BrowserContext) {
  await context.addCookies([
    {
      name: "crtv_onboarding_completed",
      value: "1",
      path: "/",
      domain: "127.0.0.1",
    },
  ])
}

export async function setOnboardingIncomplete(context: BrowserContext) {
  await context.addCookies([
    {
      name: "crtv_onboarding_completed",
      value: "0",
      path: "/",
      domain: "127.0.0.1",
    },
  ])
}
