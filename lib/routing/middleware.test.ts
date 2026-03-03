import assert from "node:assert/strict"
import test from "node:test"

import { NextRequest } from "next/server"

import { getOnboardingState, patchOnboardingState } from "@/lib/data/onboarding"
import { middleware } from "@/middleware"

function runMiddleware(url: string, cookieHeader?: string): Response {
  const headers = new Headers()

  if (cookieHeader) {
    headers.set("cookie", cookieHeader)
  }

  return middleware(new NextRequest(url, { headers })) as Response
}

test("middleware order: root with auth cookie redirects to /explore", () => {
  const response = runMiddleware("http://localhost/", "crtv_auth=session-token")
  const location = response.headers.get("location")

  assert.equal(response.status, 307)
  assert.ok(location)

  const redirectUrl = new URL(location)
  assert.notEqual(redirectUrl.pathname, "/")
  assert.equal(redirectUrl.pathname, "/explore")
})

test("middleware order: root without auth cookie stays pass-through", () => {
  const response = runMiddleware("http://localhost/")

  assert.equal(response.status, 200)
  assert.equal(response.headers.get("location"), null)
  assert.equal(response.headers.get("x-middleware-next"), "1")
})

test("canonical redirect smoke: /workspace -> /canvas", () => {
  const response = runMiddleware("http://localhost/workspace")
  const location = response.headers.get("location")

  assert.equal(response.status, 307)
  assert.equal(location ? new URL(location).pathname : null, "/canvas")
})

test("canonical redirect smoke: /dashboard -> /analytics", () => {
  const response = runMiddleware("http://localhost/dashboard")
  const location = response.headers.get("location")

  assert.equal(response.status, 307)
  assert.equal(location ? new URL(location).pathname : null, "/analytics")
})

test("middleware redirects protected routes to onboarding with sanitized next when onboarding is incomplete", () => {
  const onboardingState = getOnboardingState()
  assert.equal(onboardingState.usernameCompleted, false)

  const response = runMiddleware("http://localhost/explore?tab=latest", "crtv_auth=session-token")
  const location = response.headers.get("location")

  assert.equal(response.status, 307)
  assert.ok(location)

  const redirectUrl = new URL(location)
  assert.equal(redirectUrl.pathname, "/onboarding")
  assert.equal(redirectUrl.searchParams.get("next"), "/explore?tab=latest")
})

test("middleware blocks logged-out /analytics access and redirects to / with next", () => {
  const response = runMiddleware("http://localhost/analytics?range=7d")
  const location = response.headers.get("location")

  assert.equal(response.status, 307)
  assert.ok(location)

  const redirectUrl = new URL(location)
  assert.equal(redirectUrl.pathname, "/")
  assert.equal(redirectUrl.searchParams.get("next"), "/analytics?range=7d")
})

test("middleware allows authenticated /analytics access when onboarding is complete", () => {
  patchOnboardingState({ usernameCompleted: true })

  try {
    const response = runMiddleware("http://localhost/analytics", "crtv_auth=session-token")

    assert.equal(response.status, 200)
    assert.equal(response.headers.get("location"), null)
    assert.equal(response.headers.get("x-middleware-next"), "1")
  } finally {
    patchOnboardingState({ usernameCompleted: false })
  }
})

test("middleware allows direct access to /onboarding", () => {
  const response = runMiddleware("http://localhost/onboarding")

  assert.equal(response.status, 200)
  assert.equal(response.headers.get("location"), null)
  assert.equal(response.headers.get("x-middleware-next"), "1")
})

test("middleware leaves /pricing publicly accessible for logged-out requests", () => {
  const response = runMiddleware("http://localhost/pricing")

  assert.equal(response.status, 200)
  assert.equal(response.headers.get("location"), null)
  assert.equal(response.headers.get("x-middleware-next"), "1")
})

test("middleware leaves /about publicly accessible for logged-out requests", () => {
  const response = runMiddleware("http://localhost/about")

  assert.equal(response.status, 200)
  assert.equal(response.headers.get("location"), null)
  assert.equal(response.headers.get("x-middleware-next"), "1")
})

test("middleware leaves /@faiz-intifada publicly accessible for logged-out requests", () => {
  const response = runMiddleware("http://localhost/@faiz-intifada")

  assert.equal(response.status, 200)
  assert.equal(response.headers.get("location"), null)
  assert.equal(response.headers.get("x-middleware-next"), "1")
})
