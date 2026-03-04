import assert from "node:assert/strict"
import test from "node:test"

import { NextRequest } from "next/server"
import { ONBOARDING_COOKIE_NAME } from "@/lib/routing/cookies"

process.env.CLERK_ENCRYPTION_KEY = "12345678901234567890123456789012"

type MiddlewareFn = (request: NextRequest, event: unknown) => Promise<Response | undefined>

let cachedMiddleware: MiddlewareFn | undefined

async function getMiddleware() {
  if (cachedMiddleware) {
    return cachedMiddleware
  }

  const middlewareModule = await import("@/middleware")
  cachedMiddleware = middlewareModule.default as unknown as MiddlewareFn
  return cachedMiddleware
}

async function runMiddleware(url: string, cookieHeader?: string): Promise<Response> {
  const headers = new Headers()

  if (cookieHeader) {
    headers.set("cookie", cookieHeader)
  }

  const middleware = await getMiddleware()
  return (await middleware(new NextRequest(url, { headers }), {} as never)) as Response
}

test("middleware order: root with auth cookie redirects to /explore", async () => {
  const response = await runMiddleware("http://localhost/", "crtv_auth=session-token")
  const location = response.headers.get("location")
  const setCookie = response.headers.get("set-cookie")

  assert.equal(response.status, 307)
  assert.ok(location)
  assert.ok(setCookie?.includes("crtv_landing_redirected_to_explore=1"))
  assert.ok(setCookie?.includes("HttpOnly"))

  const redirectUrl = new URL(location)
  assert.notEqual(redirectUrl.pathname, "/")
  assert.equal(redirectUrl.pathname, "/explore")
})

test("middleware order: root without auth cookie stays pass-through", async () => {
  const response = await runMiddleware("http://localhost/")

  assert.equal(response.status, 200)
  assert.equal(response.headers.get("location"), null)
})

test("canonical redirect smoke: /workspace -> /canvas", async () => {
  const response = await runMiddleware("http://localhost/workspace")
  const location = response.headers.get("location")

  assert.equal(response.status, 307)
  assert.equal(location ? new URL(location).pathname : null, "/canvas")
})

test("canonical redirect smoke: /dashboard -> /analytics", async () => {
  const response = await runMiddleware("http://localhost/dashboard")
  const location = response.headers.get("location")

  assert.equal(response.status, 307)
  assert.equal(location ? new URL(location).pathname : null, "/analytics")
})

test("middleware redirects protected routes to onboarding with sanitized next when onboarding cookie is incomplete", async () => {
  const response = await runMiddleware(
    "http://localhost/explore?tab=latest",
    `crtv_auth=session-token; ${ONBOARDING_COOKIE_NAME}=0`
  )
  const location = response.headers.get("location")

  assert.equal(response.status, 307)
  assert.ok(location)

  const redirectUrl = new URL(location)
  assert.equal(redirectUrl.pathname, "/onboarding")
  assert.equal(redirectUrl.searchParams.get("next"), "/explore?tab=latest")
})

test("middleware blocks logged-out /analytics access and redirects to /sign-in with redirect_url", async () => {
  const response = await runMiddleware("http://localhost/analytics?range=7d")
  const location = response.headers.get("location")

  assert.equal(response.status, 307)
  assert.ok(location)

  const redirectUrl = new URL(location)
  assert.equal(redirectUrl.pathname, "/sign-in")
  assert.equal(redirectUrl.searchParams.get("redirect_url"), "/analytics?range=7d")
})

test("middleware allows authenticated /analytics access when onboarding cookie is complete", async () => {
  const response = await runMiddleware(
    "http://localhost/analytics",
    `crtv_auth=session-token; ${ONBOARDING_COOKIE_NAME}=1`
  )

  assert.equal(response.status, 200)
  assert.equal(response.headers.get("location"), null)
})

test("middleware allows direct access to /onboarding", async () => {
  const response = await runMiddleware("http://localhost/onboarding")

  assert.equal(response.status, 200)
  assert.equal(response.headers.get("location"), null)
})

test("middleware leaves /pricing publicly accessible for logged-out requests", async () => {
  const response = await runMiddleware("http://localhost/pricing")

  assert.equal(response.status, 200)
  assert.equal(response.headers.get("location"), null)
})

test("middleware leaves /about publicly accessible for logged-out requests", async () => {
  const response = await runMiddleware("http://localhost/about")

  assert.equal(response.status, 200)
  assert.equal(response.headers.get("location"), null)
})

test("middleware leaves /@faiz-intifada publicly accessible for logged-out requests", async () => {
  const response = await runMiddleware("http://localhost/@faiz-intifada")

  assert.equal(response.status, 200)
  assert.equal(response.headers.get("location"), null)
})

test("middleware blocks logged-out nested protected routes and preserves redirect_url", async () => {
  const response = await runMiddleware("http://localhost/canvas/project-123?probe=1")
  const location = response.headers.get("location")

  assert.equal(response.status, 307)
  assert.ok(location)

  const redirectUrl = new URL(location)
  assert.equal(redirectUrl.pathname, "/sign-in")
  assert.equal(redirectUrl.searchParams.get("redirect_url"), "/canvas/project-123?probe=1")
})

test("middleware does not treat partial prefix matches as protected routes", async () => {
  const response = await runMiddleware("http://localhost/canvasx")

  assert.equal(response.status, 200)
  assert.equal(response.headers.get("location"), null)
})
